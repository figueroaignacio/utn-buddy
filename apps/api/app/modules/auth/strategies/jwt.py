from datetime import datetime, timedelta, timezone

from app.config import settings
from app.modules.auth.exceptions import InvalidToken
from app.modules.auth.schemas import TokenPair
from jose import JWTError, jwt


class JWTStrategy:
    def create_token_pair(self, user_id: str) -> TokenPair:
        return TokenPair(
            access_token=self._create_token(
                user_id,
                settings.access_token_expire_minutes,
                settings.jwt_access_secret,
            ),
            refresh_token=self._create_token(
                user_id,
                settings.refresh_token_expire_days * 60 * 24,
                settings.jwt_refresh_secret,
            ),
        )

    def decode_access_token(self, token: str) -> str:
        return self._decode(token, settings.jwt_access_secret)

    def decode_refresh_token(self, token: str) -> str:
        return self._decode(token, settings.jwt_refresh_secret)

    def _create_token(self, user_id: str, expire_minutes: int, secret: str) -> str:
        expire = datetime.now(timezone.utc) + timedelta(minutes=expire_minutes)
        return jwt.encode(
            {"sub": user_id, "exp": expire},
            secret,
            algorithm="HS256",
        )

    def _decode(self, token: str, secret: str) -> str:
        try:
            payload = jwt.decode(token, secret, algorithms=["HS256"])
            user_id: str = payload.get("sub")
            if not user_id:
                raise InvalidToken()
            return user_id
        except JWTError:
            raise InvalidToken()
