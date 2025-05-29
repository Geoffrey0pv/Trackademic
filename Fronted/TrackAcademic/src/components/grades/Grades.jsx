import { useEffect, useState } from "react";
import { getGradesByStudent } from "../../services/gradesServices";
import GradeRow from "./GradeRow";
import GradeFormModal from "./GradeFormModal";

const Grades = () => {
  const [grades, setGrades] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchGrades = async () => {
      const response = await getGradesByStudent();
      setGrades(response);
    };
    fetchGrades();
  }, []);

  const handleAdd = () => {
    setSelectedGrade(null);
    setShowModal(true);
  };

  const handleEdit = (grade) => {
    setSelectedGrade(grade);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    // lógica para borrar nota
  };

  const handleSave = (updatedGrade) => {
    // lógica para actualizar/guardar y actualizar estado
    setShowModal(false);
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Gestión de Notas</h2>
      <button
        onClick={handleAdd}
        className="mb-4 px-4 py-2 bg-purple-600 text-white rounded"
      >
        Agregar Nota
      </button>
      <table className="w-full text-left border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Asignatura</th>
            <th className="p-2">Actividad</th>
            <th className="p-2">Nota</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((grade) => (
            <GradeRow
              key={grade.id}
              grade={grade}
              onEdit={() => handleEdit(grade)}
              onDelete={() => handleDelete(grade.id)}
            />
          ))}
        </tbody>
      </table>

      {showModal && (
        <GradeFormModal
          initialData={selectedGrade}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Grades;
