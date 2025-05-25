// components/ComparativeAnalysis.jsx
import React from "react";
import { getComparativeData } from "../utils/academicUtils";

const ComparativeAnalysis = ({ semesters, subjects, grades }) => {
  const comparativeData = getComparativeData(semesters, subjects, grades);

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900">
        Análisis Comparativo por Semestre
      </h3>
      
      <div className="grid gap-6">
        {comparativeData.map((semester) => (
          <SemesterComparison key={semester.id} semester={semester} />
        ))}
      </div>
    </div>
  );
};

const SemesterComparison = ({ semester }) => {
  const getStatusConfig = (status) => {
    const configs = {
      current: {
        borderColor: "border-blue-500",
        bgColor: "bg-blue-50",
        gradientFrom: "from-blue-500",
        gradientTo: "to-blue-600",
        label: "En curso"
      },
      completed: {
        borderColor: "border-green-500",
        bgColor: "bg-green-50",
        gradientFrom: "from-green-500",
        gradientTo: "to-green-600",
        label: "Completado"
      },
      upcoming: {
        borderColor: "border-gray-300",
        bgColor: "bg-gray-50",
        gradientFrom: "from-gray-400",
        gradientTo: "to-gray-500",
        label: "Próximo"
      }
    };
    return configs[status] || configs.upcoming;
  };

  const statusConfig = getStatusConfig(semester.status);

  return (
    <div
      className={`p-6 rounded-xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${statusConfig.borderColor} ${statusConfig.bgColor}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xl font-bold text-gray-900">
            {semester.name} {semester.year}
          </h4>
          <p className="text-sm text-gray-600">{statusConfig.label}</p>
        </div>
        
        <div className="flex items-center space-x-8">
          <MetricCard
            value={semester.average}
            label="Promedio"
            color="text-blue-600"
          />
          <MetricCard
            value={semester.subjects}
            label="Materias"
            color="text-purple-600"
          />
          <MetricCard
            value={`${semester.progress.percentage}%`}
            label="Progreso"
            color="text-green-600"
          />
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 bg-gradient-to-r ${statusConfig.gradientFrom} ${statusConfig.gradientTo}`}
            style={{ width: `${semester.progress.percentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ value, label, color }) => (
  <div className="text-center">
    <p className={`text-3xl font-bold ${color}`}>{value}</p>
    <p className="text-sm text-gray-600">{label}</p>
  </div>
);

export default ComparativeAnalysis;