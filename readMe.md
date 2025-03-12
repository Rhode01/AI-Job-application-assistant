# Job Application Assistant

[![Python 3.10+](https://img.shields.io/badge/Python-3.10%2B-blue)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-green)](https://fastapi.tiangolo.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

AI-powered job application assistant optimized for the Malawian job market. Automatically matches CVs to relevant job opportunities on myjobo.mw and generates tailored application letters.

## Features
✅ **CV Analysis**  
- Parses and analyzes CV content  
- Identifies key skills and qualifications  
- Recommends job opportunities aligned with myjobo.mw listings  

✅ **Smart Job Matching**  
- Searches for relevant roles on myjobo.mw  
- Matches job requirements with candidate profile  
- Provides market trend insights  

✅ **AI-Powered Application Letters**  
- Generates customized cover letters in 3 steps:  
  1. Initial draft generation  
  2. Expert critique with scoring  
  3. Final polished version  
- Maintains professional tone and local business norms  

## Getting Started

### Prerequisites
1. Python 3.10+
2. OpenAI API key (GPT-4 access required)

### Installation
```bash
git clone https://github.com/your-repo/job-application-assistant.git
cd job-application-assistant
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```
### Configuration
create .env file:
    OPENAI_API_KEY=your_openai_key
### Usage and API Endpoints
/upload_cv      Method          Description
                POST            Analyze CV content

/job_search     POST            Search myjobo.mw job listings


/letter_writer  POST            Generate application letter package


### Technologies
- Core Framework : FastAPI
- NLP Engine : LangChain + GPT-4
- Document Processing : LlamaIndex
- Job Search : myjobo.mw API integration
- Deployment : Docker, Uvicorn
### Limitations
⚠️ Requires OpenAI API credits (GPT-4 usage)
⚠️ CV parsing optimized for standard formats (PDF/DOCX)