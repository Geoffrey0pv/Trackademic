import React from "react";
import { CheckCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { getSemesterProgress, getCurrentAverage } from "../utils/gradeCalculation";

/**
 * Componente del reporte de progreso detallado
 * @param {Object} props
 * @param {Array} props.semesters - Lista de semestres
 * @param {Array} props.subjects - Lista de materias
 * @param {Array} props.grades - Lista de notas
 */
export default function ProgressReport({ semesters, subjects, grades }) {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900">Progreso Académico Detallado</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {semesters.map((semester) => (
          <SemesterProgressCard 
            key={semester.id} 
            semester={semester}
            subjects={subjects}
            grades={grades}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Tarjeta de progreso de semestre
 */
function SemesterProgressCard({ semester, subjects, grades }) {
  const progress = getSemesterProgress(semester.id, subjects, grades);
  const semesterSubjects = subjects.filter(s => s.semester === semester.id);

  const getStatusStyles = (status) => {
    switch (status) {
      case "current":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "current":
        return "En curso";
      case "completed":
        return "Completado";
      default:
        return "Próximo";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-bold text-gray-900">{semester.name} {semester.year}</h4>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyles(semester.status)}`}>
          {getStatusLabel(semester.status)}
        </span>
      </div>
      
      <div className="space-y-3">
        {semesterSubjects.map((subject) => (
          <SubjectProgressItem 
            key={subject.id} 
            subject={subject}
            grades={grades}
          />
        ))}
      </div>
      
      <SemesterProgressSummary progress={progress} />
    </div>
  );
}

/**
 * Item individual de progreso de materia
 */
function SubjectProgressItem({ subject, grades }) {
  const grade = grades.find(g => g.subjectId === subject.id);
  const avg = parseFloat(getCurrentAverage(grade.completed, grade.weight));
  const isPassing = avg >= grade.minPassing;

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-3">
        <div className={`w-2 h-2 rounded-full ${subject.color}`}></div>
        <span className="font-medium text-gray-900">{subject.name}</span>
      </div>
      <div className="flex items-center space-x-3">
        <span className={`font-bold ${isPassing ? "text-green-600" : "text-red-600"}`}>
          {avg.toFixed(1)}
        </span>
        {isPassing ? (
          <CheckCircleIcon className="h-5 w-5 text-green-500" />
        ) : (
          <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
        )}
      </div>
    </div>
  );
}

/**
 * Resumen de progreso del semestre
 */
function SemesterProgressSummary({ progress }) {
  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">Progreso general</span>
        <span className="font-bold text-gray-900">{progress.passed}/{progress.total} materias</span>
      </div>
      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress.percentage}%` }}
        ></div>
      </div>
    </div>
  );
}