import { useState } from 'react';
import {
  PencilIcon,
  TrashIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const EvaluationPlanItem = ({ plan, onEdit, onDelete, onComment, commentInput, setCommentInput }) => {
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
      {/* Título y acciones */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{plan.title}</h3>
          <p className="text-sm text-gray-600">{plan.course}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={() => onEdit(plan)} className="text-purple-600 hover:text-purple-800">
            <PencilIcon className="w-5 h-5" />
          </button>
          <button onClick={() => onDelete(plan.id)} className="text-red-600 hover:text-red-800">
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Componentes del plan */}
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

      {/* Sección de comentarios */}
      <div className="mt-4 border-t pt-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
          <ChatBubbleLeftRightIcon className="w-4 h-4 text-gray-600" /> Comentarios
        </h4>

        <button
          onClick={() => setShowComments(prev => !prev)}
         className="flex items-center text-xs text-indigo-600 hover:underline mb-2"
        >
          <ChatBubbleLeftRightIcon className="w-4 h-4 mr-1" />
          {showComments ? 'Ocultar comentarios' : `Ver comentarios (${plan.comments.length || 0})`}
        </button>

        {showComments && (
          <>
            {(plan.comments || []).map((comment, i) => (
              <div key={i} className="text-sm text-gray-700 mb-1">
                <strong>{comment.user}:</strong> {comment.text}
                <span className="text-xs text-gray-400"> ({comment.date})</span>
              </div>
            ))}
            <textarea
              rows={2}
              placeholder="Escribe un comentario..."
              className="w-full border border-gray-300 rounded mt-2 p-2"
              value={commentInput || ''}
              onChange={(e) => setCommentInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (commentInput.trim()) {
                    onComment(plan.id, commentInput.trim());
                  }
                }
              }}
            />
            <p className="text-xs text-gray-400 mt-1">Presiona Enter para comentar</p>
          </>
        )}
      </div>
    </div>
  );
};

export default EvaluationPlanItem;
