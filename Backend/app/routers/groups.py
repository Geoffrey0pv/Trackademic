from typing import Optional, List
from fastapi import APIRouter, Depends, Path, Query
from sqlmodel.ext.asyncio.session import AsyncSession

from app.db.session import get_session
from app.services.group_service import GroupService
from app.models.models import GroupRead, GroupDetailRead

router = APIRouter()

def get_group_service(session: AsyncSession = Depends(get_session)) -> GroupService:
    return GroupService(session)

@router.get("/", response_model=List[GroupRead])
async def list_groups(
    subject_code: Optional[str] = Query(None),
    semester: Optional[str] = Query(None),
    professor_id: Optional[str] = Query(None),
    service: GroupService = Depends(get_group_service)
):
    """CRÍTICO: Listar grupos con filtros para selección"""
    if subject_code and semester:
        return await service.get_groups_by_subject_and_semester(subject_code, semester)
    elif subject_code:
        return await service.get_groups_by_subject(subject_code)
    elif semester:
        return await service.get_groups_by_semester(semester)
    elif professor_id:
        return await service.get_groups_by_professor(professor_id)
    else:
        return await service.get_all()

@router.get("/{subject_code}/{semester}/{group_number}", response_model=GroupDetailRead)
async def get_group_detail(
    subject_code: str = Path(...),
    semester: str = Path(...),
    group_number: int = Path(...),
    service: GroupService = Depends(get_group_service)
):
    """CRÍTICO: Validar grupo específico y obtener detalles completos"""
    return await service.get_group_with_details(subject_code, semester, group_number)

@router.get("/by-subject/{subject_code}", response_model=List[GroupRead])
async def get_groups_by_subject(
    subject_code: str,
    semester: Optional[str] = Query(None),
    service: GroupService = Depends(get_group_service)
):
    """CRÍTICO: Grupos de una materia (con filtro opcional de semestre)"""
    if semester:
        return await service.get_groups_by_subject_and_semester(subject_code, semester)
    return await service.get_groups_by_subject(subject_code)

