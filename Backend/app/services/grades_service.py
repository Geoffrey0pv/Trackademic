from typing import List, Optional
from bson import ObjectId
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorCollection

from app.models.models import Grades, GradesCreate
from app.utils.mongo_helpers import to_object_id
from app.db.database import mongo_db  # acceso a evaluationPlan


class GradesService:
    def __init__(self, collection: AsyncIOMotorCollection):
        self.collection = collection
        self.plans = mongo_db["evaluationPlan"]

    def serialize(self, doc, *fields):
        for field in fields:
            if field in doc:
                doc[field.lstrip('_')] = str(doc[field])
        return doc

    async def create(self, grade: GradesCreate) -> Grades:
        doc = grade.model_dump(by_alias=True)
        doc["created_at"] = datetime.utcnow()
        doc["evaluation_plan_id"] = to_object_id(doc["evaluation_plan_id"])
        doc["user_id"] = to_object_id(doc["user_id"])
        result = await self.collection.insert_one(doc)
        return self.serialize(await self.get_by_id(result.inserted_id), "_id", "user_id", "evaluation_plan_id")

    async def get_all(self) -> List[Grades]:
        cursor = self.collection.find()
        return [self.serialize(doc, "_id", "user_id") async for doc in cursor]

    async def get_by_id(self, id: str | ObjectId) -> Optional[Grades]:
        doc = await self.collection.find_one({"_id": to_object_id(id)})
        return self.serialize(doc, "_id") if doc else None

    async def update(self, id: str, grade: GradesCreate) -> Optional[Grades]:
        await self.collection.update_one(
            {"_id": to_object_id(id)},
            {"$set": grade.model_dump(by_alias=True)}
        )
        return await self.get_by_id(id)

    async def delete(self, id: str) -> bool:
        result = await self.collection.delete_one({"_id": to_object_id(id)})
        return result.deleted_count == 1

    async def get_by_user(self, user_id: str) -> List[Grades]:
        cursor = self.collection.find({"user_id": to_object_id(user_id)})
        return [self.serialize(doc, "_id") async for doc in cursor]

    async def get_needed_grade(self, user_id: str, subject_id: int):
        doc = await self.collection.find_one({"user_id": to_object_id(user_id), "subject_id": subject_id})
        if not doc:
            return None

        completed = [d["grade_value"] for d in doc["derivables"]]
        weights = [d["grade_decimal"] for d in doc["derivables"]]
        total_weight = sum(weights)
        weighted_sum = sum(g * w for g, w in zip(completed, weights))
        remaining = 1.0 - total_weight

        if remaining <= 0:
            return {"needed": "Completado"}

        needed = (doc.get("min_passing", 3.0) - weighted_sum) / remaining
        return {"needed": "Imposible" if needed > 5 else round(max(0, needed), 1)}

    async def get_semester_consolidate(self, user_id: str, semester: str):
        cursor = self.collection.find({"user_id": to_object_id(user_id)})
        subjects, total = [], 0

        async for doc in cursor:
            plan = await self.plans.find_one({
                "subject_id": doc["subject_id"],
                "semester": semester
            })
            if plan:
                grades = [d["grade_value"] for d in doc["derivables"]]
                weights = [d["grade_decimal"] for d in doc["derivables"]]
                if not grades: continue
                avg = sum(g * w for g, w in zip(grades, weights)) / sum(weights)
                subjects.append({"subject_id": doc["subject_id"], "average": round(avg, 1)})
                total += avg

        return {
            "subjects": subjects,
            "average": round(total / len(subjects), 2) if subjects else 0.0
        }

    async def comparative_analysis(self, user_id: str):
        cursor = self.collection.find({"user_id": to_object_id(user_id)})
        data = {}

        async for doc in cursor:
            semester = doc.get("semester")
            if not semester: continue

            grades = [d["grade_value"] for d in doc["derivables"]]
            weights = [d["grade_decimal"] for d in doc["derivables"]]
            if not grades or not weights: continue

            avg = sum(g * w for g, w in zip(grades, weights)) / sum(weights)
            passed = avg >= doc.get("min_passing", 3.0)

            if semester not in data:
                data[semester] = {"total_avg": 0, "subjects": 0, "passed": 0}

            data[semester]["total_avg"] += avg
            data[semester]["subjects"] += 1
            data[semester]["passed"] += int(passed)

        return [
            {
                "semester": sem,
                "average": round(v["total_avg"] / v["subjects"], 2),
                "subjects": v["subjects"],
                "progress": {
                    "passed": v["passed"],
                    "total": v["subjects"],
                    "percentage": round((v["passed"] / v["subjects"]) * 100)
                }
            }
            for sem, v in data.items()
        ]
