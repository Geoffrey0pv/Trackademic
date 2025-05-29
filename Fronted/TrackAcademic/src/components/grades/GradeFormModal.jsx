import React, { useEffect, useState } from "react";
import { getEvaluationPlans } from "../../services/evaluationPlanServices";
import { createGrade } from "../../services/gradesServices";
import { MdOutlineChecklist } from "react-icons/md";
import StatsCard from "../dashboard/StatsCards";

const GradeManager = () => {
  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [grades, setGrades] = useState({});
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchPlans = async () => {
      const data = await getEvaluationPlans();
      setPlans(data);
    };
    fetchPlans();
  }, []);

  const handleGradeChange = (artifactName, value) => {
    setGrades((prev) => ({
      ...prev,
      [artifactName]: Number(value),
    }));
  };

  const handleSubmit = async () => {
    const selectedPlan = plans.find((p) => p.id === selectedPlanId);
    if (!selectedPlan) return;
  
    const derivables = selectedPlan.artifacts.map((a) => ({
      name: a.name,
      grade_decimal: a.grade_decimal,
      grade_value: grades[a.name] || 0,
    }));
  
    const newGrade = {
      user_id: user?.id,
      subject_id: selectedPlan.subject_code,
      semester: selectedPlan.semester || "2023-2",
      group_id: 2, // ⚠️ ajustar si tu lógica lo requiere
      derivables,
      min_passing: 3.0 ,// 👈 necesario según el modelo
      evaluation_plan_id: selectedPlan.id // 👈 este campo es requerido
    };
  
    setLoading(true);
    try {
     console.log("Payload:", newGrade);
      await createGrade(newGrade);
      alert("Notas registradas con éxito!");
      setGrades({});
    } catch (err) {
      console.error("Error al guardar notas:", err);
      alert("Error al guardar notas");
    }
    setLoading(false);
  };
  

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Asignar Notas por Plan</h1>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Selecciona un Plan de Evaluación</label>
        <select
          className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedPlanId}
          onChange={(e) => setSelectedPlanId(e.target.value)}
        >
          <option value="">-- Selecciona un plan --</option>
          {plans.map((plan) => (
            <option key={plan.id} value={plan.id}>
              {plan.name} ({plan.semester})
            </option>
          ))}
        </select>
      </div>

      {selectedPlanId && (
        <div className="grid gap-6 md:grid-cols-2">
          {plans
            .find((p) => p.id === selectedPlanId)
            ?.artifacts.map((artifact) => (
              <StatsCard
                key={artifact.name}
                title={artifact.name}
                value={
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={grades[artifact.name] || ""}
                    onChange={(e) => handleGradeChange(artifact.name, e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                  />
                }
                icon={MdOutlineChecklist}
                iconColor="purple"
                subtitle={`Peso: ${(artifact.grade_decimal * 100).toFixed(0)}%`}
              />
            ))}
        </div>
      )}

      {selectedPlanId && (
        <div className="pt-4">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition duration-300 disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Guardar Notas"}
          </button>
        </div>
      )}
    </div>
  );
};

export default GradeManager;
