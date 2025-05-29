import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';

const GradeRow = ({ grade, onEdit, onDelete }) => {
  return (
    <tr className="border-b hover:bg-gray-100">
      <td className="p-2">{grade.subject_name}</td>
      <td className="p-2">{grade.artifact_name}</td>
      <td className="p-2">{(grade.grade * 100).toFixed(1)}%</td>
      <td className="p-2 flex justify-center gap-2">
        <button onClick={() => onEdit(grade)} className="text-yellow-500 hover:text-yellow-600">
          <PencilIcon className="w-5 h-5" />
        </button>
        <button onClick={() => onDelete(grade.id)} className="text-red-500 hover:text-red-600">
          <TrashIcon className="w-5 h-5" />
        </button>
      </td>
    </tr>
  );
};

export default GradeRow;
