# from app_backend.app.db.base import Base
# from app_backend.app.models.user import User
# from app_backend.app.crud.base import CRUDBase
# from app_backend.app.schemas.user import UserDetails
# from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app_backend.app.crud.base import CRUDBase
from app_backend.app.models.user import User
from app_backend.app.schemas.user import UserDetails
from fastapi.exceptions import HTTPException
from typing import Optional
class CRUDUser(CRUDBase):
   def __init__(self):
      super().__init__(User)
   async def get(self, db: AsyncSession, user_id: str) -> Optional[User]:
        result = await db.execute(select(User).where(User.id == user_id))
        return result.scalars().first()

   def create(self, db:AsyncSession, obj_in):
      return super().create(db, obj_in)
   
   def delete(self, db, id):
      return super().delete(db, id)



    