from app.config import settings
from app.modules.auth.exceptions import InvalidToken
from app.modules.auth.schemas import AuthStatus, TokenPair
from app.modules.auth.strategies.github import GitHubStrategy
from app.modules.auth.strategies.google import GoogleStrategy
from app.modules.auth.strategies.jwt import JWTStrategy
from app.modules.users.model import User
from app.modules.users.service import UserService
from fastapi import Response


class AuthService:
    def __init__(self, user_service: UserService):
        self.user_service = user_service
        self.jwt = JWTStrategy()
        self.github = GitHubStrategy()
        self.google = GoogleStrategy()

    def get_github_authorize_url(self, state: str) -> str:
        return self.github.get_authorize_url(state)

    async def handle_github_callback(self, code: str, response: Response) -> User:
        access_token = await self.github.exchange_code(code)
        profile = await self.github.get_user(access_token)
        user = await self.user_service.find_or_create_github_user(
            github_id=profile["id"],
            username=profile["username"],
            email=profile["email"],
            avatar_url=profile["avatar_url"],
        )
        await self._issue_tokens(user, response)
        return user

    def get_google_authorize_url(self, state: str) -> str:
        return self.google.get_authorize_url(state)

    async def handle_google_callback(self, code: str, response: Response) -> User:
        access_token = await self.google.exchange_code(code)
        profile = await self.google.get_user(access_token)
        user = await self.user_service.find_or_create_google_user(
            google_id=profile["id"],
            username=profile["username"],
            email=profile["email"],
            avatar_url=profile["avatar_url"],
        )
        await self._issue_tokens(user, response)
        return user

    async def refresh_tokens(self, refresh_token: str, response: Response) -> User:
        user_id = self.jwt.decode_refresh_token(refresh_token)
        user = await self.user_service.find_by_id(user_id)
        if not user or user.refresh_token != refresh_token:
            raise InvalidToken()
        await self._issue_tokens(user, response)
        return user

    async def logout(self, user: User, response: Response) -> None:
        await self.user_service.update_refresh_token(user, None)
        self._clear_cookies(response)

    def get_auth_status(self, user: User | None) -> AuthStatus:
        if not user:
            return AuthStatus(authenticated=False)
        return AuthStatus(authenticated=True, user=user)

    async def _issue_tokens(self, user: User, response: Response) -> TokenPair:
        tokens = self.jwt.create_token_pair(user.id)
        await self.user_service.update_refresh_token(user, tokens.refresh_token)
        self._set_cookies(response, tokens)
        return tokens

    def _set_cookies(self, response: Response, tokens: TokenPair) -> None:
        response.set_cookie(
            key="access_token",
            value=tokens.access_token,
            httponly=True,
            secure=not settings.debug,
            samesite="lax",
            max_age=settings.access_token_expire_minutes * 60,
            path="/",
        )
        response.set_cookie(
            key="refresh_token",
            value=tokens.refresh_token,
            httponly=True,
            secure=not settings.debug,
            samesite="lax",
            max_age=settings.refresh_token_expire_days * 86400,
            path="/",
        )

    def _clear_cookies(self, response: Response) -> None:
        response.delete_cookie("access_token", path="/")
        response.delete_cookie("refresh_token", path="/")
