from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
def load_cv_file() -> dict:
    documents = SimpleDirectoryReader("data").load_data()
    index = VectorStoreIndex.from_documents(documents)
    query_engine = index.as_query_engine()
    return {"query_engine": query_engine}