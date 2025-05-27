from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional, List
from bson.errors import InvalidId
from app.db.database import mongo_db
from app.models.models import EvaluationPlan, EvaluationPlanCreate
from app.services.evaluation_plan_service import EvaluationPlanService

router = APIRouter()

def get_plan_service():
    return EvaluationPlanService(mongo_db.get_collection("evaluationPlan"))

@router.post("/", response_model=EvaluationPlan, status_code=201)
async def create_evaluation_plan(
    plan: EvaluationPlanCreate,
    service: EvaluationPlanService = Depends(get_plan_service)
):
    total_weight = sum(a.grade_decimal for a in plan.artifacts)
    if round(total_weight, 2) != 1.0:
        raise HTTPException(
            status_code=400,
            detail=f"La suma de los pesos debe ser 1.0. Actualmente: {total_weight}"
        )
    return await service.create(plan)

@router.get("/", response_model=List[EvaluationPlan])
async def obtain_all_plans(service: EvaluationPlanService = Depends(get_plan_service)):
    try:
        plans = await service.get_all()
        return plans
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/search", response_model=List[EvaluationPlan])
async def search_plans(
    semester: Optional[str] = Query(None),
    subject_id: Optional[int] = Query(None),
    service: EvaluationPlanService = Depends(get_plan_service)
):
    return await service.search(semester, subject_id)


@router.get("/{plan_id}", response_model=EvaluationPlan)
async def obtain_plan(plan_id: str, service: EvaluationPlanService = Depends(get_plan_service)):
    try:
        plan = await service.get_by_id(plan_id)
        if not plan:
            raise HTTPException(status_code=404, detail="Plan not found")
        return plan
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid ID format")

@router.put("/{plan_id}", response_model=EvaluationPlan)
async def update_plan(plan_id: str, plan: EvaluationPlanCreate, service: EvaluationPlanService = Depends(get_plan_service)):
    updated = await service.update(plan_id, plan)
    if not updated:
        raise HTTPException(status_code=404, detail="Plan not found")
    return updated

@router.delete("/{plan_id}")
async def delete_plan(plan_id: str, service: EvaluationPlanService = Depends(get_plan_service)):
    deleted = await service.delete(plan_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Plan not found")
    return {"message": "Deleted successfully"}
