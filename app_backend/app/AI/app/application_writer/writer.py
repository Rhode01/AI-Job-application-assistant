from typing import Optional
from llama_index.core import Document


class ApplicationWriter:
    def __init__(self,content:str,cvContent:Optional[Document]):
        self.content = content,
        self.cvContent = cvContent
        
        