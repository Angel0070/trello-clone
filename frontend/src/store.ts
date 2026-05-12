import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  columnId: string;
  order: number;
  createdAt: Date;
}

interface TaskStore {
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  moveTask: (taskId: string, newColumnId: string, newOrder: number) => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: [
        { id: '1', title: 'Изучить React', description: 'Понять хуки и компоненты', priority: 'high', columnId: 'todo', order: 0, createdAt: new Date() },
        { id: '2', title: 'Сделать Trello-клон', description: 'Drag & Drop, Zustand, Tailwind', priority: 'high', columnId: 'todo', order: 1, createdAt: new Date() },
        { id: '3', title: 'Написать README', description: 'Оформить портфолио', priority: 'medium', columnId: 'todo', order: 2, createdAt: new Date() },
        { id: '4', title: 'Деплой на Vercel', description: 'Опубликовать проект', priority: 'low', columnId: 'inprogress', order: 0, createdAt: new Date() },
        { id: '5', title: 'Добавить тёмную тему', description: 'Уже есть в проекте', priority: 'medium', columnId: 'done', order: 0, createdAt: new Date() },
      ],
      
      addTask: (task) => set((state) => ({ 
        tasks: [...state.tasks, task] 
      })),
      
      updateTask: (taskId, updates) => set((state) => ({
        tasks: state.tasks.map((t) => t.id === taskId ? { ...t, ...updates } : t)
      })),
      
      deleteTask: (taskId) => set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== taskId)
      })),
      
      // МАКСИМАЛЬНО ПРОСТАЯ ЛОГИКА
      moveTask: (taskId, newColumnId, newOrder) => set((state) => {
        // Находим задачу
        const task = state.tasks.find(t => t.id === taskId);
        if (!task) return state;
        
        // Обновляем задачу
        const updatedTask = { ...task, columnId: newColumnId, order: newOrder };
        
        // Заменяем задачу в списке
        const newTasks = state.tasks.map(t => 
          t.id === taskId ? updatedTask : t
        );
        
        console.log('Перемещаем задачу:', taskId, 'в колонку:', newColumnId, 'на позицию:', newOrder);
        console.log('Новый список задач:', newTasks);
        
        return { tasks: newTasks };
      }),
    }),
    { name: 'trello-storage' }
  )
);