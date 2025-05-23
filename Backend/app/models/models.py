# file: app/models.py

from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime

# Tablas independientes (sin foreign keys)
class Country(SQLModel, table=True):
    __tablename__ = "countries"
    
    code: int = Field(primary_key=True)
    name: str = Field(max_length=20)
    
    # Relaciones
    departments: List["Department"] = Relationship(back_populates="country")

class ContractType(SQLModel, table=True):
    __tablename__ = "contract_types"
    
    name: str = Field(primary_key=True, max_length=30)
    
    # Relaciones
    employees: List["Employee"] = Relationship(back_populates="contract_type_rel")

class EmployeeType(SQLModel, table=True):
    __tablename__ = "employee_types"
    
    name: str = Field(primary_key=True, max_length=30)
    
    # Relaciones
    employees: List["Employee"] = Relationship(back_populates="employee_type_rel")

# Tablas con dependencias de primer nivel
class Department(SQLModel, table=True):
    __tablename__ = "departments"
    
    code: int = Field(primary_key=True)
    name: str = Field(max_length=20)
    country_code: int = Field(foreign_key="countries.code")
    
    # Relaciones
    country: Country = Relationship(back_populates="departments")
    cities: List["City"] = Relationship(back_populates="department")

class City(SQLModel, table=True):
    __tablename__ = "cities"
    
    code: int = Field(primary_key=True)
    name: str = Field(max_length=20)
    dept_code: int = Field(foreign_key="departments.code")
    
    # Relaciones
    department: Department = Relationship(back_populates="cities")
    campuses: List["Campus"] = Relationship(back_populates="city")
    employees_born_here: List["Employee"] = Relationship(back_populates="birth_place")

class Campus(SQLModel, table=True):
    __tablename__ = "campuses"
    
    code: int = Field(primary_key=True)
    name: Optional[str] = Field(default=None, max_length=20)
    city_code: int = Field(foreign_key="cities.code")
    
    # Relaciones
    city: City = Relationship(back_populates="campuses")
    employees: List["Employee"] = Relationship(back_populates="campus")

class Faculty(SQLModel, table=True):
    __tablename__ = "faculties"
    
    code: int = Field(primary_key=True)
    name: str = Field(max_length=20)
    location: str = Field(max_length=15)
    phone_number: str = Field(max_length=15)
    dean_id: Optional[str] = Field(default=None, foreign_key="employees.id", unique=True)
    
    # Relaciones
    dean: Optional["Employee"] = Relationship(
        back_populates="dean_of_faculty",
        sa_relationship_kwargs={"foreign_keys": "[Faculty.dean_id]"}
    )
    employees: List["Employee"] = Relationship(
        back_populates="faculty",
        sa_relationship_kwargs={"foreign_keys": "[Employee.faculty_code]"}
    )
    areas: List["Area"] = Relationship(back_populates="faculty")

class Employee(SQLModel, table=True):
    __tablename__ = "employees"
    
    id: str = Field(primary_key=True, max_length=15)
    first_name: str = Field(max_length=30)
    last_name: str = Field(max_length=30)
    email: str = Field(max_length=30)
    contract_type: str = Field(foreign_key="contract_types.name", max_length=30)
    employee_type: str = Field(foreign_key="employee_types.name", max_length=30)
    faculty_code: int = Field(foreign_key="faculties.code")
    campus_code: int = Field(foreign_key="campuses.code")
    birth_place_code: int = Field(foreign_key="cities.code")
    
    # Relaciones
    contract_type_rel: ContractType = Relationship(back_populates="employees")
    employee_type_rel: EmployeeType = Relationship(back_populates="employees")
    faculty: Faculty = Relationship(
        back_populates="employees",
        sa_relationship_kwargs={"foreign_keys": "[Employee.faculty_code]"}
    )
    campus: Campus = Relationship(back_populates="employees")
    birth_place: City = Relationship(back_populates="employees_born_here")
    
    # Relación como decano
    dean_of_faculty: Optional[Faculty] = Relationship(
        back_populates="dean",
        sa_relationship_kwargs={"foreign_keys": "[Faculty.dean_id]"}
    )
    
    # Relación como coordinador de área
    coordinated_area: Optional["Area"] = Relationship(back_populates="coordinator")
    
    # Relación como profesor
    groups: List["Group"] = Relationship(back_populates="professor")

class Area(SQLModel, table=True):
    __tablename__ = "areas"
    
    code: int = Field(primary_key=True)
    name: str = Field(max_length=20)
    faculty_code: int = Field(foreign_key="faculties.code")
    coordinator_id: str = Field(foreign_key="employees.id", unique=True, max_length=15)
    
    # Relaciones
    faculty: Faculty = Relationship(back_populates="areas")
    coordinator: Employee = Relationship(back_populates="coordinated_area")
    programs: List["Program"] = Relationship(back_populates="area")

class Program(SQLModel, table=True):
    __tablename__ = "programs"
    
    code: int = Field(primary_key=True)
    name: str = Field(max_length=40)
    area_code: int = Field(foreign_key="areas.code")
    
    # Relaciones
    area: Area = Relationship(back_populates="programs")
    subjects: List["Subject"] = Relationship(back_populates="program")

class Subject(SQLModel, table=True):
    __tablename__ = "subjects"
    
    code: str = Field(primary_key=True, max_length=10)
    name: str = Field(max_length=30)
    program_code: int = Field(foreign_key="programs.code")
    
    # Relaciones
    program: Program = Relationship(back_populates="subjects")
    groups: List["Group"] = Relationship(back_populates="subject")

class Group(SQLModel, table=True):
    __tablename__ = "groups"
    
    number: int = Field(primary_key=True)
    semester: str = Field(primary_key=True, max_length=6)
    subject_code: str = Field(primary_key=True, foreign_key="subjects.code", max_length=10)
    professor_id: str = Field(foreign_key="employees.id", max_length=15)
    
    # Relaciones
    subject: Subject = Relationship(back_populates="groups")
    professor: Employee = Relationship(back_populates="groups")

# Modelos para requests/responses (sin table=True)
class EmployeeCreate(SQLModel):
    id: str = Field(max_length=15)
    first_name: str = Field(max_length=30)
    last_name: str = Field(max_length=30)
    email: str = Field(max_length=30)
    contract_type: str = Field(max_length=30)
    employee_type: str = Field(max_length=30)
    faculty_code: int
    campus_code: int
    birth_place_code: int

class EmployeeUpdate(SQLModel):
    first_name: Optional[str] = Field(default=None, max_length=30)
    last_name: Optional[str] = Field(default=None, max_length=30)
    email: Optional[str] = Field(default=None, max_length=30)
    contract_type: Optional[str] = Field(default=None, max_length=30)
    employee_type: Optional[str] = Field(default=None, max_length=30)
    faculty_code: Optional[int] = None
    campus_code: Optional[int] = None
    birth_place_code: Optional[int] = None

class EmployeeRead(SQLModel):
    id: str
    first_name: str
    last_name: str
    email: str
    contract_type: str
    employee_type: str
    faculty_code: int
    campus_code: int
    birth_place_code: int