from pydantic_settings import BaseSettings
from pydantic import field_validator
from authlib.integrations.starlette_client import OAuth
from typing import Any
from fastapi import Depends
from jose import jwt
from fastapi.security import OAuth2AuthorizationCodeBearer
from app_backend.app.models.user import User
from app_backend.app.crud.user import CRUDUser
from fastapi.exceptions import HTTPException
oauth = OAuth()
class Settings(BaseSettings):
    AUTH0_CLIENT_ID: str
    AUTH0_CLIENT_SECRET: str
    AUTH0_DOMAIN: str
    
    @field_validator("", mode="before")
    def assemble_oauth_connection(cls, v: str | None, values: dict[str, Any]) -> Any:
        if isinstance(v, str):
            return v
        return oauth.register(
            client_id=values.data.get("AUTH0_CLIENT_ID"),
            client_secret=values.data.get("AUTH0_CLIENT_SECRET"),
            client_kwargs={"scope": "openid profile email"},

        )
auth0_settings = Settings()
async def get_current_user(token: str = Depends(OAuth2AuthorizationCodeBearer(...) )) -> User:
    try:
        payload = jwt.decode(token, auth0_settings.AUTH0_CLIENT_SECRET, algorithms=["RS256"])
        user = await CRUDUser().get(id=payload['sub'])
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")