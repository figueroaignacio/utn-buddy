import httpx
from app.config import settings
from app.modules.auth.exceptions import OAuthError


class GoogleStrategy:
    AUTHORIZE_URL = "https://accounts.google.com/o/oauth2/v2/auth"
    TOKEN_URL = "https://oauth2.googleapis.com/token"
    USER_URL = "https://www.googleapis.com/oauth2/v2/userinfo"

    def get_authorize_url(self, state: str) -> str:
        params = {
            "client_id": settings.google_client_id,
            "redirect_uri": f"{settings.api_url}/api/auth/google/callback",
            "response_type": "code",
            "scope": "openid email profile",
            "state": state,
        }
        query = "&".join(f"{k}={v}" for k, v in params.items())
        return f"{self.AUTHORIZE_URL}?{query}"

    async def exchange_code(self, code: str) -> str:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                self.TOKEN_URL,
                data={
                    "client_id": settings.google_client_id,
                    "client_secret": settings.google_client_secret,
                    "code": code,
                    "grant_type": "authorization_code",
                    "redirect_uri": f"{settings.api_url}/api/auth/google/callback",
                },
            )
            data = response.json()
            access_token = data.get("access_token")
            if not access_token:
                raise OAuthError("Failed to exchange Google code for token")
            return access_token

    async def get_user(self, access_token: str) -> dict:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                self.USER_URL,
                headers={"Authorization": f"Bearer {access_token}"},
            )
            if response.status_code != 200:
                raise OAuthError("Failed to fetch Google user")
            data = response.json()
            return {
                "id": data["id"],
                "username": data.get("name"),
                "email": data.get("email"),
                "avatar_url": data.get("picture"),
            }
