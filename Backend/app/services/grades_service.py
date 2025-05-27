# app/services/grades_service.py

from typing import List, Optional
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorCollection
from datetime import datetime
from app.models.models import Grades, GradesCreate
from app.utils.mongo_helpers import to_object_id
from app.db.database import mongo_db  # para access a evaluationPlan

class GradesService:
    def __init__(self, collection: AsyncIOMotorCollection):
        self.collection = collection
        self.plans = mongo_db["evaluationPlan"]  # relación manual

    async def create(self, grade: GradesCreate) -> Grades:
        doc = grade.model_dump(by_alias=True)
        doc["created_at"] = datetime.utcnow()
        result = await self.collection.insert_one(doc)
        return self.serialize(await self.get_by_id(result.inserted_id), "_id", "user_id")

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

        derivables = doc["derivables"]
        min_passing = doc["min_passing"]

        completed = [d["grade_value"] for d in derivables]
        weights = [d["grade_decimal"] for d in derivables]
        completed_sum = sum(g * w for g, w in zip(completed, weights))
        remaining_weights = 1.0 - sum(weights)

        if remaining_weights <= 0:
            return {"needed": "Completado"}

        needed = (min_passing - completed_sum) / remaining_weights
        return {"needed": "Imposible" if needed > 5 else round(max(0, needed), 1)}

    async def get_semester_consolidate(self, user_id: str, semester: str):
        cursor = self.collection.find({"user_id": to_object_id(user_id)})
        total = 0
        subjects = []

        async for doc in cursor:
            plan = await self.plans.find_one({
                "subject_id": doc["subject_id"],
                "semester": semester
            })
            if plan:
                derivables = doc["derivables"]
                weights = [d["grade_decimal"] for d in derivables]
                grades = [d["grade_value"] for d in derivables]
                used_weights = sum(weights)
                avg = sum(g * w for g, w in zip(grades, weights)) / used_weights if used_weights > 0 else 0
                subjects.append({"subject_id": doc["subject_id"], "average": round(avg, 1)})
                total += avg

        return {
            "subjects": subjects,
            "average": round(total / len(subjects), 2) if subjects else 0.0
        }

    async def comparative_analysis(self, user_id: str):
        cursor = self.collection.find({"user_id": to_object_id(user_id)})
        data_by_semester = {}

        async for doc in cursor:
            semester = doc.get("semester")
            min_passing = doc.get("min_passing", 3.0)
            derivables = doc.get("derivables", [])

            if not semester:
                continue

            grades = [d["grade_value"] for d in derivables]
            weights = [d["grade_decimal"] for d in derivables]

            if not grades or not weights:
                continue

            weighted_sum = sum(g * w for g, w in zip(grades, weights))
            total_weight = sum(weights)
            average = weighted_sum / total_weight if total_weight > 0 else 0.0
            passed = average >= min_passing

            if semester not in data_by_semester:
                data_by_semester[semester] = {
                    "semester": semester,
                    "total_avg": 0.0,
                    "subjects": 0,
                    "passed": 0
                }

            data_by_semester[semester]["total_avg"] += average
            data_by_semester[semester]["subjects"] += 1
            if passed:
                data_by_semester[semester]["passed"] += 1

        return [
            {
                "semester": sem,
                "average": round(data["total_avg"] / data["subjects"], 2),
                "subjects": data["subjects"],
                "progress": {
                    "passed": data["passed"],
                    "total": data["subjects"],
                    "percentage": round((data["passed"] / data["subjects"]) * 100)
                }
            }
            for sem, data in data_by_semester.items()
        ]

    def serialize(self, doc, *fields):
        for field in fields:
            if field in doc:
                if field.startswith("_"):
                    doc[field[1:]] = str(doc[field])
                else:
                    doc[field] = str(doc[field])
        return doc