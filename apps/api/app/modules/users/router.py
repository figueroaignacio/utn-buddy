from app.database import get_db
from app.modules.auth.deps import get_current_user
from app.modules.users.model import User
from app.modules.users.schemas import UserRead, UserUpdate
from app.modules.users.service import UserService
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/users", tags=["users"])


def get_user_service(db: AsyncSession = Depends(get_db)) -> UserService:
    return UserService(db)


@router.get("/me", response_model=UserRead)
async def get_me(user: User = Depends(get_current_user)):
    return user


@router.patch("/me", response_model=UserRead)
async def update_me(
    dto: UserUpdate,
    user: User = Depends(get_current_user),
    svc: UserService = Depends(get_user_service),
):
    return await svc.update(user, dto)
