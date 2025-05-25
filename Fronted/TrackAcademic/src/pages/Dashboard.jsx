import React, { useState } from "react";
import { 
  ChartBarIcon, 
  AcademicCapIcon, 
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowUpIcon,
  CalendarIcon
} from "@heroicons/react/24/outline";

// Mock data mejorado
const semesters = [
  { id: 1, name: "Semestre 1", year: "2024", status: "completed" },
  { id: 2, name: "Semestre 2", year: "2024", status: "current" },
  { id: 3, name: "Semestre 3", year: "2025", status: "upcoming" },
];

const subjects = [
  { id: 1, name: "Matemáticas Avanzadas", semester: 1, credits: 4, color: "bg-blue-500" },
  { id: 2, name: "Física Cuántica", semester: 1, credits: 3, color: "bg-green-500" },
  { id: 3, name: "Química Orgánica", semester: 2, credits: 4, color: "bg-purple-500" },
  { id: 4, name: "Historia Contemporánea", semester: 2, credits: 2, color: "bg-orange-500" },
  { id: 5, name: "Programación Web", semester: 2, credits: 3, color: "bg-indigo-500" },
];

const grades = [
  { subjectId: 1, completed: [4.2, 3.8, 4.5], pending: 1, minPassing: 3.0, weight: [0.2, 0.3, 0.3, 0.2] },
  { subjectId: 2, completed: [2.8, 3.2, 3.5], pending: 1, minPassing: 3.0, weight: [0.25, 0.25, 0.25, 0.25] },
  { subjectId: 3, completed: [4.5, 4.0], pending: 2, minPassing: 3.0, weight: [0.3, 0.3, 0.2, 0.2] },
  { subjectId: 4, completed: [3.0, 3.7, 2.9], pending: 1, minPassing: 3.0, weight: [0.2, 0.3, 0.3, 0.2] },
  { subjectId: 5, completed: [4.8], pending: 3, minPassing: 3.0, weight: [0.25, 0.25, 0.25, 0.25] },
];

// Helper functions mejoradas
function calculateNeededGrade(completed, pending, minPassing, weights) {
  const completedSum = completed.reduce((sum, grade, index) => sum + (grade * weights[index]), 0);
  const remainingWeights = weights.slice(completed.length).reduce((sum, weight) => sum + weight, 0);
  const needed = (minPassing - completedSum) / remainingWeights;
  return needed > 5 ? "Imposible" : Math.max(0, needed).toFixed(1);
}

function getCurrentAverage(completed, weights) {
  if (completed.length === 0) return 0;
  const sum = completed.reduce((sum, grade, index) => sum + (grade * weights[index]), 0);
  const usedWeights = weights.slice(0, completed.length).reduce((sum, weight) => sum + weight, 0);
  return (sum / usedWeights).toFixed(1);
}

function getSemesterProgress(semesterId) {
  const subj = subjects.filter((s) => s.semester === semesterId);
  const total = subj.length;
  const passed = subj.filter((s) => {
    const g = grades.find((gr) => gr.subjectId === s.id);
    const avg = parseFloat(getCurrentAverage(g.completed, g.weight));
    return avg >= g.minPassing;
  }).length;
  return { passed, total, percentage: Math.round((passed / total) * 100) };
}

function getOverallGPA() {
  let totalCredits = 0;
  let weightedSum = 0;
  
  subjects.forEach(subject => {
    const grade = grades.find(g => g.subjectId === subject.id);
    if (grade && grade.completed.length > 0) {
      const avg = parseFloat(getCurrentAverage(grade.completed, grade.weight));
      weightedSum += avg * subject.credits;
      totalCredits += subject.credits;
    }
  });
  
  return totalCredits > 0 ? (weightedSum / totalCredits).toFixed(2) : "0.00";
}

