import React from "react";
import { CheckCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { getGradesByUser } from "../../services/gradesServices";

/**
 * Componente del reporte de proyección de notas
 * @param {Object} props
 * @param {Array} props.projectionData - Datos de proyección
 * @param {Array} props.semesters - Lista de semestres
 * @param {number} props.selectedSemester - Semestre seleccionado
 * @param {Function} props.onSemesterChange - Función para cambiar semestre
 */
export default function ProjectionReport({ 
  projectionData, 
  semesters, 
  selectedSemester, 
  onSemesterChange 
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">Proyección de Notas Necesarias</h3>
        <select
          value={selectedSemester}
          onChange={(e) => onSemesterChange(Number(e.target.value))}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
          {semesters.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} {s.year}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4">
        {projectionData.map((subject) => (
          <SubjectProjectionCard key={subject.id} subject={subject} />
        ))}
      </div>
    </div>
  );
}

/**
 * Tarjeta individual de proyección de materia
 */
function SubjectProjectionCard({ subject }) {
  const getGradeColor = (neededGrade) => {
    if (neededGrade === "Imposible") return "text-red-600";
    const grade = parseFloat(neededGrade);
    if (grade <= 3.0) return "text-green-600";
    return "text-yellow-600";
  };

  return (
    <div
      className={`p-6 rounded-xl border-l-4 ${
        subject.status === "passing" 
          ? "bg-green-50 border-green-500" 
          : "bg-red-50 border-red-500"
      } hover:shadow-lg transition-all duration-200`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`w-3 h-3 rounded-full ${subject.color}`}></div>
          <div>
            <h4 className="text-lg font-semibold text-gray-900">{subject.name}</h4>
            <p className="text-sm text-gray-600">{subject.credits} créditos</p>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{subject.currentAverage}</p>
            <p className="text-xs text-gray-600">Promedio Actual</p>
          </div>
          <div className="text-center">
            <p className={`text-2xl font-bold ${getGradeColor(subject.neededGrade)}`}>
              {subject.neededGrade}
            </p>
            <p className="text-xs text-gray-600">Nota Necesaria</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{subject.pendingEvaluations}</p>
            <p className="text-xs text-gray-600">Pendientes</p>
          </div>
          <div className="flex items-center">
            {subject.status === "passing" ? (
              <CheckCircleIcon className="h-8 w-8 text-green-500" />
            ) : (
              <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}