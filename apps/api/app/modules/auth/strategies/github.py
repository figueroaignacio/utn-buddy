import httpx
from app.config import settings
from app.modules.auth.exceptions import OAuthError


class GitHubStrategy:
    AUTHORIZE_URL = "https://github.com/login/oauth/authorize"
    TOKEN_URL = "https://github.com/login/oauth/access_token"
    USER_URL = "https://api.github.com/user"
    USER_EMAILS_URL = "https://api.github.com/user/emails"

    def get_authorize_url(self, state: str) -> str:
        params = {
            "client_id": settings.github_client_id,
            "redirect_uri": f"{settings.api_url}/api/auth/github/callback",
            "scope": "read:user user:email",
            "state": state,
        }
        query = "&".join(f"{k}={v}" for k, v in params.items())
        return f"{self.AUTHORIZE_URL}?{query}"

    async def exchange_code(self, code: str) -> str:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                self.TOKEN_URL,
                headers={"Accept": "application/json"},
                data={
                    "client_id": settings.github_client_id,
                    "client_secret": settings.github_client_secret,
                    "code": code,
                },
            )
            data = response.json()
            access_token = data.get("access_token")
            if not access_token:
                raise OAuthError("Failed to exchange GitHub code for token")
            return access_token

    async def get_user(self, access_token: str) -> dict:
        async with httpx.AsyncClient() as client:
            headers = {"Authorization": f"Bearer {access_token}"}

            user_response = await client.get(self.USER_URL, headers=headers)
            if user_response.status_code != 200:
                raise OAuthError("Failed to fetch GitHub user")
            user_data = user_response.json()

            if not user_data.get("email"):
                emails_response = await client.get(
                    self.USER_EMAILS_URL, headers=headers
                )
                if emails_response.status_code == 200:
                    emails = emails_response.json()
                    primary = next(
                        (
                            e["email"]
                            for e in emails
                            if e.get("primary") and e.get("verified")
                        ),
                        None,
                    )
                    user_data["email"] = primary

            return {
                "id": str(user_data["id"]),
                "username": user_data.get("login"),
                "email": user_data.get("email"),
                "avatar_url": user_data.get("avatar_url"),
            }