export default function Dashboard() {
  const [selectedSemester, setSelectedSemester] = useState(2);
  const [activeReport, setActiveReport] = useState("projection");

  // Datos para proyección
  const projectionData = subjects
    .filter((s) => s.semester === selectedSemester)
    .map((s) => {
      const g = grades.find((gr) => gr.subjectId === s.id);
      const currentAvg = getCurrentAverage(g.completed, g.weight);
      const needed = calculateNeededGrade(g.completed, g.pending, g.minPassing, g.weight);
      return {
        ...s,
        currentAverage: currentAvg,
        neededGrade: needed,
        pendingEvaluations: g.pending,
        status: parseFloat(currentAvg) >= g.minPassing ? "passing" : "at-risk"
      };
    });

  // Datos comparativos
  const comparativeData = semesters.map(sem => {
    const semSubjects = subjects.filter(s => s.semester === sem.id);
    const averages = semSubjects.map(s => {
      const g = grades.find(gr => gr.subjectId === s.id);
      return parseFloat(getCurrentAverage(g.completed, g.weight));
    });
    const semesterAvg = averages.length > 0 ? averages.reduce((a, b) => a + b, 0) / averages.length : 0;
    return {
      ...sem,
      average: semesterAvg.toFixed(1),
      subjects: semSubjects.length,
      progress: getSemesterProgress(sem.id)
    };
  });

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
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">GPA General</p>
                <p className="text-3xl font-bold text-blue-600">{getOverallGPA()}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <AcademicCapIcon className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+0.2 desde el último semestre</span>
            </div>
          </div>

          {/* Current Semester Progress */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Semestre Actual</p>
                <p className="text-3xl font-bold text-purple-600">{getSemesterProgress(2).percentage}%</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <ChartBarIcon className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${getSemesterProgress(2).percentage}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {getSemesterProgress(2).passed} de {getSemesterProgress(2).total} materias aprobadas
              </p>
            </div>
          </div>

          {/* Pending Evaluations */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Evaluaciones Pendientes</p>
                <p className="text-3xl font-bold text-orange-600">
                  {grades.reduce((sum, g) => sum + g.pending, 0)}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <ClockIcon className="h-8 w-8 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <CalendarIcon className="h-4 w-4 text-gray-500 mr-1" />
              <span className="text-sm text-gray-600">Próximas 2 semanas</span>
            </div>
          </div>

          {/* At Risk Subjects */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Materias en Riesgo</p>
                <p className="text-3xl font-bold text-red-600">
                  {projectionData.filter(s => s.status === "at-risk").length}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-gray-600">Requieren atención inmediata</span>
            </div>
          </div>
        </div>

        {/* Reports Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          {/* Report Tabs */}
          <div className="border-b border-gray-200 bg-white/50">
            <div className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveReport("projection")}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeReport === "projection"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                📊 Proyección de Notas
              </button>
              <button
                onClick={() => setActiveReport("comparative")}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeReport === "comparative"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                📈 Análisis Comparativo
              </button>
              <button
                onClick={() => setActiveReport("progress")}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeReport === "progress"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                🎯 Progreso por Semestre
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Informe 1: Proyección de Notas */}
            {activeReport === "projection" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">Proyección de Notas Necesarias</h3>
                  <select
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(Number(e.target.value))}
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
                    <div
                      key={subject.id}
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
                            <p className={`text-2xl font-bold ${
                              subject.neededGrade === "Imposible" 
                                ? "text-red-600" 
                                : parseFloat(subject.neededGrade) <= 3.0 
                                  ? "text-green-600" 
                                  : "text-yellow-600"
                            }`}>
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
                  ))}
                </div>
              </div>
            )}

            {/* Informe 2: Análisis Comparativo */}
            {activeReport === "comparative" && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">Análisis Comparativo por Semestre</h3>
                
                <div className="grid gap-6">
                  {comparativeData.map((semester) => (
                    <div
                      key={semester.id}
                      className={`p-6 rounded-xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                        semester.status === "current"
                          ? "border-blue-500 bg-blue-50"
                          : semester.status === "completed"
                          ? "border-green-500 bg-green-50"
                          : "border-gray-300 bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xl font-bold text-gray-900">{semester.name} {semester.year}</h4>
                          <p className="text-sm text-gray-600 capitalize">{semester.status === "current" ? "En curso" : semester.status === "completed" ? "Completado" : "Próximo"}</p>
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
                            className={`h-3 rounded-full transition-all duration-500 ${
                              semester.status === "current"
                                ? "bg-gradient-to-r from-blue-500 to-blue-600"
                                : semester.status === "completed"
                                ? "bg-gradient-to-r from-green-500 to-green-600"
                                : "bg-gradient-to-r from-gray-400 to-gray-500"
                            }`}
                            style={{ width: `${semester.progress.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Informe 3: Progreso Detallado */}
            {activeReport === "progress" && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">Progreso Académico Detallado</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {semesters.map((semester) => {
                    const progress = getSemesterProgress(semester.id);
                    const semesterSubjects = subjects.filter(s => s.semester === semester.id);
                    
                    return (
                      <div key={semester.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-bold text-gray-900">{semester.name} {semester.year}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            semester.status === "current"
                              ? "bg-blue-100 text-blue-800"
                              : semester.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {semester.status === "current" ? "En curso" : semester.status === "completed" ? "Completado" : "Próximo"}
                          </span>
                        </div>
                        
                        <div className="space-y-3">
                          {semesterSubjects.map((subject) => {
                            const grade = grades.find(g => g.subjectId === subject.id);
                            const avg = parseFloat(getCurrentAverage(grade.completed, grade.weight));
                            const isPassing = avg >= grade.minPassing;
                            
                            return (
                              <div key={subject.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
                          })}
                        </div>
                        
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
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}