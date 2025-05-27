from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional, List
from bson.errors import InvalidId
from app.db.database import mongo_db
from app.models.models import EvaluationPlan, EvaluationPlanCreate
from app.services.evaluation_plan_service import EvaluationPlanService


router = APIRouter()
def get_plan_service():
    return (mongo_db.get_collection("student"))

@router.post("/login")
async def login_student(
    username: str,
    password: str,
    service: EvaluationPlanService = Depends(get_plan_service)
):
    try:
        # Simula la búsqueda del usuario en la base de datos (reemplaza esto con tu lógica real)
        user = await service.get_user_by_username(username)

        if user is None:
            return {"error": "Usuario no encontrado"}

        # Verifica la contraseña hasheada
        if not verify_password(password, user["hashed_password"]):
            return {"error": "Contraseña incorrecta"}

        # Simula creación de sesión o retorno de éxito
        return {"message": "Inicio de sesión exitoso", "user_id": str(user["_id"])}

    except Exception as e:
        return {"error": str(e)}



