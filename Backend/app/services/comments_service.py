# app/services/comments_service.py

from typing import List, Optional
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorCollection
from datetime import datetime

from app.models.models import Comments, CommentsCreate
from app.utils.mongo_helpers import to_object_id

class CommentsService:
    def __init__(self, collection: AsyncIOMotorCollection):
        self.collection = collection

    async def create(self, comment: CommentsCreate, plan_id: str) -> dict:
        doc = comment.model_dump()
        doc["evaluation_plan_id"] = to_object_id(plan_id)

        doc["created_at"] = datetime.utcnow()
        doc["commenter_id"]=to_object_id(doc["commenter_id"])
        result = await self.collection.insert_one(doc)
        created_comment = await self.collection.find_one({"_id": result.inserted_id})
        return self.serialize(created_comment, "_id", "commenter_id")


    async def get_all(self) -> List[Comments]:
        cursor = self.collection.find()
        return [self.serialize(doc, "_id", "commenter_id") async for doc in cursor]

    async def get_by_plan(self, evaluation_plan_id: str) -> List[Comments]:
        cursor = self.collection.find({"evaluation_plan_id": to_object_id(evaluation_plan_id)})
        return [self.serialize(doc, "_id", "commenter_id") async for doc in cursor]

    async def get_by_id(self, id: str | ObjectId) -> Optional[Comments]:
        doc = await self.collection.find_one({"_id": to_object_id(id)})
        return self.serialize(doc, "_id", "commenter_id") if doc else None

    async def update(self, id: str, comment: CommentsCreate) -> Optional[Comments]:
        result = await self.collection.update_one(
            {"_id": to_object_id(id)},
            {"$set": comment.model_dump(by_alias=True)}
        )
        if result.matched_count == 0:
            return None
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
    