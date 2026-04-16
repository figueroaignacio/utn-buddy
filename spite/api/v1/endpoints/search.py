import asyncio

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
import logging

from spite.collectors.linkedin import LinkedInCollector
from spite.api.dependencies import get_db
from spite.schemas.search import SearchRequest, SearchResult
from spite.schemas.job import JobCreate, JobUpdate
from spite.repositories.job_repository import job_repository
from spite.services.gemini import gemini_service

router = APIRouter()
logger = logging.getLogger(__name__)

async def _run_search(
    query: str,
    location: str,
    hours: int,
    max_jobs: int,
    headless: bool,
    score: bool,
    db: AsyncSession,
) -> SearchResult:
    collector = LinkedInCollector(headless=headless)
    jobs = await collector.search(query, location, hours=hours, max_jobs=max_jobs)

    found = len(jobs)
    saved = 0
    duplicates = 0
    scored = 0

    for job_data in jobs:
        existing_job = await job_repository.get_by_url(db, job_data.url)
        if existing_job:
            duplicates += 1
            continue

        try:
            job = await job_repository.create(
                db,
                JobCreate(
                    title=job_data.title,
                    company=job_data.company,
                    url=job_data.url,
                    platform=job_data.platform,
                    location=job_data.location,
                    salary=job_data.salary,
                    description=job_data.description,
                ),
            )
            saved += 1
            await db.commit()
            
            if score:
                description = await collector.get_description(job_data.url)

                if description:
                    description = description[:500]
                    await job_repository.update(db, job, JobUpdate(description=description))
                    await db.commit()

                result = await asyncio.to_thread(
                    gemini_service.score_job,
                    query=query,
                    title=job_data.title,
                    company=job_data.company,
                    description=description or "",
                    location=job_data.location,
                    salary=job_data.salary,
                )

                await job_repository.update(
                    db,
                    job,
                    JobUpdate(
                        score=result["score"],
                        score_summary=result.get("summary", ""),
                        score_reasoning=None,
                        red_flags=None,
                        green_flags=None,
                    )
                )
                await db.commit()
                scored += 1
                await asyncio.sleep(6) # the original code had time.sleep(6)

        except IntegrityError:
            await db.rollback()
            duplicates += 1

    return SearchResult(found=found, saved=saved, duplicates=duplicates, scored=scored)


@router.post("/", response_model=SearchResult)
async def run_search(body: SearchRequest, db: AsyncSession = Depends(get_db)):
    """Scrape jobs and score them with Gemini."""
    return await _run_search(
        query=body.query,
        location=body.location,
        hours=body.hours,
        max_jobs=body.max_jobs,
        headless=body.headless,
        score=body.score,
        db=db,
    )
