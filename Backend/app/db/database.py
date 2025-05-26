# app/db/database.py

from sqlmodel import SQLModel
from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import create_async_engine, AsyncEngine
from sqlalchemy.ext.asyncio import async_sessionmaker, AsyncSession   # <-- aquí
from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

class Settings(BaseSettings):
    database_url: str

    model_config = SettingsConfigDict(env_file=".env", env_prefix="")

    @property
    def db_url(self) -> str:
        return self.database_url

@lru_cache()
def get_settings() -> Settings:
    return Settings()

# Motor síncrono para init_db
sync_engine = create_engine(
    get_settings().db_url.replace("+asyncpg", ""),
    echo=True
)

# Motor asíncrono (AsyncEngine) para la app
async_engine: AsyncEngine = create_async_engine(
    get_settings().db_url,
    echo=True
)

# Fábrica de sesiones asíncronas
async_session = async_sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False
)

def init_db():
    import app.models
    SQLModel.metadata.create_all(sync_engine)
