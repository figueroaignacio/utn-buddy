from fastapi import APIRouter
from spite.api.v1.endpoints import jobs, search

api_router = APIRouter()
api_router.include_router(jobs.router, prefix="/jobs", tags=["jobs"])
api_router.include_router(search.router, prefix="/search", tags=["search"])
