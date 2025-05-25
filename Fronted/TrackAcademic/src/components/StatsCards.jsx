// components/StatsCards.jsx
import React from "react";
import {
  AcademicCapIcon,
  ChartBarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowUpIcon,
  CalendarIcon
} from "@heroicons/react/24/outline";

import { 
  getOverallGPA, 
  getSemesterProgress, 
  getDashboardStats 
} from "../utils/academicUtils";

const StatsCards = ({ subjects, grades, semesters }) => {
  const overallGPA = getOverallGPA(subjects, grades);
  const currentSemesterProgress = getSemesterProgress(2, subjects, grades);
  const dashboardStats = getDashboardStats(subjects, grades);

  const statsData = [
    {
      title: "GPA General",
      value: overallGPA,
      icon: AcademicCapIcon,
      color: "blue",
      trend: "+0.2 desde el último semestre",
      trendIcon: ArrowUpIcon,
      trendColor: "green"
    },
    {
      title: "Semestre Actual",
      value: `${currentSemesterProgress.percentage}%`,
      icon: ChartBarIcon,
      color: "purple",
      subtitle: `${currentSemesterProgress.passed} de ${currentSemesterProgress.total} materias aprobadas`,
      showProgress: true,
      progressValue: currentSemesterProgress.percentage
    },
    {
      title: "Evaluaciones Pendientes",
      value: dashboardStats.totalPendingEvaluations,
      icon: ClockIcon,
      color: "orange",
      subtitle: "Próximas 2 semanas",
      subtitleIcon: CalendarIcon
    },
    {
      title: "Materias en Riesgo",
      value: dashboardStats.atRiskSubjects,
      icon: ExclamationTriangleIcon,
      color: "red",
      subtitle: "Requieren atención inmediata"
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        text: "text-blue-600",
        bg: "bg-blue-100",
        gradient: "from-blue-500 to-blue-600"
      },
      purple: {
        text: "text-purple-600",
        bg: "bg-purple-100",
        gradient: "from-purple-500 to-purple-600"
      },
      orange: {
        text: "text-orange-600",
        bg: "bg-orange-100",
        gradient: "from-orange-500 to-orange-600"
      },
      red: {
        text: "text-red-600",
        bg: "bg-red-100",
        gradient: "from-red-500 to-red-600"
      },
      green: {
        text: "text-green-600",
        bg: "bg-green-100"
      }
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => {
        const colorClasses = getColorClasses(stat.color);
        const Icon = stat.icon;
        const TrendIcon = stat.trendIcon;
        const SubtitleIcon = stat.subtitleIcon;

        return (
          <div
            key={index}
            className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className={`text-3xl font-bold ${colorClasses.text}`}>
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 ${colorClasses.bg} rounded-full`}>
                <Icon className={`h-8 w-8 ${colorClasses.text}`} />
              </div>
            </div>

            <div className="mt-4">
              {stat.showProgress && (
                <div className="mb-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`bg-gradient-to-r ${colorClasses.gradient} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${stat.progressValue}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {stat.trend && TrendIcon && (
                <div className="flex items-center">
                  <TrendIcon className={`h-4 w-4 ${getColorClasses(stat.trendColor).text} mr-1`} />
                  <span className={`text-sm ${getColorClasses(stat.trendColor).text}`}>
                    {stat.trend}
                  </span>
                </div>
              )}

              {stat.subtitle && (
                <div className="flex items-center">
                  {SubtitleIcon && (
                    <SubtitleIcon className="h-4 w-4 text-gray-500 mr-1" />
                  )}
                  <span className="text-sm text-gray-600">{stat.subtitle}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;