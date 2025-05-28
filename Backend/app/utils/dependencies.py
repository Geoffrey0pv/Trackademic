from fastapi import Depends
from sqlmodel.ext.asyncio.session import AsyncSession

from app.db.session import get_session
from app.services.subject_service import SubjectService
from app.services.group_service import GroupService
from app.services.employee_service import EmployeeService

def get_subject_service(session: AsyncSession = Depends(get_session)) -> SubjectService:
    return SubjectService(session)

def get_group_service(session: AsyncSession = Depends(get_session)) -> GroupService:
    return GroupService(session)

def get_employee_service(session: AsyncSession = Depends(get_session)) -> EmployeeService:
    return EmployeeService(session)