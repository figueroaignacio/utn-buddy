from app.modules.users.model import User
from app.modules.users.repo import UserRepository
from app.modules.users.schemas import UserUpdate
from sqlalchemy.ext.asyncio import AsyncSession


class UserService:
    def __init__(self, db: AsyncSession):
        self.repo = UserRepository(db)

    async def find_by_id(self, user_id: str) -> User | None:
        return await self.repo.find_by_id(user_id)

    async def find_by_github_id(self, github_id: str) -> User | None:
        return await self.repo.find_by_github_id(github_id)

    async def find_by_google_id(self, google_id: str) -> User | None:
        return await self.repo.find_by_google_id(google_id)

    async def find_or_create_github_user(
        self, github_id: str, username: str, email: str | None, avatar_url: str | None
    ) -> User:
        user = await self.repo.find_by_github_id(github_id)
        if user:
            return user
        return await self.repo.create(
            github_id=github_id,
            username=username,
            email=email,
            avatar_url=avatar_url,
        )

    async def find_or_create_google_user(
        self, google_id: str, username: str, email: str | None, avatar_url: str | None
    ) -> User:
        user = await self.repo.find_by_google_id(google_id)
        if user:
            return user
        return await self.repo.create(
            google_id=google_id,
            username=username,
            email=email,
            avatar_url=avatar_url,
        )

    async def update_refresh_token(self, user: User, refresh_token: str | None) -> User:
        return await self.repo.update(user, refresh_token=refresh_token)

    async def update(self, user: User, dto: UserUpdate) -> User:
        data = dto.model_dump(exclude_none=True)
        return await self.repo.update(user, **data)
