from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    """ go to /docs to see all the endpoint """
    return {
        "root":"Entry point"
    }