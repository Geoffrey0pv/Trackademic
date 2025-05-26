from typing import List, Optional
from fastapi import APIRouter, Depends, Query, Path
from sqlmodel.ext.asyncio.session import AsyncSession

from app.db.session import get_session
from app.services.academic_service import AcademicService
from app.models.models import ProgramRead, FacultyRead, CampusRead, SubjectRead

router = APIRouter()

def get_academic_service(session: AsyncSession = Depends(get_session)) -> AcademicService:
    return AcademicService(session)

@router.get("/programs", response_model=List[ProgramRead])
async def list_programs(
    faculty_code: Optional[int] = Query(None),
    service: AcademicService = Depends(get_academic_service)
):
    """CRÍTICO: Catálogo de programas para filtros"""
    if faculty_code:
        return await service.get_programs_by_faculty(faculty_code)
    return await service.get_all_programs()

@router.get("/faculties", response_model=List[FacultyRead])
async def list_faculties(
    service: AcademicService = Depends(get_academic_service)
):
    """CRÍTICO: Catálogo de facultades"""
    return await service.get_all_faculties()

@router.get("/campuses", response_model=List[CampusRead])
async def list_campuses(
    service: AcademicService = Depends(get_academic_service)
):
    """CRÍTICO: Catálogo de campus"""
    return await service.get_all_campuses()

@router.get("/semesters", response_model=List[str])
async def list_active_semesters(
    service: AcademicService = Depends(get_academic_service)
):
    """CRÍTICO: Lista de semestres activos"""
    return await service.get_active_semesters()

@router.get("/programs/{program_id}/subjects", response_model=List[SubjectRead])
async def get_program_subjects(
    program_id: int,
    service: AcademicService = Depends(get_academic_service)
):
    """CRÍTICO: Materias de un programa específico"""
    return await service.get_subjects_by_program(program_id)