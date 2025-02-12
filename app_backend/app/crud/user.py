from app_backend.app.db.base import Base
from app_backend.app.models.user import User
from app_backend.app.crud.base import CRUDBase

class CRUDUser([CRUDBase]):
     def __init__(self):
        super().__init__(User)
