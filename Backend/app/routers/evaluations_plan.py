from fastapi import APIRouter, HTTPException
from db.database import mongo_db
from bson import ObjectId
from app.models.models import EvaluationPlan, EvaluationPlanCreate

router = APIRouter()
plans_collection = mongo_db["evaluationPlan"]

@router.get("/", response_model=list[EvaluationPlan])
async def obtain_evaluation_plans():
    plans_cursor = plans_collection.find()
    plans = []
    async for plan in plans_cursor:
        plans.append(serialize_mongo_document(plan))
    return plans

@router.get("/{plan_id}", response_model=EvaluationPlan)
async def obtain_evaluation_plan(plan_id: str):
    plan = await plans_collection.find_one({"_id": ObjectId(plan_id)})
    if not plan:
        raise HTTPException(status_code=404, detail="Evaluation plan not found")
    return serialize_mongo_document(plan)


@router.post("/", response_model=EvaluationPlan)
async def create_evaluation_plan(plan: EvaluationPlanCreate):
    result = await plans_collection.insert_one(plan.model_dump())
    if not result.inserted_id:
        raise HTTPException(status_code=500, detail="Failed to create evaluation plan")
    else:
        created_plan = await plans_collection.find_one({"_id": result.inserted_id})
        return serialize_mongo_document(created_plan)

@router.put("/{plan_id}", response_model=EvaluationPlan)
async def update_evaluation_plan(plan_id: str, plan: EvaluationPlanCreate):
    try:
        result = await plans_collection.update_one(
            {"_id": ObjectId(plan_id)},
            {"$set": plan.model_dump()}
        )
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Evaluation Plan not found")
        updated = await plans_collection.find_one({"_id": ObjectId(plan_id)})
        return serialize_mongo_document(updated)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating evaluation plan: {str(e)}")

@router.delete("/{plan_id}")
async def delete_evaluation_plan(plan_id: str):
    result = await plans_collection.delete_one({"_id": ObjectId(plan_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Evaluation Plan not found")
    return {"message": "Deleted successfully"}

def serialize_mongo_document(doc):
    if "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc