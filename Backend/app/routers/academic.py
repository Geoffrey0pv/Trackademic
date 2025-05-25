from typing import List
from fastapi import APIRouter, Depends, Query
from sqlmodel.ext.asyncio.session import AsyncSession

from app.db.session import get_session
from app.services.subject_service import SubjectService
from app.models.models import SubjectRead, SubjectCreate, SubjectUpdate