from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.app.api.routes import router
from backend.app.core.config import settings
from backend.app.db.init_db import init_db


app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://paws-connect-pcpu.vercel.app",
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()

app.include_router(router, prefix="/api")
app.mount("/uploads", StaticFiles(directory=str(settings.upload_path)), name="uploads")
app.mount("/", StaticFiles(directory=str(settings.project_root / "frontend"), html=True), name="frontend")


