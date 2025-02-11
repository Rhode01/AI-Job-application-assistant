from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app_backend.app.db.base import get_db  
from app_backend.app.crud.user import CRUDUser  
from app_backend.app.models.user import User  
from typing import List
router = APIRouter()


crud_user = CRUDUser()

@router.post("/users/", response_model=User)
async def create_user(user: User, db: AsyncSession = Depends(get_db)):
    return await crud_user.create(db=db, obj_in=user)

@router.get("/users/{user_id}", response_model=User)
async def get_user(user_id: str, db: AsyncSession = Depends(get_db)):
    user = await crud_user.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/users/", response_model=List[User])
async def get_users(db: AsyncSession = Depends(get_db)):
    users = await crud_user.get_all(db=db)
    return users


@router.put("/users/{user_id}", response_model=User)
async def update_user(user_id: str, user: User, db: AsyncSession = Depends(get_db)):
    updated_user = await crud_user.update(db=db, id=user_id, obj_in=user)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    return updated_user


@router.delete("/users/{user_id}", response_model=User)
async def delete_user(user_id: str, db: AsyncSession = Depends(get_db)):
    deleted_user = await crud_user.delete(db=db, id=user_id)
    if not deleted_user:
        raise HTTPException(status_code=404, detail="User not found")
    return deleted_user

