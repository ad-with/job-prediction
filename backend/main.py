from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings
from api import auth, predict, genai

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="FastAPI Backend for Edu2Job AI Career Intelligence System",
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Configure CORS to allow frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix=settings.API_V1_STR + "/auth", tags=["auth"])
app.include_router(predict.router, prefix=settings.API_V1_STR + "/predict", tags=["predict"])
app.include_router(genai.router, prefix=settings.API_V1_STR + "/genai", tags=["genai"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Edu2Job API", "status": "online"}
