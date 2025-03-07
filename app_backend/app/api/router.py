from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from app_backend.app.db.base import get_db  
from app_backend.app.crud.user import CRUDUser  
from app_backend.app.models.user import User
from app_backend.app.schemas.user import UserDetails
from app_backend.app.AI.app.core.config import ai_model
from app_backend.app.AI.app.cv_analysis.cv_parser import CVParser
import tempfile

router = APIRouter()

def get_crud_user():
    return CRUDUser()

@router.post("/users/", response_model=UserDetails)
async def create_user( user_details: UserDetails, db: AsyncSession = Depends(get_db),
    crud_user: CRUDUser = Depends(get_crud_user)):
    return await crud_user.create(db=db, obj_in=user_details)

@router.post("/upload_cv" )
async def upload_cv(file:UploadFile = File(...)):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
        temp_path = temp_file.name
        temp_file.write(await file.read())
    cv_parser = CVParser(temp_path, ai_model.model)
    await cv_parser.initialize()
    llm_response = cv_parser.get_processed_data()
    return llm_response
@router.get("/")
async def index():
    return {"info":"Home page"}


