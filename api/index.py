from fastapi import FastAPI
import os
from pydantic import BaseModel
from typing import List, Tuple
from supabase import create_client, Client
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.memory import ConversationBufferMemory
from langchain.vectorstores import SupabaseVectorStore
from langchain.chains import ConversationalRetrievalChain
from langchain.llms import OpenAI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

app = FastAPI()

load_dotenv()

origins = [
    # "http://localhost",
    # "http://localhost:3000",
    # "http://localhost:8080",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_SERVICE_KEY")
openai_api_key = os.environ.get("OPENAI_API_KEY")

supabase: Client = create_client(supabase_url, supabase_key)

embeddings = OpenAIEmbeddings(openai_api_key=openai_api_key)
vector_store = SupabaseVectorStore(
    supabase, embeddings, table_name="documents")
memory = ConversationBufferMemory(
    memory_key="chat_history", return_messages=True)


class ChatMessage(BaseModel):
    model: str = "gpt-3.5-turbo"
    question: str
    history: List[Tuple[str, str]]  # A list of tuples where each tuple is (speaker, text)
    temperature: float = 0.0
    max_tokens: int = 1024

@app.post("/chat/")
async def chat_endpoint(chat_message: ChatMessage):
    history = chat_message.history
    qa = ConversationalRetrievalChain.from_llm(
        OpenAI(
            model_name=chat_message.model, openai_api_key=openai_api_key, temperature=chat_message.temperature, max_tokens=chat_message.max_tokens), vector_store.as_retriever(), memory=memory, verbose=True)
    history.append(("user", chat_message.question))
    model_response = qa({"question": chat_message.question})
    history.append(("assistant", model_response["answer"]))

    return {"history": history}

@app.get("/")
async def root():
    return {"message": "Hello World"}
