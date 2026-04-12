from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass
class JobData:
    title: str
    company: str
    url: str
    platform: str
    location: str | None = None
    salary: str | None = None
    description: str | None = None


class BaseCollector(ABC):
    def __init__(self, headless: bool = True) -> None:

        self.headless = headless

    @abstractmethod
    async def search(self, query: str, location: str = "") -> list[JobData]: ...

    @abstractmethod
    async def get_description(self, url: str) -> str | None: ...
