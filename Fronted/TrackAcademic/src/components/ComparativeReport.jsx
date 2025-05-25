import React from "react";

/**
 * Componente del reporte comparativo por semestre
 * @param {Object} props
 * @param {Array} props.comparativeData - Datos comparativos por semestre
 */
export default function ComparativeReport({ comparativeData }) {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900">Análisis Comparativo por Semestre</h3>
      
      <div className="grid gap-6">
        {comparativeData.map((semester) => (
          <SemesterComparisonCard key={semester.id} semester={semester} />
        ))}
      </div>
    </div>
  );
}

/**
 * Tarjeta de comparación de semestre
 */
function SemesterComparisonCard({ semester }) {
  const getStatusStyles = (status) => {
    switch (status) {
      case "current":
        return {
          border: "border-blue-500 bg-blue-50",
          gradient: "bg-gradient-to-r from-blue-500 to-blue-600"
        };
      case "completed":
        return {
          border: "border-green-500 bg-green-50",
          gradient: "bg-gradient-to-r from-green-500 to-green-600"
        };
      default:
        return {
          border: "border-gray-300 bg-gray-50",
          gradient: "bg-gradient-to-r from-gray-400 to-gray-500"
        };
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

  const styles = getStatusStyles(semester.status);

  return (
    <div
      className={`p-6 rounded-xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${styles.border}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xl font-bold text-gray-900">{semester.name} {semester.year}</h4>
          <p className="text-sm text-gray-600">{getStatusLabel(semester.status)}</p>
        </div>
        <div className="flex items-center space-x-8">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{semester.average}</p>
            <p className="text-sm text-gray-600">Promedio</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">{semester.subjects}</p>
            <p className="text-sm text-gray-600">Materias</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{semester.progress.percentage}%</p>
            <p className="text-sm text-gray-600">Progreso</p>
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${styles.gradient}`}
            style={{ width: `${semester.progress.percentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}