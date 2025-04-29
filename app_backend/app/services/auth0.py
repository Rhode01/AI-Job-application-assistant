from authlib.integrations.starlette_client import OAuth
from fastapi import HTTPException, Depends
from fastapi.security import OAuth2AuthorizationCodeBearer
from jose import jwt
from pydantic_settings import BaseSettings
oauth = OAuth()

class Settings(BaseSettings):
    AUTHO_CLIENT_ID :None
    AUTHO_CLIENT_SECRET_ID: str= None
oauth.register(
    "auth0",
    client_id=settings.AUTH0_CLIENT_ID,
    client_secret=settings.AUTH0_CLIENT_SECRET,
    client_kwargs={"scope": "openid profile email"},
    server_metadata_url=f"https://{settings.AUTH0_DOMAIN}/.well-known/openid-configuration"
)

async def get_current_user(token: str = Depends(OAuth2AuthorizationCodeBearer(...) )) -> User:
    try:
        payload = jwt.decode(token, settings.AUTH0_CLIENT_SECRET, algorithms=["RS256"])
        user = await CRUDUser().get(id=payload['sub'])
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")