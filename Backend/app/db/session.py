from typing import AsyncGenerator
from sqlmodel.ext.asyncio.session import AsyncSession

from .database import async_engine

async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSession(async_engine) as session:
        yield session
