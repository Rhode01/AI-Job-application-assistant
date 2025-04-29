from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator
from authlib.integrations.starlette_client import OAuth
from typing import Any
from fastapi import Depends
from jose import jwt
from fastapi.security import OAuth2AuthorizationCodeBearer
from app_backend.app.models.user import User
from app_backend.app.crud.user import CRUDUser
from fastapi.exceptions import HTTPException
import os
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ENV_PATH = os.path.join(BASE_DIR, "..", ".env")
oauth = OAuth()


oauth.register(
    'auth0',
    client_id=auth0_settings.AUTH0_CLIENT_ID,
    client_secret=auth0_settings.AUTH0_CLIENT_SECRET,
    client_kwargs={
        'scope': 'openid profile email',
        'audience': auth0_settings.AUTH0_API_AUDIENCE
    },
    server_metadata_url=f'https://{auth0_settings.AUTH0_DOMAIN}/.well-known/openid-configuration'
)
from jose import jwt
from jose.exceptions import JWTError
from authlib.jose import JsonWebKey

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        # Fetch Auth0's public keys
        jwks = JsonWebKey.import_key_set(
            requests.get(f"https://{auth0_settings.AUTH0_DOMAIN}/.well-known/jwks.json").json()
        )
        
        # Verify token signature
        payload = jwt.decode(
            token,
            jwks,
            algorithms=['RS256'],
            audience=auth0_settings.AUTH0_API_AUDIENCE,
            issuer=f"https://{auth0_settings.AUTH0_DOMAIN}/"
        )
        
        user_id = payload.get('sub')
        if not user_id:
            raise HTTPException(401, "Invalid token")
            
        # Get or create user in database
        user = await CRUDUser().get(user_id)
        if not user:
            user = await CRUDUser().create(UserDetails(id=user_id, **payload))
            
        return user

    except JWTError as e:
        raise HTTPException(401, f"Invalid token: {str(e)}")