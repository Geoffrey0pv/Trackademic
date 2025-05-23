# file: app/routers/employees.py

from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.db.session import get_session
from app.models.models import Employee, EmployeeCreate, EmployeeRead, EmployeeUpdate

router = APIRouter()

@router.get("/", response_model=List[EmployeeRead])
async def list_employees(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    session: AsyncSession = Depends(get_session)
):
    """Obtener todos los empleados con paginación"""
    result = await session.exec(select(Employee).offset(skip).limit(limit))
    return result.all()

@router.get("/{employee_id}", response_model=EmployeeRead)
async def get_employee(employee_id: str, session: AsyncSession = Depends(get_session)):
    """Obtener un empleado por ID"""
    result = await session.exec(select(Employee).where(Employee.id == employee_id))
    employee = result.first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee

@router.post("/", response_model=EmployeeRead)
async def create_employee(employee_data: EmployeeCreate, session: AsyncSession = Depends(get_session)):
    """Crear un nuevo empleado"""
    # Verificar si el ID ya existe
    existing = await session.exec(select(Employee).where(Employee.id == employee_data.id))
    if existing.first():
        raise HTTPException(status_code=400, detail="Employee ID already exists")
    
    employee = Employee(**employee_data.dict())
    session.add(employee)
    await session.commit()
    await session.refresh(employee)
    return employee

@router.put("/{employee_id}", response_model=EmployeeRead)
async def update_employee(
    employee_id: str, 
    employee_data: EmployeeUpdate, 
    session: AsyncSession = Depends(get_session)
):
    """Actualizar un empleado"""
    result = await session.exec(select(Employee).where(Employee.id == employee_id))
    employee = result.first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    # Actualizar solo los campos proporcionados
    update_data = employee_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(employee, field, value)
    
    await session.commit()
    await session.refresh(employee)
    return employee

@router.delete("/{employee_id}")
async def delete_employee(employee_id: str, session: AsyncSession = Depends(get_session)):
    """Eliminar un empleado"""
    result = await session.exec(select(Employee).where(Employee.id == employee_id))
    employee = result.first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    await session.delete(employee)
    await session.commit()
    return {"message": "Employee deleted successfully"}

@router.get("/by-faculty/{faculty_code}", response_model=List[EmployeeRead])
async def get_employees_by_faculty(
    faculty_code: int, 
    session: AsyncSession = Depends(get_session)
):
    """Obtener empleados por facultad"""
    result = await session.exec(select(Employee).where(Employee.faculty_code == faculty_code))
    return result.all()

@router.get("/by-type/{employee_type}", response_model=List[EmployeeRead])
async def get_employees_by_type(
    employee_type: str, 
    session: AsyncSession = Depends(get_session)
):
    """Obtener empleados por tipo"""
    result = await session.exec(select(Employee).where(Employee.employee_type == employee_type))
    return result.all()