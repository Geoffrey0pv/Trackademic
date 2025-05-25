import React, { useState } from "react";
import { 
  ChartBarIcon, 
  AcademicCapIcon, 
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowUpIcon,
  CalendarIcon
} from "@heroicons/react/24/outline";

// Componentes
import StatsCard from "../components/StatsCards";
import ReportTabs from "../components/ReportTabs";
import ProjectionReport from "../components/ProjectionReport";
import ComparativeReport from "../components/ComparativeReport";
import ProgressReport from "../components/ProgressReport";

// Datos y utilidades
import { semesters, subjects, grades } from "../data/mockData";
import { 
  getOverallGPA, 
  getSemesterProgress, 
  getTotalPendingEvaluations,
  getProjectionData,
  getComparativeData,
  getAtRiskSubjectsCount
} from "../utils/gradeCalculation";

export default function Dashboard() {
  const [selectedSemester, setSelectedSemester] = useState(2);
  const [activeReport, setActiveReport] = useState("projection");

  // Datos calculados
  const projectionData = getProjectionData(selectedSemester, subjects, grades);
  const comparativeData = getComparativeData(semesters, subjects, grades);
  const currentSemesterProgress = getSemesterProgress(2, subjects, grades);
  const totalPendingEvaluations = getTotalPendingEvaluations(grades);
  const atRiskSubjects = getAtRiskSubjectsCount(projectionData);
  const overallGPA = getOverallGPA(subjects, grades);

  const renderActiveReport = () => {
    switch (activeReport) {
      case "projection":
        return (
          <ProjectionReport
            projectionData={projectionData}
            semesters={semesters}
            selectedSemester={selectedSemester}
            onSemesterChange={setSelectedSemester}
          />
        );
      case "comparative":
        return <ComparativeReport comparativeData={comparativeData} />;
      case "progress":
        return (
          <ProgressReport 
            semesters={semesters}
            subjects={subjects}
            grades={grades}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Dashboard Académico
          </h1>
          <p className="text-gray-600 text-lg">Monitorea tu progreso académico en tiempo real</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* GPA Card */}
          <StatsCard
            title="GPA General"
            value={overallGPA}
            icon={AcademicCapIcon}
            iconColor="blue"
          >
            <div className="flex items-center">
              <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+0.2 desde el último semestre</span>
            </div>
          </StatsCard>

          {/* Current Semester Progress */}
          <StatsCard
            title="Semestre Actual"
            value={`${currentSemesterProgress.percentage}%`}
            icon={ChartBarIcon}
            iconColor="purple"
          >
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${currentSemesterProgress.percentage}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {currentSemesterProgress.passed} de {currentSemesterProgress.total} materias aprobadas
            </p>
          </StatsCard>

          {/* Pending Evaluations */}
          <StatsCard
            title="Evaluaciones Pendientes"
            value={totalPendingEvaluations}
            icon={ClockIcon}
            iconColor="orange"
            subtitle={
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 text-gray-500 mr-1" />
                <span className="text-sm text-gray-600">Próximas 2 semanas</span>
              </div>
            }
          />

          {/* At Risk Subjects */}
          <StatsCard
            title="Materias en Riesgo"
            value={atRiskSubjects}
            icon={ExclamationTriangleIcon}
            iconColor="red"
            subtitle="Requieren atención inmediata"
          />
        </div>

        {/* Reports Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <ReportTabs 
            activeReport={activeReport}
            onReportChange={setActiveReport}
          />
          
          <div className="p-6">
            {renderActiveReport()}
          </div>
        </div>
      </div>
    </div>
  );
}