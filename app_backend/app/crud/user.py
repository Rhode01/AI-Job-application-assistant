from app_backend.app.db.base import Base
from app_backend.app.models.user import User
from app_backend.app.crud.base import CRUDBase
from app_backend.app.schemas.user import UserDetails
from sqlalchemy.ext.asyncio import AsyncSession

class CRUDUser(CRUDBase):
   def __init__(self):
      super().__init__(User)
   def create(self, db:AsyncSession, obj_in):
      return super().create(db, obj_in)
   
   def delete(self, db, id):
      return super().delete(db, id)