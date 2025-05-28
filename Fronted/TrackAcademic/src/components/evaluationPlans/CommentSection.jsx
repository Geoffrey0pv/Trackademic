import { useState } from 'react';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

const CommentSection = ({ comments = [], onAdd }) => {
  const [text, setText] = useState('');

  return (
    <div className="mt-4">
      <h4 className="text-sm font-semibold mb-2 flex items-center">
        <ChatBubbleLeftRightIcon className="w-4 h-4 mr-1" /> Comentarios
      </h4>
      <ul className="space-y-2 mb-3">
        {comments.map((c, i) => (
          <li key={i} className="text-sm bg-gray-100 p-2 rounded">
            <strong>{c.user}:</strong> {c.text} <span className="text-xs text-gray-400">({c.date})</span>
          </li>
        ))}
      </ul>
      <textarea
        className="w-full border rounded p-2 mb-2"
        rows={3}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Escribe un comentario..."
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (text.trim()) {
              onAdd(text);
              setText('');
            }
          }
        }}
      />

      <button
        onClick={() => {
          if (text.trim()) {
            onAdd(text);
            setText('');
          }
        }}
        className="bg-indigo-600 text-white px-4 py-1 rounded"
      >
        Comentar
      </button>
    </div>
  );
};

export default CommentSection;
