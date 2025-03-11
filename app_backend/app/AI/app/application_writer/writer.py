from typing import Optional
from app_backend.app.AI.app.cv_analysis.cv_parser import CVParser
from app_backend.app.AI.app.templates.templates import (
    initial_letter_template,
    critique_template,
    final_letter_template
)
from langchain.prompts import ChatPromptTemplate
from fastapi.responses import JSONResponse
import json
import logging

logger = logging.getLogger(__name__)

class ApplicationWriter:
    def __init__(self, job_description: str, cv_path: Optional[str], llm):
        self.job_description = job_description 
        self.cv_path = cv_path
        self.llm = llm
        self.cv_content = None
        self.initial_letter = None
        self.critique = None
        self.final_letter = None

    async def load_cv_content(self) -> None:
        """Load and process CV content"""
        if not self.cv_path:
            raise ValueError("CV path is required")
        
        parser = CVParser(self.cv_path, self.llm)
        try:
            processed_data = await parser.initialize()
            self.cv_content = processed_data  # Store parsed CV data
        except Exception as e:
            logger.error(f"CV processing failed: {str(e)}")
            raise

    async def generate_initial_letter(self) -> str:
        """Generate the first draft application letter"""
        if not self.cv_content:
            await self.load_cv_content()
        
        prompt = ChatPromptTemplate.from_template(initial_letter_template)
        chain = prompt | self.llm
        
        try:
            response = await chain.ainvoke({
                "cv_content": json.dumps(self.cv_content),
                "job_description": self.job_description
            })
            self.initial_letter = response.content
            return self.initial_letter
        except Exception as e:
            logger.error(f"Initial letter generation failed: {str(e)}")
            raise

    async def get_critique(self) -> dict:
        """Get expert critique of the generated letter"""
        if not self.initial_letter:
            raise RuntimeError("Generate initial letter first")
        
        prompt = ChatPromptTemplate.from_template(critique_template)
        chain = prompt | self.llm
        
        try:
            response = await chain.ainvoke({
                "generated_letter": self.initial_letter,
                "job_description": self.job_description
            })
            self.critique = json.loads(response.content)
            return self.critique
        except Exception as e:
            logger.error(f"Critique generation failed: {str(e)}")
            raise

    async def refine_letter(self) -> str:
        """Generate final polished letter using critique"""
        if not self.critique:
            await self.get_critique()
        
        prompt = ChatPromptTemplate.from_template(final_letter_template)
        chain = prompt | self.llm
        
        try:
            response = await chain.ainvoke({
                "initial_letter": self.initial_letter,
                "critique_feedback": json.dumps(self.critique),
                "job_description": self.job_description
            })
            self.final_letter = response.content
            return self.final_letter
        except Exception as e:
            logger.error(f"Final letter refinement failed: {str(e)}")
            raise

    async def get_final_application(self) -> dict:
        """Full pipeline for end-to-end letter creation"""
        try:
            await self.generate_initial_letter()
            await self.get_critique()
            await self.refine_letter()
            
            return {
                "initial_letter": self.initial_letter,
                "critique": self.critique,
                "final_letter": self.final_letter
            }
        except Exception as e:
            logger.error(f"Full pipeline failed: {str(e)}")
            raise