from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional, List
from bson.errors import InvalidId
from app.db.database import mongo_db
from app.models.models import Student, StudentCreate, LoginInput
from app.services.student_service import StudentService


router = APIRouter()

def get_plan_service():
    return StudentService(mongo_db.get_collection("student"))

@router.post("/login", response_model=Student)
async def login_student(
    data: LoginInput,
    service: StudentService = Depends(get_plan_service)
):
    try:
        student = await service.login(data.username, data.password)
        if not student:
            raise HTTPException(status_code=404, detail="Student not found or invalid credentials")
        return student
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid ID format")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=List[Student])
async def get_all_students(
    service: StudentService = Depends(get_plan_service)
):
    try:
        students = await service.get_all()
        return students
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{student_id}", response_model=Student)   
async def get_student(
    student_id: str,
    service: StudentService = Depends(get_plan_service)
):
    try:
        student = await service.get_by_id(student_id)
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        return student
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid ID format")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/")
async def create_student(
    student: StudentCreate,
    service: StudentService = Depends(get_plan_service)
):
    try:
        created_student = await service.create(student)
        return created_student
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{student_id}", response_model=Student)
async def update_student(
    student_id: str,
    student: Student,
    service: StudentService = Depends(get_plan_service)
):
    try:
        updated_student = await service.update(student_id, student)
        if not updated_student:
            raise HTTPException(status_code=404, detail="Student not found")
        return updated_student
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid ID format")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{student_id}")
async def delete_student(
    student_id: str,
    service: StudentService = Depends(get_plan_service)
):
    try:
        deleted = await service.delete(student_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Student not found")
        return {"message": "Student deleted successfully"}
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid ID format")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    