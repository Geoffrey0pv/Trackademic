from fastapi import FastAPI
from app.db.database import init_db
from app.routers import employees # tus routers

app = FastAPI(title="University API")

# Crea tablas si no existen
@app.on_event("startup")
def on_startup():
    init_db()

app.include_router(employees.router, prefix="/employees", tags=["Employees"])