from app.database import get_db
from app.modules.auth.exceptions import InvalidToken
from app.modules.auth.strategies.jwt import JWTStrategy
from app.modules.users.model import User
from app.modules.users.repo import UserRepository
from fastapi import Cookie, Depends
from sqlalchemy.ext.asyncio import AsyncSession


async def get_current_user(
    access_token: str | None = Cookie(default=None),
    db: AsyncSession = Depends(get_db),
) -> User:
    if not access_token:
        raise InvalidToken()

    jwt = JWTStrategy()
    user_id = jwt.decode_access_token(access_token)

    repo = UserRepository(db)
    user = await repo.find_by_id(user_id)
    if not user:
        raise InvalidToken()

    return user


async def get_optional_user(
    access_token: str | None = Cookie(default=None),
    db: AsyncSession = Depends(get_db),
) -> User | None:
    if not access_token:
        return None

    try:
        jwt = JWTStrategy()
        user_id = jwt.decode_access_token(access_token)
        repo = UserRepository(db)
        return await repo.find_by_id(user_id)
    except Exception:
        return None
