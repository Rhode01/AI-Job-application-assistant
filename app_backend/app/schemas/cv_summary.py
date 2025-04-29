from pydantic import BaseModel
from typing import Dict, Optional
from datetime import datetime
from typing import Any
class CVSummaryBase(BaseModel):
    summary: Dict[str, Any] 
    user_id: str

class CVSummaryCreate(CVSummaryBase):
    pass

class CVSummary(CVSummaryBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        orm_mode = True