from fastapi import APIRouter, Depends, HTTPException, File, UploadFile,Form
from sqlalchemy.ext.asyncio import AsyncSession
from app_backend.app.db.base import get_db  
from app_backend.app.crud.user import CRUDUser  
from app_backend.app.models.user import User
from app_backend.app.schemas.user import UserDetails
from app_backend.app.schemas.cv_summary import CVSummary,CVSummaryBase,CVSummaryCreate
from app_backend.app.AI.app.core.config import ai_model
from app_backend.app.AI.app.cv_analysis.cv_parser import CVParser
from app_backend.app.AI.app.application_writer.writer import ApplicationWriter
import tempfile
from app_backend.app.AI.app.job_parser.job_parser import JobParse
from app_backend.app.services.auth0 import get_current_user
from fastapi.requests import Request
from authlib.integrations.starlette_client import OAuth
oauth = OAuth()
router = APIRouter()

def get_crud_user():
    return CRUDUser()

@router.post("/users/", response_model=UserDetails)
async def create_user( user_details: UserDetails, db: AsyncSession = Depends(get_db),
    crud_user: CRUDUser = Depends(get_crud_user)):
    return await crud_user.create(db=db, obj_in=user_details)
@router.get("/users/me", response_model=UserDetails)
async def get_profile(current_user: UserDetails = Depends(get_current_user)):
    return current_user
@router.get('/protected')
async def protected_route(
    current_user: UserDetails = Depends(get_current_user)
):
    return {'message': f'Hello {current_user.email}'}
# @router.post("/upload_cv" )
# async def upload_cv(file:UploadFile = File(...)):
#     print(f"file being received is  {file}")
#     with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
#         temp_path = temp_file.name
#         temp_file.write(await file.read())
#     cv_parser = CVParser(temp_path, ai_model.model)
#     await cv_parser.initialize()
#     llm_response = await cv_parser.get_processed_data()
#     return llm_response
@router.post("/upload_cv")
async def upload_cv(
    file: UploadFile = File(...),
    current_user: UserDetails = Depends(get_current_user)
):
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
            temp_path = temp_file.name
            temp_file.write(await file.read())
        
        cv_parser = CVParser(temp_path, ai_model.model)
        processed_data = await cv_parser.initialize()
        
        # Link CV to user (example implementation)
        # await crud_user.update_cv_data(db, current_user.id, processed_data)
        
        return processed_data
    except FileNotFoundError:
        raise HTTPException(400, "File upload failed")
    except Exception as e:
        raise HTTPException(500, f"Processing error: {str(e)}")

@router.post("/job_search")
async def job_parser(job_title:str):
    jobParser_obj = JobParse(job_title)
    jobparser_results = await jobParser_obj.search_for_jobs()
    
    return jobparser_results
@router.post("/letter_writer")
async def application_letter(job_description :str = Form(...,min_length=100), path_to_cv:UploadFile= File(...)):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp:
        temp_cv_path = temp.name
        temp.write(await path_to_cv.read())
    writer= ApplicationWriter(job_description,temp_cv_path,ai_model.model)
    write_response =await writer.get_final_application()
    return write_response["final_letter"]
@router.post("/cv_summaries", response_model=CVSummary)
async def create_cv_summary(summary_data: CVSummaryCreate,  db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    cv_summary = CVSummary(
        user_id=current_user.id,
        summary=summary_data.summary
    )
    db.add(cv_summary)
    await db.commit()
    return cv_summary


@router.get("/")
async def index():
    return {"info":"Home page"}

@router.post("/callback")
async def auth_callback(request: Request, db: AsyncSession = Depends(get_db)):
    token = await oauth.auth0.authorize_access_token(request)
    userinfo = token.get('userinfo')
    if not userinfo:
        raise HTTPException(401, "Authentication failed")
    user = await CRUDUser().get(db, userinfo['sub'])
    if not user:
        user_data = UserDetails(
            id=userinfo['sub'],
            email=userinfo['email'],
            first_name=userinfo.get('given_name'),
            last_name=userinfo.get('family_name'),
            auth0_metadata=userinfo
        )
        user = await CRUDUser().create(db, user_data)
        
    return {"user": user}