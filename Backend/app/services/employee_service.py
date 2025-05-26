from typing import List, Optional
from sqlmodel import select, and_, or_
from sqlmodel.ext.asyncio.session import AsyncSession
from fastapi import HTTPException, status

from app.models.models import Employee, Faculty, Campus, City, ContractType, EmployeeType
from app.models.models import EmployeeRead, EmployeeCreate, EmployeeUpdate
from .base_service import BaseService

class EmployeeService(BaseService[Employee, EmployeeCreate, EmployeeUpdate]):
    """Servicio para gestión de empleados"""
    
    def __init__(self, session: AsyncSession):
        super().__init__(Employee, session)
    
    async def get_by_id(self, employee_id: str) -> Optional[Employee]:
        """Obtener empleado por ID (override porque el ID es string)"""
        result = await self.session.exec(
            select(Employee).where(Employee.id == employee_id)
        )
        return result.first()
    
    async def get_by_id_or_fail(self, employee_id: str) -> Employee:
        """Obtener empleado por ID o lanzar excepción"""
        employee = await self.get_by_id(employee_id)
        if not employee:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Employee with ID '{employee_id}' not found"
            )
        return employee
    
    async def create(self, obj_in: EmployeeCreate) -> Employee:
        """Crear nuevo empleado con validaciones"""
        # Verificar que el ID no exista
        existing = await self.get_by_id(obj_in.id)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Employee with ID '{obj_in.id}' already exists"
            )
        
        # Validar que existan las foreign keys
        await self._validate_foreign_keys(obj_in)
        
        # Crear el empleado
        employee = Employee(**obj_in.dict())
        self.session.add(employee)
        await self.session.commit()
        await self.session.refresh(employee)
        return employee
    
    async def update(self, employee_id: str, obj_in: EmployeeUpdate) -> Employee:
        """Actualizar empleado con validaciones"""
        employee = await self.get_by_id_or_fail(employee_id)
        
        # Si se van a actualizar foreign keys, validarlas
        update_data = obj_in.dict(exclude_unset=True)
        if any(key in update_data for key in ['faculty_code', 'campus_code', 'birth_place_code', 'contract_type', 'employee_type']):
            await self._validate_foreign_keys_for_update(update_data)
        
        # Actualizar campos
        for field, value in update_data.items():
            setattr(employee, field, value)
        
        await self.session.commit()
        await self.session.refresh(employee)
        return employee
    
    async def delete(self, employee_id: str) -> bool:
        """Eliminar empleado"""
        employee = await self.get_by_id_or_fail(employee_id)
        await self.session.delete(employee)
        await self.session.commit()
        return True
    
    # ==============================================
    # MÉTODOS DE BÚSQUEDA Y FILTRADO
    # ==============================================
    
    async def get_employees_by_faculty(self, faculty_code: int) -> List[Employee]:
        """Obtener empleados por facultad"""
        result = await self.session.exec(
            select(Employee).where(Employee.faculty_code == faculty_code)
        )
        return result.all()
    
    async def get_employees_by_type(self, employee_type: str) -> List[Employee]:
        """Obtener empleados por tipo"""
        result = await self.session.exec(
            select(Employee).where(Employee.employee_type == employee_type)
        )
        return result.all()
    
    async def get_employees_by_contract_type(self, contract_type: str) -> List[Employee]:
        """Obtener empleados por tipo de contrato"""
        result = await self.session.exec(
            select(Employee).where(Employee.contract_type == contract_type)
        )
        return result.all()
    
    async def get_employees_by_campus(self, campus_code: int) -> List[Employee]:
        """Obtener empleados por campus"""
        result = await self.session.exec(
            select(Employee).where(Employee.campus_code == campus_code)
        )
        return result.all()
    
    async def get_professors_only(self) -> List[Employee]:
        """Obtener solo los profesores"""
        result = await self.session.exec(
            select(Employee).where(Employee.employee_type == "Profesor")
        )
        return result.all()
    
    async def search_employees(self, query: str) -> List[Employee]:
        """Buscar empleados por nombre, apellido o email"""
        search_term = f"%{query}%"
        result = await self.session.exec(
            select(Employee).where(
                or_(
                    Employee.first_name.ilike(search_term),
                    Employee.last_name.ilike(search_term),
                    Employee.email.ilike(search_term),
                    Employee.id.ilike(search_term)
                )
            )
        )
        return result.all()
    
    async def get_employees_with_filters(
        self,
        faculty_code: Optional[int] = None,
        employee_type: Optional[str] = None,
        contract_type: Optional[str] = None,
        campus_code: Optional[int] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[Employee]:
        """Obtener empleados con múltiples filtros"""
        query = select(Employee)
        
        conditions = []
        if faculty_code:
            conditions.append(Employee.faculty_code == faculty_code)
        if employee_type:
            conditions.append(Employee.employee_type == employee_type)
        if contract_type:
            conditions.append(Employee.contract_type == contract_type)
        if campus_code:
            conditions.append(Employee.campus_code == campus_code)
        
        if conditions:
            query = query.where(and_(*conditions))
        
        query = query.offset(skip).limit(limit)
        result = await self.session.exec(query)
        return result.all()
    
    # ==============================================
    # MÉTODOS DE ESTADÍSTICAS Y REPORTES
    # ==============================================
    
    async def get_employee_count_by_faculty(self) -> List[dict]:
        """Obtener conteo de empleados por facultad"""
        result = await self.session.exec(
            select(Employee.faculty_code, Faculty.name)
            .join(Faculty, Employee.faculty_code == Faculty.code)
        )
        
        # Contar manualmente (en un caso real usarías GROUP BY)
        faculty_counts = {}
        async for employee_faculty_code, faculty_name in result:
            if faculty_name not in faculty_counts:
                faculty_counts[faculty_name] = 0
            faculty_counts[faculty_name] += 1
        
        return [
            {"faculty_name": name, "employee_count": count}
            for name, count in faculty_counts.items()
        ]
    
    async def get_employee_count_by_type(self) -> List[dict]:
        """Obtener conteo de empleados por tipo"""
        result = await self.session.exec(select(Employee.employee_type))
        
        type_counts = {}
        for employee_type in result.all():
            if employee_type not in type_counts:
                type_counts[employee_type] = 0
            type_counts[employee_type] += 1
        
        return [
            {"employee_type": emp_type, "count": count}
            for emp_type, count in type_counts.items()
        ]
    
    # ==============================================
    # MÉTODOS DE VALIDACIÓN PRIVADOS
    # ==============================================
    
    async def _validate_foreign_keys(self, employee_data: EmployeeCreate):
        """Validar que existan todas las foreign keys"""
        # Validar Faculty
        faculty_result = await self.session.exec(
            select(Faculty).where(Faculty.code == employee_data.faculty_code)
        )
        if not faculty_result.first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Faculty with code {employee_data.faculty_code} not found"
            )
        
        # Validar Campus
        campus_result = await self.session.exec(
            select(Campus).where(Campus.code == employee_data.campus_code)
        )
        if not campus_result.first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Campus with code {employee_data.campus_code} not found"
            )
        
        # Validar Birth Place (City)
        city_result = await self.session.exec(
            select(City).where(City.code == employee_data.birth_place_code)
        )
        if not city_result.first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"City with code {employee_data.birth_place_code} not found"
            )
        
        # Validar Contract Type
        contract_result = await self.session.exec(
            select(ContractType).where(ContractType.name == employee_data.contract_type)
        )
        if not contract_result.first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Contract type '{employee_data.contract_type}' not found"
            )
        
        # Validar Employee Type
        emp_type_result = await self.session.exec(
            select(EmployeeType).where(EmployeeType.name == employee_data.employee_type)
        )
        if not emp_type_result.first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Employee type '{employee_data.employee_type}' not found"
            )
    
    async def _validate_foreign_keys_for_update(self, update_data: dict):
        """Validar foreign keys para actualización"""
        if 'faculty_code' in update_data:
            faculty_result = await self.session.exec(
                select(Faculty).where(Faculty.code == update_data['faculty_code'])
            )
            if not faculty_result.first():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Faculty with code {update_data['faculty_code']} not found"
                )
        
        if 'campus_code' in update_data:
            campus_result = await self.session.exec(
                select(Campus).where(Campus.code == update_data['campus_code'])
            )
            if not campus_result.first():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Campus with code {update_data['campus_code']} not found"
                )
        
        if 'birth_place_code' in update_data:
            city_result = await self.session.exec(
                select(City).where(City.code == update_data['birth_place_code'])
            )
            if not city_result.first():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"City with code {update_data['birth_place_code']} not found"
                )
        
        if 'contract_type' in update_data:
            contract_result = await self.session.exec(
                select(ContractType).where(ContractType.name == update_data['contract_type'])
            )
            if not contract_result.first():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Contract type '{update_data['contract_type']}' not found"
                )
        
        if 'employee_type' in update_data:
            emp_type_result = await self.session.exec(
                select(EmployeeType).where(EmployeeType.name == update_data['employee_type'])
            )
            if not emp_type_result.first():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Employee type '{update_data['employee_type']}' not found"
                )