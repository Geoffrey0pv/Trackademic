
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
        doc["creator_id"]=ObjectId(doc["creator_id"])
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
        updated_doc = await self.get_by_id(id)
        
        if updated_doc:
            serialized = self.serialize(updated_doc, "_id")  # 👈 Convierte _id a id
            return EvaluationPlan(**serialized)
        return None




    async def delete(self, id: str) -> bool:
        result = await self.collection.delete_one({"_id": to_object_id(id)})
        return result.deleted_count == 1
    

    def serialize(self, doc, *fields):
        for field in fields:
            if field in doc:
                doc[field] = str(doc[field])
        # Asegurar que el id mongo (_id) se vuelva string y se renombre
        if "_id" in doc:
            doc["id"] = str(doc["_id"])
            del doc["_id"]

        # Validaciones específicas
        if "creator_id" in doc:
            doc["creator_id"] = str(doc["creator_id"])
        if "subject_code" not in doc or doc["subject_code"] is None:
            doc["subject_code"] = ""

        return doc
