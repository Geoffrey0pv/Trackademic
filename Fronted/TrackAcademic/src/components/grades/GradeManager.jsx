import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { getGradesByUser, getSemesterConsolidate } from "../../services/gradesServices";

const GradeManager = () => {
  const { user } = useContext(UserContext);
  const [grades, setGrades] = useState([]);
  const [consolidated, setConsolidated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !user.id) return; // ⛔ evita llamadas si no hay user

    const fetchGrades = async () => {
      try {
        const userGrades = await getGradesByUser(user.id);
        setGrades(userGrades);
      } catch (error) {
        console.error("Error al cargar las notas:", error);
      }
    };

    const fetchConsolidated = async () => {
      try {
        const semester = "2025-1"; // o calcula/selecciona el semestre correcto
        const res = await getSemesterConsolidate(user.id, semester);
        setConsolidated(res);
      } catch (error) {
        console.error("Error al calcular consolidado:", error);
      }
    };

    fetchGrades();
    fetchConsolidated();
    setLoading(false);
  }, [user]);

  if (!user) return <p className="text-center p-4 text-gray-500">Cargando usuario...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Gestión de Notas</h1>
      {/* Aquí irían las tablas y controles */}
    </div>
  );
};

export default GradeManager;
