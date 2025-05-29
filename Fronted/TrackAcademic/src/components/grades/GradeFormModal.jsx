import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../context/UserContext";

const GradeFormModal = ({ isOpen, onClose, onSubmit, initialData = {} }) => {
  const { user } = useContext(UserContext);
  const [subjectName, setSubjectName] = useState('');
  const [artifactName, setArtifactName] = useState('');
  const [grade, setGrade] = useState('');

  useEffect(() => {
    setSubjectName(initialData?.subject_name || '');
    setArtifactName(initialData?.artifact_name || '');
    setGrade(
      initialData?.grade !== undefined
        ? (initialData.grade * 100).toFixed(0)
        : ''
    );
  }, [initialData]);

  const handleSubmit = () => {
    if (!user?.id) {
      console.error("El usuario no está definido.");
      return;
    }

    onSubmit({
      ...initialData,
      subject_name: subjectName,
      artifact_name: artifactName,
      grade: parseFloat(grade) / 100,
      student_id: user.id,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          ✕
        </button>
        <h2 className="text-lg font-semibold mb-4">
          {initialData?.id ? "Editar Nota" : "Agregar Nota"}
        </h2>

        <input
          type="text"
          placeholder="Asignatura"
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
          className="border p-2 w-full mb-3 rounded"
        />
        <input
          type="text"
          placeholder="Nombre de la actividad"
          value={artifactName}
          onChange={(e) => setArtifactName(e.target.value)}
          className="border p-2 w-full mb-3 rounded"
        />
        <input
          type="number"
          placeholder="Nota (%)"
          value={grade}
          onChange={(e) => {
            const val = e.target.value;
            if (!isNaN(val) && val >= 0 && val <= 100) {
              setGrade(val);
            }
          }}
          className="border p-2 w-full mb-3 rounded"
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="bg-purple-600 text-white px-4 py-2 rounded"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default GradeFormModal;
