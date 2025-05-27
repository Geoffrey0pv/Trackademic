
from typing import List, Optional
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorCollection
from datetime import datetime

from app.models.models import Student, StudentCreate
from app.utils.mongo_helpers import to_object_id

from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class StudentService:
    def __init__(self, collection: AsyncIOMotorCollection):
        self.collection = collection

    async def create(self, student: StudentCreate) -> Student:
        doc = student.model_dump(by_alias=True)
        result = await self.collection.insert_one(doc)
        return await self.get_by_id(result.inserted_id)

    async def get_all(self) -> List[Student]:
        cursor = self.collection.find()
        return [self.serialize(doc, "_id") async for doc in cursor]

    async def get_by_id(self, id: str | ObjectId) -> Optional[Student]:
        doc = await self.collection.find_one({"_id": to_object_id(id)})
        return self.serialize(doc, "_id") if doc else None

    async def update(self, id: str, student: Student) -> Optional[Student]:
        await self.collection.update_one(
            {"_id": to_object_id(id)},
            {"$set": student.model_dump(by_alias=True)}
        )
        return await self.get_by_id(id)

    async def delete(self, id: str) -> bool:
        result = await self.collection.delete_one({"_id": to_object_id(id)})
        return result.deleted_count == 1


def serialize(self, doc, *fields):
    for field in fields:
        if field in doc:
            if field.startswith("_"):
                doc[field[1:]] = str(doc[field])
            else:
                doc[field] = str(doc[field])
    return doc
    
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)