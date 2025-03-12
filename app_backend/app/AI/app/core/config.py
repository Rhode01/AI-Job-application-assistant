from langchain_openai import ChatOpenAI
from openai import OpenAI
class AImodel:
    def __init__(self):
        self.model = None
        self.init_model() 

    def init_model(self):
        self.model = ChatOpenAI(model="o3-mini")

ai_model = AImodel()
