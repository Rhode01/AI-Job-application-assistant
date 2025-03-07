import os
import json
from llama_index.core import SimpleDirectoryReader, Document
from langchain.prompts import ChatPromptTemplate
from langchain.chains import LLMChain
from app_backend.app.AI.app.templates.templates import cv_template
from typing import Dict

class CVParser:
    def __init__(self, file_path: str, openai_llm):
        self.file_path = file_path
        self.llm = openai_llm
        self.document = None
        self.llm_response = None
    async def load_document(self) -> Document:
        if not os.path.exists(self.file_path):
            raise FileNotFoundError(f"File not found: {self.file_path}")

        documents = SimpleDirectoryReader(input_files=[self.file_path]).load_data()
        if not documents:
            raise ValueError(f"Failed to load document: {self.file_path}")
        self.document = documents[0]
        return self.document

    async def process_cv(self) -> Dict:
        if self.document is None:
            await self.load_document()
        prompt = ChatPromptTemplate.from_template(cv_template)
        chain = prompt|self.llm  
        try:
            response = await chain.ainvoke(
                {"input": self.document.text_resource.text}
            )
            self.llm_response = json.loads(response.content)
            return self.llm_response
        except Exception as e:
            raise RuntimeError(f"LLM processing failed: {str(e)}")
        
    async def initialize(self):
        return await self.process_cv() 
       
    async def get_processed_data(self) -> Dict:
        if not self.llm_response:
            raise ValueError("No processed data available. Run initialize() first.")
        return self.llm_response

    def __str__(self):
        return (
            f"CVParser(file_path={self.file_path}, "
            f"document_loaded={self.document is not None})"
        )