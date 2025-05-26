# File: app/services/academic_service.py
from typing import List
from sqlalchemy import func
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.models.models import (
    Program, Area, Faculty, Campus, City, Subject,
    ProgramRead, FacultyRead, CampusRead, SubjectRead
)

class AcademicService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_all_programs(self) -> List[ProgramRead]:
        statement = (
            select(
                Program.code,
                Program.name,
                Program.area_code,
                Area.name.label("area_name"),
                Faculty.name.label("faculty_name")
            )
            .join(Area, Program.area_code == Area.code)
            .join(Faculty, Area.faculty_code == Faculty.code)
        )
        result = await self.session.exec(statement)
        return [
            ProgramRead(
                code=r.code,
                name=r.name,
                area_code=r.area_code,
                area_name=r.area_name,
                faculty_name=r.faculty_name
            )
            for r in result.all()
        ]

    async def get_programs_by_faculty(self, faculty_code: int) -> List[ProgramRead]:
        statement = (
            select(
                Program.code,
                Program.name,
                Program.area_code,
                Area.name.label("area_name"),
                Faculty.name.label("faculty_name")
            )
            .join(Area, Program.area_code == Area.code)
            .join(Faculty, Area.faculty_code == Faculty.code)
            .where(Faculty.code == faculty_code)
        )
        result = await self.session.exec(statement)
        return [
            ProgramRead(
                code=r.code,
                name=r.name,
                area_code=r.area_code,
                area_name=r.area_name,
                faculty_name=r.faculty_name
            )
            for r in result.all()
        ]

    async def get_all_faculties(self) -> List[FacultyRead]:
        from app.models.models import Employee

        statement = (
            select(
                Faculty.code,
                Faculty.name,
                Faculty.location,
                Faculty.phone_number,
                Faculty.dean_id,
                func.concat(Employee.first_name, ' ', Employee.last_name).label('dean_name')
            )
            .outerjoin(Employee, Faculty.dean_id == Employee.id)
        )
        result = await self.session.exec(statement)
        return [
            FacultyRead(
                code=r.code,
                name=r.name,
                location=r.location,
                phone_number=r.phone_number,
                dean_id=r.dean_id,
                dean_name=r.dean_name
            )
            for r in result.all()
        ]

    async def get_all_campuses(self) -> List[CampusRead]:
        statement = (
            select(
                Campus.code,
                Campus.name,
                Campus.city_code,
                City.name.label('city_name')
            )
            .join(City, Campus.city_code == City.code)
        )
        result = await self.session.exec(statement)
        return [
            CampusRead(
                code=r.code,
                name=r.name,
                city_code=r.city_code,
                city_name=r.city_name
            )
            for r in result.all()
        ]

    async def get_active_semesters(self) -> List[str]:
        from app.models.models import Group

        statement = select(Group.semester).distinct().order_by(Group.semester)
        result = await self.session.exec(statement)
        return result.all()

    async def get_subjects_by_program(self, program_id: int) -> List[SubjectRead]:
        statement = (
            select(
                Subject.code,
                Subject.name,
                Subject.program_code
            )
            .where(Subject.program_code == program_id)
        )
        result = await self.session.exec(statement)
        return [
            SubjectRead(
                code=r.code,
                name=r.name,
                program_code=r.program_code
            )
            for r in result.all()
        ]