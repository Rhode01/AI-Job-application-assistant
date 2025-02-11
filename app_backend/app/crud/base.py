from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import Session
from typing import Type, TypeVar, List, Optional
from app_backend.app.db.base import Base

model = TypeVar("model", bound=Base)

class CRUDBase:
    def __init__(self, model:Type[model]):
        self.model = model
    async def create(self, db:AsyncSession, obj_in:model):
        db_obj = self.model(**obj_in.dict())
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj
    async def get_all (self, db:AsyncSession)-> List[model]:
        result = await db.execute(select(self.model))
        return result.scalars().all()
    async def get(self, db:AsyncSession, id:int) -> Optional[model]:
        result = await db.execute(select(self.model).filter(self.model.id==id))
        return result.scalars().first()
    async def update(self, db: AsyncSession, id: int, obj_in: model) -> Optional[model]:
        db_obj = await self.get(db, id)
        if db_obj:
            for field, value in obj_in.dict(exclude_unset=True).items():
                setattr(db_obj, field, value)
            await db.commit()
            await db.refresh(db_obj)
            return db_obj
        return None

    async def delete(self, db: AsyncSession, id: int) -> Optional[model]:
        db_obj = await self.get(db, id)
        if db_obj:
            await db.delete(db_obj)
            await db.commit()
            return db_obj
        return None