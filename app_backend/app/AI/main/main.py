from fastapi import FastAPI, File, UploadFile
from pydantic import BaseModel, FilePath
from pathlib import Path
from tempfile import NamedTemporaryFile
import shutil
from app_backend.app.schemas.cv_file import CVdocumentLoader


class CVParser:
    def __init__(self, path):
        self.path = path
    async def upload_file(file: UploadFile = File(...)):
        with NamedTemporaryFile(delete=False) as temp_file:
            print(f"File is \n {file} \n  the end..")
            shutil.copyfileobj(file, temp_file)
            temp_file_path = Path(temp_file)
        try:
            loader = CVdocumentLoader(file_path=temp_file_path)
            return {"message": f"File uploaded successfully. File Path: {loader.file_path}"}
        except Exception as e:
            return {"error": str(e)}