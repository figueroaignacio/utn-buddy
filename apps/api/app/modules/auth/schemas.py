from app.modules.users.schemas import UserRead
from pydantic import BaseModel


class TokenPair(BaseModel):
    access_token: str
    refresh_token: str


class AuthStatus(BaseModel):
    authenticated: bool
    user: UserRead | None = None
