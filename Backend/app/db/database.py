from sqlmodel import SQLModel
from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import create_async_engine, AsyncEngine, async_sessionmaker, AsyncSession
from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
import os
load_dotenv()

MONGO_URI="mongodb+srv://lingangun:intensivos2@cluster0.r7tdovm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
mongo_client = AsyncIOMotorClient(MONGO_URI)
mongo_db = mongo_client.get_database("TrackAcademic")

class Settings(BaseSettings):
    # Usa una única variable de entorno DATABASE_URL
    database_url: str

    model_config = SettingsConfigDict(
        env_file=".env",  # Ruta del archivo .env
        env_prefix="",    # Para que lea directamente 'database_url'
        extra="allow"     # Permite otros campos sin lanzar errores
    )

    @property
    def db_url(self) -> str:
        # Retorna la cadena de conexión limpia (sin parámetros extras)
        return self.database_url.split("?", 1)[0]


@lru_cache()
def get_settings() -> Settings:
    return Settings()


# Motor síncrono (solo para inicialización del schema si usas SQLModel.create_all)
sync_engine = create_engine(
    get_settings().db_url.replace("+asyncpg", ""),  # Quita asyncpg para compatibilidad síncrona
    echo=True
)

# Motor asíncrono para la app (principal)
async_engine: AsyncEngine = create_async_engine(
    get_settings().db_url,
    echo=True,
    connect_args={}  # Puedes agregar {"ssl": True} si estás usando conexión remota con SSL
)

# Fábrica de sesiones asíncronas
async_session = async_sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# Utilidad para inicializar la BD (usado en scripts, no en producción directa)
def init_db():
    import app.models  # Asegúrate de que esto importe todos los modelos
    SQLModel.metadata.create_all(sync_engine)
