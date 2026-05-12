import { useTaskStore, type Task } from '../store';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = {
  todo: '#3b82f6',
  inprogress: '#f59e0b',
  done: '#10b981',
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#22c55e',
};

interface StatisticsModalProps {
  onClose: () => void;
}

export function StatisticsModal({ onClose }: StatisticsModalProps) {
  const { tasks } = useTaskStore();

  const columnStats = [
    { name: 'To Do', value: tasks.filter((t: Task) => t.columnId === 'todo').length, color: COLORS.todo },
    { name: 'In Progress', value: tasks.filter((t: Task) => t.columnId === 'inprogress').length, color: COLORS.inprogress },
    { name: 'Done', value: tasks.filter((t: Task) => t.columnId === 'done').length, color: COLORS.done },
  ].filter(s => s.value > 0);

  const priorityStats = [
    { name: 'Высокий', value: tasks.filter((t: Task) => t.priority === 'high').length, color: COLORS.high },
    { name: 'Средний', value: tasks.filter((t: Task) => t.priority === 'medium').length, color: COLORS.medium },
    { name: 'Низкий', value: tasks.filter((t: Task) => t.priority === 'low').length, color: COLORS.low },
  ].filter(s => s.value > 0);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t: Task) => t.columnId === 'done').length;
  const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-6xl max-h-[95vh] overflow-y-auto shadow-2xl">
        {/* Заголовок модалки */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            📊 Статистика
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Прогресс бар */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Общий прогресс</span>
            <span className="font-bold">{completionRate}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-3 text-center">
            ✅ {completedTasks} из {totalTasks} задач выполнено
          </div>
        </div>

        {/* Две диаграммы в ряд */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* По статусу */}
          {columnStats.length > 0 && (
            <div>
              <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-3 text-center">
                🎯 По статусу
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={columnStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    labelLine={{ stroke: '#9ca3af', strokeWidth: 1 }}
                  >
                    {columnStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: 'white' }}
                    formatter={(value) => [`${value} задач`, 'Количество']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* По приоритету */}
          {priorityStats.length > 0 && (
            <div>
              <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-3 text-center">
                ⚡ По приоритету
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={priorityStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    labelLine={{ stroke: '#9ca3af', strokeWidth: 1 }}
                  >
                    {priorityStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: 'white' }}
                    formatter={(value) => [`${value} задач`, 'Количество']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Детализация числами */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">📋 По колонкам</h3>
            <div className="flex justify-between items-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <span>📋 To Do</span>
              <span className="font-bold text-blue-600">{tasks.filter((t: Task) => t.columnId === 'todo').length}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <span>⚡ In Progress</span>
              <span className="font-bold text-yellow-600">{tasks.filter((t: Task) => t.columnId === 'inprogress').length}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span>✅ Done</span>
              <span className="font-bold text-green-600">{tasks.filter((t: Task) => t.columnId === 'done').length}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">⚡ По приоритету</h3>
            <div className="flex justify-between items-center p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <span>🔥 Высокий</span>
              <span className="font-bold text-red-600">{tasks.filter((t: Task) => t.priority === 'high').length}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <span>⚡ Средний</span>
              <span className="font-bold text-yellow-600">{tasks.filter((t: Task) => t.priority === 'medium').length}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span>🍃 Низкий</span>
              <span className="font-bold text-green-600">{tasks.filter((t: Task) => t.priority === 'low').length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}