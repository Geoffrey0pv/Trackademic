from fastapi import FastAPI
from app.routers import employees, subjects, groups, academic, evaluations_plan,grades,comments, students
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Trackademic API",
    version="1.0.0",
    description="API para gestionar planes, actividades, notas y reportes académicos"
)

origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],     
    allow_headers=["*"],
)

# Routers
app.include_router(academic.router, prefix="/academic", tags=["Academic"])
app.include_router(employees.router, prefix="/employees", tags=["Employees"])
app.include_router(subjects.router, prefix="/subjects", tags=["Subjects"])
app.include_router(groups.router, prefix="/groups", tags=["Groups"])
app.include_router(evaluations_plan.router, prefix="/evaluation-plans", tags=["Evaluation Plans"])
app.include_router(grades.router, prefix="/grades", tags=["Grades"])
app.include_router(comments.router, prefix="/comments", tags=["Comments"])
app.include_router(students.router, prefix="/students", tags=["Students"])