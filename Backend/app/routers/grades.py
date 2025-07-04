from fastapi import APIRouter, HTTPException, Depends
from sqlmodel.ext.asyncio.session import AsyncSession

from app.db.session import get_session
from app.db.database import mongo_db
from app.models.models import Grades, GradesCreate
from app.services.grades_service import GradesService
from app.services.subject_service import SubjectService
from app.services.group_service import GroupService

router = APIRouter()

def get_grades_service() -> GradesService:
    return GradesService(mongo_db["grades"])

@router.post("/", response_model=Grades, status_code=201)
async def create_grade(
    grade: GradesCreate,
    session: AsyncSession = Depends(get_session),
    service: GradesService = Depends(get_grades_service)
):
    await SubjectService(session).get_by_code_or_fail(grade.subject_id)
    await GroupService(session).get_group_by_composite_key_or_fail(
        subject_code=grade.subject_id,
        semester=grade.semester,
        group_number=grade.group_id
    )

    total_weight = sum(d.grade_decimal for d in grade.derivables)
    if round(total_weight, 2) != 1.0:
        raise HTTPException(status_code=400, detail="Los pesos deben sumar 1.0")

    return await service.create(grade)

@router.get("/", response_model=list[Grades])
async def get_all(service: GradesService = Depends(get_grades_service)):
    return await service.get_all()

@router.get("/by-user/{user_id}", response_model=list[Grades])
async def by_user(user_id: str, service: GradesService = Depends(get_grades_service)):
    return await service.get_by_user(user_id)

@router.get("/projection/{user_id}/{subject_id}")
async def projection(user_id: str, subject_id: int, service: GradesService = Depends(get_grades_service)):
    result = await service.get_needed_grade(user_id, subject_id)
    if result is None:
        raise HTTPException(status_code=404, detail="No grades found for user and subject")
    return result

@router.get("/semester-consolidate/{user_id}/{semester}")
async def consolidate(user_id: str, semester: str, service: GradesService = Depends(get_grades_service)):
    return await service.get_semester_consolidate(user_id, semester)

@router.get("/comparative/{user_id}")
async def comparative(user_id: str, service: GradesService = Depends(get_grades_service)):
    return await service.comparative_analysis(user_id)

@router.get("/{grade_id}", response_model=Grades)
async def get_one(grade_id: str, service: GradesService = Depends(get_grades_service)):
    grade = await service.get_by_id(grade_id)
    if not grade:
        raise HTTPException(status_code=404, detail="Grade not found")
    return grade

@router.put("/{grade_id}", response_model=Grades)
async def update(grade_id: str, grade: GradesCreate, service: GradesService = Depends(get_grades_service)):
    updated = await service.update(grade_id, grade)
    if not updated:
        raise HTTPException(status_code=404, detail="Grade not found")
    return updated

@router.delete("/{grade_id}")
async def delete(grade_id: str, service: GradesService = Depends(get_grades_service)):
    deleted = await service.delete(grade_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Grade not found")
    return {"message": "Deleted successfully"}
async def create(self, grade: GradesCreate) -> Grades:
    doc = grade.model_dump(by_alias=True)
    doc["created_at"] = datetime.utcnow()
    doc["evaluation_plan_id"] = to_object_id(doc["evaluation_plan_id"])
    doc["user_id"] = to_object_id(doc["user_id"])
    result = await self.collection.insert_one(doc)
    return self.serialize(await self.get_by_id(result.inserted_id), "_id", "user_id", "evaluation_plan_id")
