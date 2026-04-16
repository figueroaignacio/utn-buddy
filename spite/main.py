from contextlib import asynccontextmanager

from fastapi import FastAPI

from spite import __version__
from spite.api.v1.router import api_router
from spite.core.database import Base, engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    await engine.dispose()


app = FastAPI(
    title="spite",
    description="Job hunting automation API. Cynicism included at no extra charge.",
    version=__version__,
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

app.include_router(api_router, prefix="/api/v1")


@app.get("/health", tags=["meta"])
async def health_check() -> dict[str, str]:
    return {"status": "operational", "message": "Unfortunately, still running."}
