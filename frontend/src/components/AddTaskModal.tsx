import { useState } from 'react';
import { useTaskStore } from '../store';
import type { Task } from '../types';

interface AddTaskModalProps {
  columnId: string;
  onClose: () => void;
}

export function AddTaskModal({ columnId, onClose }: AddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const { addTask, tasks } = useTaskStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const maxOrder = Math.max(0, ...tasks.filter((t: Task) => t.columnId === columnId).map((t: Task) => t.order), -1);

    addTask({
      id: Date.now().toString(),
      title: title.trim(),
      description,
      priority,
      columnId,
      order: maxOrder + 1,
      createdAt: new Date(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-96 max-w-[90%]">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Новая задача</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Название"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mb-3 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            autoFocus
          />
          <textarea
            placeholder="Описание (необязательно)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mb-3 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            rows={3}
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as any)}
            className="w-full mb-4 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="low">Низкий приоритет</option>
            <option value="medium">Средний приоритет</option>
            <option value="high">Высокий приоритет</option>
          </select>
          <div className="flex gap-2">
            <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              Создать
            </button>
            <button type="button" onClick={onClose} className="flex-1 bg-gray-300 dark:bg-gray-600 py-2 rounded-lg">
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}