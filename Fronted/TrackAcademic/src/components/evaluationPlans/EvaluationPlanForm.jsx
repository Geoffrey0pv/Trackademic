import { useState, useEffect } from 'react';
import { XCircleIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { getAllSubjects } from '../../services/subjectServices.js';

const EvaluationPlanForm = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [components, setComponents] = useState([{ name: '', weight: '' }]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await getAllSubjects();
        setSubjects(res);
      } catch (error) {
        console.error('Error cargando materias:', error);
      }
    };

    fetchSubjects();
  }, []);

  const totalWeight = components.reduce(
    (acc, curr) => acc + parseFloat(curr.weight || 0),
    0
  );

  const handleChange = (index, field, value) => {
    const updated = [...components];
    updated[index][field] = value;
    setComponents(updated);
  };

  const addComponent = () => {
    if (totalWeight < 100) {
      setComponents([...components, { name: '', weight: '' }]);
    }
  };

  const removeComponent = (index) => {
    setComponents(components.filter((_, i) => i !== index));
  };

  const validate = () => {
    return totalWeight === 100 && subjectCode;
  };

  const handleSubmit = () => {
    if (!validate()) {
      setError('La suma de los pesos debe ser 100% y debe seleccionar una materia.');
      return;
    }
    setError('');
    onSubmit({
      title,
      subject_code: subjectCode,
      components
    });
  };

  return (
    <div className="p-6 bg-white shadow rounded">
      <h2 className="text-lg font-bold mb-4">Nuevo Plan de Evaluación</h2>

      <input
        className="border p-2 mb-2 w-full"
        placeholder="Título del plan"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <select
        className="border p-2 mb-4 w-full"
        value={subjectCode}
        onChange={(e) => setSubjectCode(e.target.value)}
      >
        <option value="">Seleccione una materia</option>
        {subjects.map((s) => (
          <option key={s.code} value={s.code}>
            {s.name}
          </option>
        ))}
      </select>

      {components.map((c, i) => (
        <div key={i} className="grid grid-cols-3 gap-2 mb-2">
          <input
            className="border p-2"
            placeholder="Nombre del componente"
            value={c.name}
            onChange={(e) => handleChange(i, 'name', e.target.value)}
          />
          <input
            type="number"
            className="border p-2"
            placeholder="%"
            value={c.weight}
            onChange={(e) => handleChange(i, 'weight', e.target.value)}
          />
          <button onClick={() => removeComponent(i)} className="text-red-600">
            <XCircleIcon className="w-5 h-5" />
          </button>
        </div>
      ))}

      <p className={`text-sm mb-2 ${totalWeight > 100 ? 'text-red-600' : 'text-gray-600'}`}>
        Suma actual de porcentajes: <strong>{totalWeight}%</strong>
      </p>

      {totalWeight < 100 && (
        <button
          onClick={addComponent}
          className="text-purple-600 flex items-center mb-4 hover:text-purple-700"
        >
          <PlusCircleIcon className="w-5 h-5 mr-1" />
          Agregar Componente
        </button>
      )}

      {error && <p className="text-red-600 mb-2">{error}</p>}

      <div className="flex justify-end space-x-2">
        <button onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded">
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Guardar
        </button>
      </div>
    </div>
  );
};

export default EvaluationPlanForm;
