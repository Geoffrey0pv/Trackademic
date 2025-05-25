import { useState } from 'react';
import { PencilIcon, TrashIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import EvaluationPlanForm from './EvaluationPlanForm';
import EditEvaluationPlanForm from './EditEvaluationPlanForm';
import FilterBar from './FilterBar';

const initialPlans = [
  {
    id: 1,
    title: 'Plan de Evaluación - 2025-1',
    course: 'Bases de Datos',
    components: [
      { name: 'Evaluación 1', weight: 10, count: 1 },
      { name: 'Evaluación 2', weight: 20, count: 1 },
      { name: 'Evaluación 3', weight: 20, count: 1 },
      { name: 'Proyecto Entrega 1', weight: 10, count: 1 },
      { name: 'Quiz MER', weight: 10, count: 1 },
      { name: 'Proyecto Entrega 2', weight: 10, count: 1 },
      { name: 'Proyecto Entrega 3', weight: 10, count: 1 },
      { name: 'Quiz SQL', weight: 10, count: 1 },
    ],
    comments: [
      { user: 'Camila R.', text: 'Buen equilibrio.', date: '2025-05-01' },
    ],
  },
];

const EvaluationPlans = () => {
  const [plans, setPlans] = useState(initialPlans);
  const [search, setSearch] = useState('');
  const [course, setCourse] = useState('');
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(false);

  const filteredPlans = plans.filter(p =>
    (p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.course.toLowerCase().includes(search.toLowerCase())) &&
    (course === '' || p.course === course)
  );

  const handleAdd = (plan) => {
    setPlans([...plans, { ...plan, id: Date.now(), comments: [] }]);
    setShowForm(false);
  };

  const handleEdit = (plan) => {
    setSelected(plan);
    setEditing(true);
    setShowForm(true);
  };

  const handleUpdate = (updatedPlan) => {
    setPlans(plans.map(p => (p.id === selected.id ? { ...updatedPlan, id: selected.id, comments: selected.comments } : p)));
    setSelected(null);
    setEditing(false);
    setShowForm(false);
  };

  const handleDelete = (id) => {
    setPlans(plans.filter(p => p.id !== id));
  };

  const handleComment = (id, text) => {
    const updated = plans.map(p => {
      if (p.id === id) {
        return {
          ...p,
          comments: [...p.comments, { user: 'Estudiante', text, date: new Date().toISOString().split('T')[0] }]
        };
      }
      return p;
    });
    setPlans(updated);
  };

  const allCourses = [...new Set(plans.map(p => p.course))];

  return (
    <div className="bg-gray from-blue-50 via-white to-white min-h-screen pb-12">
      <div className="w-full px-8 pt-8">
        <div className="bg-white rounded-xl shadow-md p-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Planes de Evaluación</h2>
            <button
              onClick={() => { setShowForm(true); setSelected(null); setEditing(false); }}
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
            >
              + Nuevo Plan
            </button>
          </div>

          <FilterBar
            search={search}
            course={course}
            setSearch={setSearch}
            setCourse={setCourse}
            courses={allCourses}
          />

          <div className="mt-4 space-y-6">
            {filteredPlans.map(plan => (
              <div key={plan.id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{plan.title}</h3>
                    <p className="text-sm text-gray-600">{plan.course}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => handleEdit(plan)} className="text-purple-600 hover:text-purple-800">
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(plan.id)} className="text-red-600 hover:text-red-800">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-md p-4 mt-2">
                  <div className="grid grid-cols-3 gap-2 text-sm font-medium text-gray-500 mb-1">
                    <div>Componente</div>
                    <div>Peso</div>
                    <div>Cantidad</div>
                  </div>
                  {plan.components.map((c, i) => (
                    <div key={i} className="grid grid-cols-3 gap-2 text-sm py-1 border-t border-gray-200">
                      <div>{c.name}</div>
                      <div>{c.weight}%</div>
                      <div>{c.count}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 border-t pt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                    <ChatBubbleLeftRightIcon className="w-4 h-4 text-gray-600" /> Comentarios
                  </h4>
                  {plan.comments.map((comment, i) => (
                    <div key={i} className="text-sm text-gray-700 mb-1">
                      <strong>{comment.user}:</strong> {comment.text} <span className="text-xs text-gray-400">({comment.date})</span>
                    </div>
                  ))}
                  <textarea
                    rows={2}
                    placeholder="Escribe un comentario..."
                    className="w-full border border-gray-300 rounded mt-2 p-2"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (e.target.value.trim()) {
                          handleComment(plan.id, e.target.value);
                          e.target.value = '';
                        }
                      }
                    }}
                  />
                  <p className="text-xs text-gray-400 mt-1">Presiona Enter para comentar</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-3xl">
            {editing ? (
              <EditEvaluationPlanForm
                initialData={selected}
                onSubmit={handleUpdate}
                onCancel={() => { setShowForm(false); setSelected(null); setEditing(false); }}
              />
            ) : (
              <EvaluationPlanForm
                onSubmit={handleAdd}
                onCancel={() => { setShowForm(false); setSelected(null); }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EvaluationPlans;
