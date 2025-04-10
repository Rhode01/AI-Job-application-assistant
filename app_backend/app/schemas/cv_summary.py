from pydantic import BaseModel
from typing import Dict, Optional
from datetime import datetime

class CVSummaryBase(BaseModel):
    summary: Dict[str, any] 
    user_id: str

class CVSummaryCreate(CVSummaryBase):
    pass

class CVSummary(CVSummaryBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        orm_mode = True