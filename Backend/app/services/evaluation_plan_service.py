
from typing import List, Optional
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorCollection
from datetime import datetime

from app.models.models import EvaluationPlan, EvaluationPlanCreate
from app.utils.mongo_helpers import to_object_id

class EvaluationPlanService:
    def __init__(self, collection: AsyncIOMotorCollection):
        self.collection = collection

    async def create(self, plan: EvaluationPlanCreate) -> EvaluationPlan:
        doc = plan.model_dump(by_alias=True)
        doc["created_at"] = datetime.utcnow()
        result = await self.collection.insert_one(doc)
        return self.serialize(await self.get_by_id(result.inserted_id), "_id")


    async def get_by_id(self, id: str | ObjectId) -> Optional[EvaluationPlan]:
        doc = await self.collection.find_one({"_id": to_object_id(id)})
        return self.serialize(doc, "_id") if doc else None

    async def get_all(self) -> List[EvaluationPlan]:
        cursor = self.collection.find()
        results = []

        async for doc in cursor:
            serialized_doc = self.serialize(doc, "_id", "creator_id")
            results.append(serialized_doc)

        return results


    async def search(self, semester: Optional[str], subject_id: Optional[int]) -> List[EvaluationPlan]:
        query = {}
        if semester:
            query["semester"] = semester
        if subject_id is not None:
            query["subject_id"] = subject_id
        cursor = self.collection.find(query)
        return [self.serialize(doc, "_id") async for doc in cursor]
    

    async def update(self, id: str, plan: EvaluationPlanCreate) -> Optional[EvaluationPlan]:
        await self.collection.update_one(
            {"_id": to_object_id(id)},
            {"$set": plan.model_dump(by_alias=True)}
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
                    del doc[field]
                else:
                    doc[field] = str(doc[field])
        return doc

