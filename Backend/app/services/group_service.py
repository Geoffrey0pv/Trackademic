from typing import List, Optional
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from fastapi import HTTPException, status

from app.models.models import Group, Subject, Employee
from app.models.models import GroupRead, GroupCreate, GroupUpdate
from .base_service import BaseService

class GroupService(BaseService[Group, GroupCreate, GroupUpdate]):
    """Servicio para gestión de grupos"""
    
    def __init__(self, session: AsyncSession):
        super().__init__(Group, session)
    
    async def get_group_by_composite_key(
        self, 
        subject_code: str, 
        semester: str, 
        group_number: int
    ) -> Optional[Group]:
        """Obtener grupo por clave compuesta"""
        result = await self.session.exec(
            select(Group).where(
                Group.subject_code == subject_code,
                Group.semester == semester,
                Group.number == group_number
            )
        )
        return result.first()
    
    async def get_group_by_composite_key_or_fail(
        self, 
        subject_code: str, 
        semester: str, 
        group_number: int
    ) -> Group:
        """Obtener grupo por clave compuesta o lanzar excepción"""
        group = await self.get_group_by_composite_key(
            subject_code, semester, group_number
        )
        if not group:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Group {group_number} for subject '{subject_code}' "
                       f"in semester '{semester}' not found"
            )
        return group
    
    async def get_groups_by_subject(self, subject_code: str) -> List[Group]:
        """Obtener todos los grupos de una materia"""
        result = await self.session.exec(
            select(Group).where(Group.subject_code == subject_code)
        )
        return result.all()
    
    async def get_groups_by_semester(self, semester: str) -> List[Group]:
        """Obtener todos los grupos de un semestre"""
        result = await self.session.exec(
            select(Group).where(Group.semester == semester)
        )
        return result.all()
    
    async def get_groups_by_professor(self, professor_id: str) -> List[Group]:
        """Obtener grupos dictados por un profesor"""
        result = await self.session.exec(
            select(Group).where(Group.professor_id == professor_id)
        )
        return result.all()
    
    async def get_professor_workload(self, professor_id: str, semester: str) -> int:
        """Obtener carga académica de un profesor en un semestre"""
        result = await self.session.exec(
            select(Group).where(
                Group.professor_id == professor_id,
                Group.semester == semester
            )
        )
        return len(result.all())