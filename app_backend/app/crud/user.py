from db.base import Base
from models.user import User
from crud.base import CRUDBase

class CRUDUser([CRUDBase]):
     def __init__(self):
        super().__init__(User)
