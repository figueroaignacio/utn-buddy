from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr


class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    username: str
    email: str | None
    avatar_url: str | None
    created_at: datetime
    updated_at: datetime


class UserUpdate(BaseModel):
    username: str | None = None
    email: EmailStr | None = None
