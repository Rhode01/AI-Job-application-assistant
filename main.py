from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app_backend.app.db.base import get_db  
from app_backend.app.crud.user import CRUDUser  
from app_backend.app.models.user import User  

router = APIRouter()

# Instantiate the CRUDUser class
crud_user = CRUDUser()

# Create a new user
@router.post("/users/", response_model=User)
async def create_user(user: User, db: AsyncSession = Depends(get_db)):
    return await crud_user.create(db=db, obj_in=user)

# Get user by ID
@router.get("/users/{user_id}", response_model=User)
async def get_user(user_id: str, db: AsyncSession = Depends(get_db)):
    user = await crud_user.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# Get all users
@router.get("/users/", response_model=List[User])
async def get_users(db: AsyncSession = Depends(get_db)):
    users = await crud_user.get_all(db=db)
    return users

# Update an existing user
@router.put("/users/{user_id}", response_model=User)
async def update_user(user_id: str, user: User, db: AsyncSession = Depends(get_db)):
    updated_user = await crud_user.update(db=db, id=user_id, obj_in=user)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    return updated_user

# Delete a user by ID
@router.delete("/users/{user_id}", response_model=User)
async def delete_user(user_id: str, db: AsyncSession = Depends(get_db)):
    deleted_user = await crud_user.delete(db=db, id=user_id)
    if not deleted_user:
        raise HTTPException(status_code=404, detail="User not found")
    return deleted_user

# Custom endpoint to get a user by email
@router.get("/users/email/{email}", response_model=User)
async def get_user_by_email(email: str, db: AsyncSession = Depends(get_db)):
    user = await crud_user.get_by_email(db=db, email=email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# Custom endpoint to get all active users
@router.get("/users/active", response_model=List[User])
async def get_active_users(db: AsyncSession = Depends(get_db)):
    active_users = await crud_user.get_active_users(db=db)
    return active_users
