from fastapi import FastAPI
from app.routers import employees, subjects, groups, academic

app = FastAPI(
    title="Trackademic API",
    version="1.0.0",
    description="API para gestionar planes, actividades, notas y reportes académicos"
)

# Routers
app.include_router(academic.router, prefix="/academic", tags=["Academic"])
app.include_router(employees.router, prefix="/employees", tags=["Employees"])
app.include_router(subjects.router, prefix="/subjects", tags=["Subjects"])
app.include_router(groups.router, prefix="/groups", tags=["Groups"])
