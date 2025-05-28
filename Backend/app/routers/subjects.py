from typing import List
from fastapi import APIRouter, Depends, Query
from sqlmodel.ext.asyncio.session import AsyncSession

from app.db.session import get_session
from app.services.subject_service import SubjectService
from app.models.models import SubjectRead, SubjectCreate, SubjectUpdate

router = APIRouter()

def get_subject_service(session: AsyncSession = Depends(get_session)) -> SubjectService:
    return SubjectService(session)

@router.get("/", response_model=List[SubjectRead])
async def list_subjects(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    program_code: int = Query(None, description="Filter by program"),
    search: str = Query(None, description="Search by name or code"),
    service: SubjectService = Depends(get_subject_service)
):
    """Listar materias con filtros opcionales"""
    if search:
        return await service.search_subjects(search)
    elif program_code:
        return await service.get_subjects_by_program(program_code)
    else:
        return await service.get_all(skip, limit)

"""  
Obtenemos la lista de materias por programa y el código de la materia y el semestre
"""
@router.get("/all", response_model=List[SubjectRead])
async def list_all_subjects(
    service: SubjectService = Depends(get_subject_service)
):
    """Listar todas las materias"""
    return await service.get_all()

@router.get("/{subject_code}", response_model=SubjectRead)
async def get_subject(
    subject_code: str,
    service: SubjectService = Depends(get_subject_service)
):
    """Obtener materia por código"""
    return await service.get_by_code_or_fail(subject_code)

@router.get("/{subject_code}/semesters", response_model=List[str])
async def get_subject_semesters(
    subject_code: str,
    service: SubjectService = Depends(get_subject_service)
):
    """Obtener semestres disponibles para una materia"""
    return await service.get_semesters_for_subject(subject_code)

@router.post("/", response_model=SubjectRead)
async def create_subject(
    subject_data: SubjectCreate,
    service: SubjectService = Depends(get_subject_service)
):
    """Crear nueva materia"""
    return await service.create(subject_data)

@router.put("/{subject_code}", response_model=SubjectRead)
async def update_subject(
    subject_code: str,
    subject_data: SubjectUpdate,
    service: SubjectService = Depends(get_subject_service)
):
    """Actualizar materia"""
    return await service.update(subject_code, subject_data)

@router.delete("/{subject_code}")
async def delete_subject(
    subject_code: str,
    service: SubjectService = Depends(get_subject_service)
):
    """Eliminar materia"""
    await service.delete(subject_code)
    return {"message": "Subject deleted successfully"}