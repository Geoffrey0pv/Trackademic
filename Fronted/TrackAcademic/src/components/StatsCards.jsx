import React from "react";

/**
 * Componente de tarjeta de estadísticas
 * @param {Object} props
 * @param {string} props.title - Título de la estadística
 * @param {string|number} props.value - Valor principal
 * @param {React.ComponentType} props.icon - Icono a mostrar
 * @param {string} props.iconColor - Color del icono y valor
 * @param {string} props.subtitle - Texto adicional (opcional)
 * @param {React.ReactNode} props.children - Contenido adicional (opcional)
 */
export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  iconColor = "blue", 
  subtitle,
  children 
}) {
  const colorClasses = {
    blue: { text: "text-blue-600", bg: "bg-blue-100" },
    purple: { text: "text-purple-600", bg: "bg-purple-100" },
    orange: { text: "text-orange-600", bg: "bg-orange-100" },
    red: { text: "text-red-600", bg: "bg-red-100" },
    green: { text: "text-green-600", bg: "bg-green-100" },
  };

  const colors = colorClasses[iconColor] || colorClasses.blue;

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold ${colors.text}`}>{value}</p>
        </div>
        <div className={`p-3 ${colors.bg} rounded-full`}>
          <Icon className={`h-8 w-8 ${colors.text}`} />
        </div>
      </div>
      {subtitle && (
        <div className="mt-4 flex items-center">
          <span className="text-sm text-gray-600">{subtitle}</span>
        </div>
      )}
      {children && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </div>
  );
}