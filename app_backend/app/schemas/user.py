from pydantic import BaseModel, Field
from typing import List, Optional

class UserDetails(BaseModel):
    first_name: str = Field(..., description="The first name of the person")
    last_name: str = Field(..., description="The surname of the person")
    email: Optional[str] = Field(None, description="The email of the person", example="user@example.com")
    is_active: bool = Field(True, description="Indicates whether the user is active")
    