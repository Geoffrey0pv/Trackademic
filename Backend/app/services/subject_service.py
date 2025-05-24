# file: app/services/postgres_service.py

from fastapi import Depends, HTTPException, status
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import List, Optional

from app.db.session import get_session
from app.models.models import Subject, Group, Employee, SubjectRead 


"""
Esta clase proporciona servicios para consultar y validar información
en la base de datos PostgreSQL. Se utiliza para validar la existencia
de materias, grupos y semestres, así como para listar materias
y semestres disponibles.
Los métodos incluyen:
- `get_subject_or_fail`: Busca una materia por código y lanza una excepción si no existe.
- `get_group_or_fail`: Busca un grupo específico y lanza una excepción si no existe.
- `check_semester_exists_for_subject`: Verifica si existe al menos un grupo para una materia
    en un semestre dado.
- `list_subjects`: Devuelve una lista de materias disponibles.
- `list_semesters_for_subject`: Devuelve una lista única de semestres para una materia dada.
"""

class subject_service:
    def __init__(self, session: AsyncSession = Depends(get_session)):
        self.session = session

    async def get_subject_or_fail(self, subject_code: str) -> Subject:
        
        # Busca una materia por código. Si no existe, lanza HTTPException.
      
        result = await self.session.exec(
            select(Subject).where(Subject.code == subject_code)
        )
        subject = result.first()
        if not subject:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Subject with code '{subject_code}' not found."
            )
        return subject

    async def get_group_or_fail(
        self, subject_code: str, semester: str, group_number: int
    ) -> Group:
       
        # Busca un grupo específico. Si no existe, lanza HTTPException.
       
        result = await self.session.exec(
            select(Group).where(
                Group.subject_code == subject_code,
                Group.semester == semester,
                Group.number == group_number
            )
        )
        group = result.first()
        if not group:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Group {group_number} for subject '{subject_code}' "
                       f"in semester '{semester}' not found."
            )
        return group

    async def check_semester_exists_for_subject(
        self, subject_code: str, semester: str
    ) -> bool:

        result = await self.session.exec(
            select(Group).where(
                Group.subject_code == subject_code,
                Group.semester == semester
            ).limit(1) # Solo necesitamos saber si existe al menos uno
        )
        return result.first() is not None

    async def list_subjects(self, skip: int = 0, limit: int = 100) -> List[SubjectRead]:
     
        result = await self.session.exec(select(Subject).offset(skip).limit(limit))
        return result.all()

    async def list_semesters_for_subject(self, subject_code: str) -> List[str]:
     
        # Valida que la materia exista primero
        await self.get_subject_or_fail(subject_code) 
        
        result = await self.session.exec(
            select(Group.semester)
            .where(Group.subject_code == subject_code)
            .distinct()
        )
        return result.all()