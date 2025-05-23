# file: app/db/database.py

from sqlmodel import SQLModel, create_engine
from functools import lru_cache
#  ↓ CAMBIADO ↓
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    POSTGRES_HOST: str
    POSTGRES_PORT: int
    POSTGRES_DB: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str

    # indica dónde buscar el .env
    model_config = SettingsConfigDict(env_file=".env")

    @property
    def db_url(self) -> str:
        return (
            f"postgresql+asyncpg://"
            f"{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/"
            f"{self.POSTGRES_DB}"
        )

@lru_cache()
def get_settings() -> Settings:
    return Settings()

# Motor síncrono (solo para init_db)
engine = create_engine(
    get_settings().db_url.replace("+asyncpg", ""),
    echo=True
)

# Motor asíncrono para usar en la app
async_engine = create_engine(
    get_settings().db_url,
    echo=True,
    connect_args={"timeout": 10}
)

def init_db():
    import app.models  # importa tus modelos SQLModel
    SQLModel.metadata.create_all(engine)
