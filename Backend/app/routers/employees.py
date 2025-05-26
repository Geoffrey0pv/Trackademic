from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Path
from sqlmodel.ext.asyncio.session import AsyncSession

from app.db.session import get_session
from app.services.employee_service import EmployeeService
from app.models.models import EmployeeRead, EmployeeCreate, EmployeeUpdate

router = APIRouter()

def get_employee_service(session: AsyncSession = Depends(get_session)) -> EmployeeService:
    """Factory function para crear instancia de EmployeeService"""
    return EmployeeService(session)

@router.get("/", response_model=List[EmployeeRead])
async def list_employees(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of records to return"),
    faculty_code: Optional[int] = Query(None, description="Filter by faculty"),
    employee_type: Optional[str] = Query(None, description="Filter by employee type"),
    contract_type: Optional[str] = Query(None, description="Filter by contract type"),
    campus_code: Optional[int] = Query(None, description="Filter by campus"),
    search: Optional[str] = Query(None, description="Search by name, email or ID"),
    service: EmployeeService = Depends(get_employee_service)
):
    """
    Listar empleados con filtros opcionales
    
    - **skip**: Número de registros a omitir (para paginación)
    - **limit**: Número máximo de registros a retornar
    - **faculty_code**: Filtrar por código de facultad
    - **employee_type**: Filtrar por tipo de empleado
    - **contract_type**: Filtrar por tipo de contrato
    - **campus_code**: Filtrar por código de campus
    - **search**: Buscar por nombre, apellido, email o ID
    """
    if search:
        return await service.search_employees(search)
    else:
        return await service.get_employees_with_filters(
            faculty_code=faculty_code,
            employee_type=employee_type,
            contract_type=contract_type,
            campus_code=campus_code,
            skip=skip,
            limit=limit
        )

@router.get("/{employee_id}", response_model=EmployeeRead)
async def get_employee(
    employee_id: str = Path(..., description="Employee ID"),
    service: EmployeeService = Depends(get_employee_service)
):
    """Obtener un empleado específico por ID"""
    return await service.get_by_id_or_fail(employee_id)

@router.post("/", response_model=EmployeeRead, status_code=201)
async def create_employee(
    employee_data: EmployeeCreate,
    service: EmployeeService = Depends(get_employee_service)
):
    """
    Crear un nuevo empleado
    
    Valida automáticamente:
    - Que el ID no esté duplicado
    - Que existan la facultad, campus, ciudad de nacimiento
    - Que existan los tipos de contrato y empleado
    """
    return await service.create(employee_data)

@router.put("/{employee_id}", response_model=EmployeeRead)
async def update_employee(
    employee_id: str = Path(..., description="Employee ID"),
    employee_data: EmployeeUpdate = ...,
    service: EmployeeService = Depends(get_employee_service)
):
    """
    Actualizar un empleado existente
    
    Solo actualiza los campos proporcionados (partial update)
    """
    return await service.update(employee_id, employee_data)

@router.delete("/{employee_id}")
async def delete_employee(
    employee_id: str = Path(..., description="Employee ID"),
    service: EmployeeService = Depends(get_employee_service)
):
    """Eliminar un empleado"""
    await service.delete(employee_id)
    return {"message": "Employee deleted successfully"}

# ==============================================
# ENDPOINTS ESPECIALIZADOS
# ==============================================

@router.get("/by-faculty/{faculty_code}", response_model=List[EmployeeRead])
async def get_employees_by_faculty(
    faculty_code: int = Path(..., description="Faculty code"),
    service: EmployeeService = Depends(get_employee_service)
):
    """Obtener todos los empleados de una facultad específica"""
    return await service.get_employees_by_faculty(faculty_code)

@router.get("/by-type/{employee_type}", response_model=List[EmployeeRead])
async def get_employees_by_type(
    employee_type: str = Path(..., description="Employee type"),
    service: EmployeeService = Depends(get_employee_service)
):
    """Obtener empleados por tipo (ej: 'Profesor', 'Administrativo')"""
    return await service.get_employees_by_type(employee_type)

@router.get("/by-contract/{contract_type}", response_model=List[EmployeeRead])
async def get_employees_by_contract_type(
    contract_type: str = Path(..., description="Contract type"),
    service: EmployeeService = Depends(get_employee_service)
):
    """Obtener empleados por tipo de contrato"""
    return await service.get_employees_by_contract_type(contract_type)

@router.get("/by-campus/{campus_code}", response_model=List[EmployeeRead])
async def get_employees_by_campus(
    campus_code: int = Path(..., description="Campus code"),
    service: EmployeeService = Depends(get_employee_service)
):
    """Obtener empleados por campus"""
    return await service.get_employees_by_campus(campus_code)

@router.get("/professors/all", response_model=List[EmployeeRead])
async def get_all_professors(
    service: EmployeeService = Depends(get_employee_service)
):
    """Obtener solo los empleados que son profesores"""
    return await service.get_professors_only()

# ==============================================
# ENDPOINTS DE REPORTES Y ESTADÍSTICAS
# ==============================================

@router.get("/reports/count-by-faculty", response_model=List[dict])
async def get_employee_count_by_faculty(
    service: EmployeeService = Depends(get_employee_service)
):
    """
    Obtener reporte de cantidad de empleados por facultad
    
    Retorna: [{"faculty_name": "Ingeniería", "employee_count": 25}, ...]
    """
    return await service.get_employee_count_by_faculty()

@router.get("/reports/count-by-type", response_model=List[dict])
async def get_employee_count_by_type(
    service: EmployeeService = Depends(get_employee_service)
):
    """
    Obtener reporte de cantidad de empleados por tipo
    
    Retorna: [{"employee_type": "Profesor", "count": 150}, ...]
    """
    return await service.get_employee_count_by_type()