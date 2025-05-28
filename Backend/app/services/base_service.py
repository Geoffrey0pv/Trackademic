from abc import ABC, abstractmethod
from typing import Generic, TypeVar, Optional, List
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select, SQLModel
from fastapi import HTTPException, status

ModelType = TypeVar("ModelType", bound=SQLModel)
CreateSchemaType = TypeVar("CreateSchemaType", bound=SQLModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=SQLModel)

class BaseService(Generic[ModelType, CreateSchemaType, UpdateSchemaType], ABC):
    """Servicio base con operaciones CRUD comunes"""
    
    def __init__(self, model: type[ModelType], session: AsyncSession):
        self.model = model
        self.session = session
    
    async def get_by_id(self, id: any) -> Optional[ModelType]:
        """Obtener entidad por ID"""
        result = await self.session.exec(
            select(self.model).where(self.model.id == id)
        )
        return result.first()
    
    async def get_by_id_or_fail(self, id: any) -> ModelType:
        """Obtener entidad por ID o lanzar excepción"""
        entity = await self.get_by_id(id)
        if not entity:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"{self.model.__name__} with id '{id}' not found"
            )
        return entity
    
    async def get_all(self, skip: int = 0, limit: int = 100) -> List[ModelType]:
        """Obtener todas las entidades con paginación"""
        result = await self.session.exec(
            select(self.model).offset(skip).limit(limit)
        )
        return result.all()
    
    async def create(self, obj_in: CreateSchemaType) -> ModelType:
        """Crear nueva entidad"""
        db_obj = self.model(**obj_in.dict())
        self.session.add(db_obj)
        await self.session.commit()
        await self.session.refresh(db_obj)
        return db_obj
    
    async def update(self, id: any, obj_in: UpdateSchemaType) -> ModelType:
        """Actualizar entidad existente"""
        db_obj = await self.get_by_id_or_fail(id)
        update_data = obj_in.dict(exclude_unset=True)
        
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        
        await self.session.commit()
        await self.session.refresh(db_obj)
        return db_obj
    
    async def delete(self, id: any) -> bool:
        """Eliminar entidad"""
        db_obj = await self.get_by_id_or_fail(id)
        await self.session.delete(db_obj)
        await self.session.commit()
        return True
