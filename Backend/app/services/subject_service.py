from typing import List, Optional
from sqlmodel import select
from sqlmodel import AsyncSession
from fastapi import HTTPException, status

from app.models.models import Subject, Group, Employee
from app.models.models import SubjectRead, SubjectCreate, SubjectUpdate
from .base_service import BaseService


class SubjectService(BaseService[Subject, SubjectCreate, SubjectUpdate]):
    """Servicio para gestión de materias"""
    
    def __init__(self, session: AsyncSession):
        super().__init__(Subject, session)
    
    async def get_by_code(self, subject_code: str) -> Optional[Subject]:
        """Obtener materia por código"""
        result = await self.session.exec(
            select(Subject).where(Subject.code == subject_code)
        )
        return result.first()
    
    async def get_by_code_or_fail(self, subject_code: str) -> Subject:
        """Obtener materia por código o lanzar excepción"""
        subject = await self.get_by_code(subject_code)
        if not subject:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Subject with code '{subject_code}' not found"
            )
        return subject
    
    async def get_subjects_by_program(self, program_code: int) -> List[Subject]:
        """Obtener materias por programa"""
        result = await self.session.exec(
            select(Subject).where(Subject.program_code == program_code)
        )
        return result.all()
    
    async def get_semesters_for_subject(self, subject_code: str) -> List[str]:
        """Obtener semestres disponibles para una materia"""
        await self.get_by_code_or_fail(subject_code)  # Validar que existe
        
        result = await self.session.exec(
            select(Group.semester)
            .where(Group.subject_code == subject_code)
            .distinct()
        )
        return result.all()
    
    async def search_subjects(self, query: str) -> List[Subject]:
        """Buscar materias por nombre o código"""
        result = await self.session.exec(
            select(Subject).where(
                (Subject.name.contains(query)) | 
                (Subject.code.contains(query))
            )
        )
        return result.all()