import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const EvaluationPlanItem = ({ plan, onEdit, onDelete }) => (
  <div className="border p-4 rounded shadow hover:shadow-md transition">
    <div className="flex justify-between">
      <div>
        <h3 className="text-lg font-semibold">{plan.title}</h3>
        <p className="text-sm text-gray-500">{plan.course}</p>
      </div>
      <div className="space-x-2 flex items-center">
        <button onClick={() => onEdit(plan)} className="text-blue-600"><PencilIcon className="w-5 h-5" /></button>
        <button onClick={() => onDelete(plan.id)} className="text-red-600"><TrashIcon className="w-5 h-5" /></button>
      </div>
    </div>
    <ul className="mt-2 text-sm text-gray-700">
      {plan.components.map((c, i) => (
        <li key={i}>• {c.name}: {c.weight}% x{c.count}</li>
      ))}
    </ul>
  </div>
);

export default EvaluationPlanItem;
