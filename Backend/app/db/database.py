from sqlmodel import SQLModel
from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import create_async_engine, AsyncEngine
from sqlalchemy.ext.asyncio import async_sessionmaker, AsyncSession
from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os
from typing import AsyncGenerator



load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
#MONGO_URI="mongodb+srv://lingangun:intensivos2@cluster0.r7tdovm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
mongo_client = AsyncIOMotorClient(MONGO_URI)
mongo_db = mongo_client.get_database("TrackAcademic")

class Settings(BaseSettings):
    # Usa una única variable de entorno DATABASE_URL
    database_url: str

    model_config = SettingsConfigDict(
        env_file=".env",
        env_prefix="",
        extra="allow"
    )

    @property
    def db_url(self) -> str:
        # Retorna la cadena de conexión limpia (sin sslmode)
        url = self.database_url
        # Quita el query param ?sslmode= si existe
        return url.split("?", 1)[0]

@lru_cache()
def get_settings() -> Settings:
    return Settings()

# Motor síncrono para init_db (elimina los parámetros asyncpg)
sync_engine = create_engine(
    get_settings().db_url.replace("+asyncpg", ""),
    echo=True
)

# Motor asíncrono (AsyncEngine) para la app, con SSL habilitado
async_engine: AsyncEngine = create_async_engine(
    get_settings().db_url,
    echo=True,
    connect_args={"ssl": True}
)

# Fábrica de sesiones asíncronas
async_session = async_sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False
)

##Necesario para inyectar las dependencias dentro de los endpoints
async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        yield session

def init_db():
    import app.models  # importa todos tus modelos SQLModel
    SQLModel.metadata.create_all(sync_engine)