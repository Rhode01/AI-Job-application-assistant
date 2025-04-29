from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2AuthorizationCodeBearer
from jose import jwt
from jose.exceptions import JWTError
from authlib.jose import JsonWebKey
from sqlalchemy.ext.asyncio import AsyncSession
from app_backend.app.core.config import settings
from app_backend.app.crud.user import CRUDUser
from app_backend.app.schemas.user import UserDetails
from app_backend.app.db.base import get_db
import requests
from fastapi import APIRouter
from authlib.integrations.starlette_client import OAuth
from app_backend.app.core.config import settings
oauth = OAuth()
oauth.register(
    'auth0',
    client_id=settings.AUTH0_CLIENT_ID,
    client_secret=settings.AUTH0_CLIENT_SECRET,
    client_kwargs={
        'scope': 'openid profile email',
        'audience': settings.AUTH0_API_AUDIENCE
    },
    server_metadata_url=f'https://{settings.AUTH0_DOMAIN}/.well-known/openid-configuration'
)

router = APIRouter()
oauth2_scheme = OAuth2AuthorizationCodeBearer(
    authorizationUrl=f"https://{settings.AUTH0_DOMAIN}/authorize",
    tokenUrl=f"https://{settings.AUTH0_DOMAIN}/oauth/token"
)

async def get_current_user(token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)) -> UserDetails:
    try:
        jwks_uri = f"https://{settings.AUTH0_DOMAIN}/.well-known/jwks.json"
        jwks = JsonWebKey.import_key_set(requests.get(jwks_uri).json())
        
        payload = jwt.decode(
            token,
            jwks,
            algorithms=['RS256'],
            audience=settings.AUTH0_API_AUDIENCE,
            issuer=f"https://{settings.AUTH0_DOMAIN}/",
            options={"verify_exp": True} 
        )
        if not payload.get('sub'):
            raise HTTPException(401, "Missing user identifier")
        user_id = payload.get('sub')
        if not user_id:
            raise HTTPException(401, "Invalid token payload")
        crud_user = CRUDUser()
        user = await crud_user.get(db, user_id)
        if not user:
            user_data = UserDetails(
                id=user_id,
                email=payload.get('email'),
                first_name=payload.get('given_name'),
                last_name=payload.get('family_name'),
                auth0_metadata=payload
            )
            user = await crud_user.create(db, user_data) 
        return user

    except requests.exceptions.RequestException:
        raise HTTPException(503, "Authentication service unavailable")
    except JWTError as e:
        raise HTTPException(401, f"Invalid token: {str(e)}")
    except jwt.ExpiredSignatureError:
        raise HTTPException(401, "Token expired")
    except jwt.JWTClaimsError:
        raise HTTPException(401, "Invalid token claims")
@router.post('/callback')
async def auth_callback(code: str,db: AsyncSession = Depends(get_db)):
    try:
        token = await oauth.auth0.authorize_access_token(code=code)
        userinfo = token.get('userinfo')
        if not userinfo:
            raise HTTPException(400, 'Invalid authentication response')
        user = await CRUDUser().get(db, userinfo['sub'])
        if not user:
            user = await CRUDUser().create(db, UserDetails(
                id=userinfo['sub'],
                email=userinfo['email'],
                first_name=userinfo.get('given_name'),
                last_name=userinfo.get('family_name'),
                auth0_metadata=userinfo
            ))
        
        return {"user": user}
        
    except Exception as e:
        raise HTTPException(400, f'Authentication failed: {str(e)}')