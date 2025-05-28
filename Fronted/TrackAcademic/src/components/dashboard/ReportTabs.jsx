import React from "react";

const REPORT_TABS = [
  { id: "projection", label: "📊 Proyección de Notas" },
  { id: "comparative", label: "📈 Análisis Comparativo" },
  { id: "progress", label: "🎯 Progreso por Semestre" },
];

/**
 * Componente de pestañas para los reportes
 * @param {Object} props
 * @param {string} props.activeReport - Reporte activo
 * @param {Function} props.onReportChange - Función para cambiar de reporte
 */
export default function ReportTabs({ activeReport, onReportChange }) {
  return (
    <div className="border-b border-gray-200 bg-white/50">
      <div className="flex space-x-8 px-6">
        {REPORT_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onReportChange(tab.id)}
            className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeReport === tab.id
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}