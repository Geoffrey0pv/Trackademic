import { useState } from 'react';
import { XCircleIcon, PlusCircleIcon } from '@heroicons/react/24/outline';

const EvaluationPlanForm = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [course, setCourse] = useState('');
  const [components, setComponents] = useState([{ name: '', weight: '', count: '' }]);
  const [error, setError] = useState('');

  const handleChange = (index, field, value) => {
    const updated = [...components];
    updated[index][field] = value;
    setComponents(updated);
  };

  const addComponent = () => setComponents([...components, { name: '', weight: '', count: '' }]);

  const removeComponent = (index) => setComponents(components.filter((_, i) => i !== index));

  const validate = () => components.reduce((acc, curr) => acc + parseFloat(curr.weight || 0), 0) === 100;

  const handleSubmit = () => {
    if (!validate()) {
      setError('La suma de los pesos debe ser 100%.');
      return;
    }
    setError('');
    onSubmit({ title, course, components });
  };

  return (
    <div className="p-6 bg-white shadow rounded">
      <h2 className="text-lg font-bold mb-4">Nuevo Plan de Evaluación</h2>
      <input className="border p-2 mb-2 w-full" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input className="border p-2 mb-4 w-full" placeholder="Curso" value={course} onChange={(e) => setCourse(e.target.value)} />

      {components.map((c, i) => (
        <div key={i} className="grid grid-cols-4 gap-2 mb-2">
          <input className="border p-2" placeholder="Nombre" value={c.name} onChange={(e) => handleChange(i, 'name', e.target.value)} />
          <input type="number" className="border p-2" placeholder="%" value={c.weight} onChange={(e) => handleChange(i, 'weight', e.target.value)} />
          <input type="number" className="border p-2" placeholder="Cantidad" value={c.count} onChange={(e) => handleChange(i, 'count', e.target.value)} />
          <button onClick={() => removeComponent(i)} className="text-red-600"><XCircleIcon className="w-5 h-5" /></button>
        </div>
      ))}
      <button
        onClick={addComponent}
        className="text-purple-600 flex items-center mb-4 hover:text-purple-700"
      >
        <PlusCircleIcon className="w-5 h-5 mr-1" />
        Agregar Componente
      </button>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <div className="flex justify-end space-x-2">
        <button onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded">Cancelar</button>
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
