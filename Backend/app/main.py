from fastapi import FastAPI
from app.routers import employees, subjects  # otros routers

app = FastAPI()


app.include_router(employees.router, prefix="/employees", tags=["Employees"])
app.include_router(subjects.router, prefix="/subjects", tags=["Subjects"]) 