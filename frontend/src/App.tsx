import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { AddTaskModal } from './components/AddTaskModal';
import { StatisticsModal } from './components/StatisticsModal'; // ДОБАВЛЕНО
import { useTaskStore, type Task } from './store';
import { TaskCard } from './components/TaskCard';
import { createPortal } from 'react-dom';

const COLUMNS = [
  { id: 'todo', title: '📋 To Do', color: 'from-blue-500 to-blue-600' },
  { id: 'inprogress', title: '⚡ In Progress', color: 'from-yellow-500 to-orange-500' },
  { id: 'done', title: '✅ Done', color: 'from-green-500 to-emerald-600' },
];

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [modalColumn, setModalColumn] = useState<string | null>(null);
  const [showStatistics, setShowStatistics] = useState(false); // ДОБАВЛЕНО
  const { tasks, moveTask } = useTaskStore();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const getTasksByColumn = (columnId: string): Task[] => {
    return tasks.filter((t) => t.columnId === columnId).sort((a, b) => a.order - b.order);
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    console.log('Drag end:', { source, destination, draggableId });

    if (!destination) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    moveTask(draggableId, destination.droppableId, destination.index);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 transition-colors">
          <div className="container mx-auto p-6 h-screen flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  📌 TaskFlow
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Управляй задачами с удовольствием</p>
              </div>
              
              {/* КНОПКИ В ХЕДЕРЕ — ТУТ ДОБАВЛЕНА НОВАЯ КНОПКА */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowStatistics(true)}
                  className="px-5 py-2.5 rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 dark:text-white font-medium flex items-center gap-2"
                >
                  📊 Статистика
                </button>
                <button
                  onClick={toggleTheme}
                  className="px-5 py-2.5 rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 dark:text-white font-medium"
                >
                  {theme === 'light' ? '🌙 Тёмная тема' : '☀️ Светлая тема'}
                </button>
              </div>
            </div>

            {/* Columns */}
            <div className="flex gap-6 flex-1 overflow-x-auto pb-6">
              {COLUMNS.map(col => (
                <Droppable key={col.id} droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 w-96 flex-shrink-0 h-full flex flex-col shadow-xl transition-all duration-200 ${
                        snapshot.isDraggingOver ? 'ring-2 ring-blue-500 scale-[1.02]' : ''
                      }`}
                    >
                      <div className={`bg-gradient-to-r ${col.color} rounded-xl p-3 mb-4 -mt-2 -mx-2 shadow-lg`}>
                        <div className="flex justify-between items-center">
                          <h3 className="font-bold text-white text-lg">{col.title}</h3>
                          <span className="bg-white/20 backdrop-blur px-2.5 py-1 rounded-full text-white text-sm font-semibold">
                            {getTasksByColumn(col.id).length}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => setModalColumn(col.id)}
                        className="mb-4 p-2.5 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-500 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-all duration-200 font-medium text-sm"
                      >
                        + Добавить задачу
                      </button>

                      <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scroll">
                        {getTasksByColumn(col.id).map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided, snapshot) => {
                              const child = (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    ...provided.draggableProps.style,
                                    marginBottom: '12px',
                                  }}
                                >
                                  <div className={`transition-all duration-150 ${snapshot.isDragging ? 'rotate-1 scale-105 shadow-2xl' : ''}`}>
                                    <TaskCard task={task} />
                                  </div>
                                </div>
                              );

                              if (snapshot.isDragging) {
                                return createPortal(child, document.body);
                              }

                              return child;
                            }}
                          </Draggable>
                        ))}
                        
                        {provided.placeholder}
                        {getTasksByColumn(col.id).length === 0 && (
                          <div className="text-center text-gray-400 dark:text-gray-500 py-8 text-sm">
                            Нет задач<br />
                            Нажмите "+" чтобы добавить
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </Droppable>
              ))}
            </div>

            {/* Modal для добавления задачи */}
            {modalColumn && (
              <AddTaskModal columnId={modalColumn} onClose={() => setModalColumn(null)} />
            )}
          </div>
        </div>
      </DragDropContext>

      {/* МОДАЛКА СТАТИСТИКИ — ДОБАВЛЕНО */}
      {showStatistics && (
        <StatisticsModal onClose={() => setShowStatistics(false)} />
      )}
    </>
  );
}

export default App;