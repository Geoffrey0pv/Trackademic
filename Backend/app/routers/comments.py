from fastapi import APIRouter, HTTPException, Query, Depends
from app.models.models import Comments, CommentsCreate
from db.database import mongo_db
from app.services.comments_service import CommentsService
from bson.errors import InvalidId

router = APIRouter()

# Inyectar el servicio
def get_comments_service():
    return CommentsService(mongo_db["comments"])

@router.post("/", response_model=Comments, status_code=201)
async def create_comment(
    comment: CommentsCreate,
    plan_id: str = Query(...),
    service: CommentsService = Depends(get_comments_service)
):
    try:
        return await service.create(comment, plan_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid evaluation_plan_id format")

@router.get("/", response_model=list[Comments])
async def get_comments(service: CommentsService = Depends(get_comments_service)):
    return await service.get_all()

@router.get("/{comment_id}", response_model=Comments)
async def get_comment(comment_id: str, service: CommentsService = Depends(get_comments_service)):
    comment = await service.get_by_id(comment_id)
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    return comment

@router.put("/{comment_id}", response_model=Comments)
async def update_comment(
    comment_id: str,
    comment: CommentsCreate,
    service: CommentsService = Depends(get_comments_service)
):
    updated = await service.update(comment_id, comment)
    if not updated:
        raise HTTPException(status_code=404, detail="Comment not found")
    return updated

@router.delete("/{comment_id}")
async def delete_comment(comment_id: str, service: CommentsService = Depends(get_comments_service)):
    deleted = await service.delete(comment_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Comment not found")
    return {"message": "Deleted successfully"}

@router.get("/by-plan/{plan_id}", response_model=list[Comments])
async def get_comments_by_plan(plan_id: str, service: CommentsService = Depends(get_comments_service)):
    try:
        return await service.get_by_plan(plan_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid evaluation_plan_id format")
