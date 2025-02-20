from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app_backend.app.db.base import get_db  
from app_backend.app.crud.user import CRUDUser  
from app_backend.app.models.user import User
from app_backend.app.schemas.user import UserDetails
from app_backend.app.schemas.cv_file import CVdocumentLoader
from typing import List
from app_backend.app.AI.main.main import CVParser

router = APIRouter()

def get_crud_user():
    return CRUDUser()

@router.post("/users/", response_model=UserDetails)
async def create_user( user_details: UserDetails, db: AsyncSession = Depends(get_db),
    crud_user: CRUDUser = Depends(get_crud_user)):
    return await crud_user.create(db=db, obj_in=user_details)

@router.post("/upload_cv" )
async def upload_cv(path:CVdocumentLoader):
    print(f" the file path is  {path.file}")
    return await CVParser.upload_file(path) 



