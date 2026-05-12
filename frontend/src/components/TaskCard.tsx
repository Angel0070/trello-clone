import { useState } from 'react';
import { useTaskStore, type Task } from '../store';

const priorityColors: Record<string, string> = {
  low: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300',
  high: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
};

const priorityLabels: Record<string, string> = { low: 'Низкий', medium: 'Средний', high: 'Высокий' };
const priorityIcons: Record<string, string> = { low: '🟢', medium: '🟡', high: '🔴' };

export function TaskCard({ task }: { task: Task }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDesc, setEditDesc] = useState(task.description);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { updateTask, deleteTask } = useTaskStore();

  const handleSave = () => {
    updateTask(task.id, { title: editTitle, description: editDesc });
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteTask(task.id);
    setShowDeleteConfirm(false);
  };

  const changePriority = () => {
    const priorities: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
    const currentIndex = priorities.indexOf(task.priority);
    const next = priorities[(currentIndex + 1) % priorities.length];
    updateTask(task.id, { priority: next });
  };

  if (isEditing) {
    return (
      <div className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-lg">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full mb-2 px-3 py-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
          autoFocus
        />
        <textarea
          value={editDesc}
          onChange={(e) => setEditDesc(e.target.value)}
          className="w-full mb-3 px-3 py-2 border rounded-lg text-sm dark:bg-gray-600 dark:border-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
          rows={2}
        />
        <div className="flex gap-2">
          <button onClick={handleSave} className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition">
            ✅ Сохранить
          </button>
          <button onClick={() => setIsEditing(false)} className="flex-1 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 px-3 py-1.5 rounded-lg text-sm font-medium transition">
            Отмена
          </button>
        </div>
      </div>
    );
  }

  if (showDeleteConfirm) {
    return (
      <div className="bg-red-50 dark:bg-red-900/30 rounded-xl p-4 border-2 border-red-300 dark:border-red-700">
        <p className="text-sm text-red-700 dark:text-red-300 mb-3 font-medium">Удалить задачу "{task.title}"?</p>
        <div className="flex gap-2">
          <button onClick={handleDelete} className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition">
            🗑️ Удалить
          </button>
          <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 px-3 py-1.5 rounded-lg text-sm font-medium transition">
            Отмена
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800 dark:text-white text-base">{task.title}</h4>
          {task.description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{task.description}</p>
          )}
        </div>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="ml-2 text-gray-400 hover:text-red-500 transition-colors p-1 text-lg"
        >
          🗑️
        </button>
      </div>
      
      <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
        <button
          onClick={changePriority}
          className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all ${priorityColors[task.priority]}`}
        >
          {priorityIcons[task.priority]} {priorityLabels[task.priority]}
        </button>
        <button
          onClick={() => setIsEditing(true)}
          className="text-xs text-gray-400 hover:text-blue-500 transition-colors px-2 py-1"
        >
          ✏️ Редактировать
        </button>
      </div>
    </div>
  );
}