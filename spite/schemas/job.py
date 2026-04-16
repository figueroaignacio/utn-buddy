from pydantic import BaseModel

from spite.models.job import JobStatus


class JobBase(BaseModel):
    title: str
    company: str
    url: str
    platform: str
    location: str | None = None
    salary: str | None = None
    description: str | None = None


class JobCreate(JobBase):
    pass


class JobUpdate(BaseModel):
    title: str | None = None
    company: str | None = None
    url: str | None = None
    platform: str | None = None
    location: str | None = None
    salary: str | None = None
    description: str | None = None
    score: float | None = None
    score_summary: str | None = None
    score_reasoning: str | None = None
    red_flags: list[str] | None = None
    green_flags: list[str] | None = None
    status: JobStatus | None = None


class JobResponse(JobBase):
    id: int
    score: float | None = None
    score_summary: str | None = None
    score_reasoning: str | None = None
    red_flags: list[str] | None = None
    green_flags: list[str] | None = None
    status: JobStatus

    model_config = {"from_attributes": True}


class StatusUpdate(BaseModel):
    status: JobStatus
