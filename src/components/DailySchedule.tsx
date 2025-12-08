import { useState, useEffect } from 'react'
import { Plus, Trash2, Check, Calendar, Clock } from 'lucide-react'
import { storage } from '../utils/storage'

interface TodoItem {
    id: string
    text: string
    completed: boolean
    time?: string
}

interface ScheduleItem {
    id: string
    text: string
    time: string
}

function DailySchedule() {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
    const [todos, setTodos] = useState<TodoItem[]>([])
    const [schedule, setSchedule] = useState<ScheduleItem[]>([])
    const [newTodo, setNewTodo] = useState('')
    const [newScheduleItem, setNewScheduleItem] = useState({ text: '', time: '' })

    useEffect(() => {
        const savedTodos = storage.get<TodoItem[]>(`todos_${selectedDate}`, [])
        const savedSchedule = storage.get<ScheduleItem[]>(`schedule_${selectedDate}`, [])
        setTodos(savedTodos)
        setSchedule(savedSchedule)
    }, [selectedDate])

    const saveTodos = (updatedTodos: TodoItem[]) => {
        setTodos(updatedTodos)
        storage.set(`todos_${selectedDate}`, updatedTodos)
    }

    const saveSchedule = (updatedSchedule: ScheduleItem[]) => {
        setSchedule(updatedSchedule)
        storage.set(`schedule_${selectedDate}`, updatedSchedule)
    }

    const addTodo = () => {
        if (newTodo.trim()) {
            const todo: TodoItem = {
                id: Date.now().toString(),
                text: newTodo.trim(),
                completed: false,
            }
            saveTodos([...todos, todo])
            setNewTodo('')
        }
    }

    const toggleTodo = (id: string) => {
        const updated = todos.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
        )
        saveTodos(updated)
    }

    const deleteTodo = (id: string) => {
        saveTodos(todos.filter((t) => t.id !== id))
    }

    const addScheduleItem = () => {
        if (newScheduleItem.text.trim() && newScheduleItem.time.trim()) {
            const item: ScheduleItem = {
                id: Date.now().toString(),
                text: newScheduleItem.text.trim(),
                time: newScheduleItem.time.trim(),
            }
            const updated = [...schedule, item].sort((a, b) => a.time.localeCompare(b.time))
            saveSchedule(updated)
            setNewScheduleItem({ text: '', time: '' })
        }
    }

    const deleteScheduleItem = (id: string) => {
        saveSchedule(schedule.filter((s) => s.id !== id))
    }

    const completedCount = todos.filter((t) => t.completed).length

    return (
        <div className="space-y-6">
            <div className="card">
                <h2 className="text-2xl sm:text-3xl font-bold text-tavern-800 dark:text-amber-200 mb-4 flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-copper-400 to-copper-500 dark:from-copper-600 dark:to-copper-700 rounded-full flex items-center justify-center shadow-tavern flex-shrink-0">
                        <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <span className="break-words">Daily Schedule & To-Do List</span>
                </h2>
                <p className="text-tavern-700 dark:text-tavern-300 mb-4 sm:mb-6 text-base sm:text-lg">
                    Plan your day and track your tasks. Stay organized and accomplish your goals! 📋
                </p>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-tavern-700 dark:text-tavern-300 mb-2">
                        Select Date
                    </label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="input-field"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="card">
                    <h3 className="text-xl sm:text-2xl font-semibold text-tavern-800 dark:text-amber-200 mb-3 sm:mb-4 flex items-center gap-2">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-forest-400 to-forest-500 dark:from-forest-600 dark:to-forest-700 rounded-full flex items-center justify-center flex-shrink-0">
                            <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <span className="break-words">To-Do List ({completedCount}/{todos.length})</span>
                    </h3>

                    <div className="mb-4">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newTodo}
                                onChange={(e) => setNewTodo(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                                placeholder="Add a new task..."
                                className="input-field flex-1"
                            />
                            <button onClick={addTodo} className="btn-game flex items-center gap-2">
                                <Plus className="w-5 h-5" />
                                Add
                            </button>
                        </div>
                    </div>

                    {todos.length === 0 ? (
                        <p className="text-tavern-600 dark:text-tavern-400 italic text-lg">No tasks yet. Add one to get started! 🎯</p>
                    ) : (
                        <div className="space-y-2">
                            {todos.map((todo) => (
                                <div
                                    key={todo.id}
                                    className="flex items-center gap-3 p-3 bg-parchment-100 dark:bg-tavern-700 rounded-cozy group border-2 border-tavern-200 dark:border-tavern-600 hover:border-tavern-300 dark:hover:border-tavern-500 transition-all"
                                >
                                    <button
                                        onClick={() => toggleTodo(todo.id)}
                                        className={`flex-shrink-0 w-7 h-7 rounded-cozy border-2 flex items-center justify-center transition-all shadow-md hover:shadow-tavern ${todo.completed
                                            ? 'bg-forest-500 dark:bg-forest-600 border-forest-500 dark:border-forest-600 text-white'
                                            : 'border-tavern-300 dark:border-tavern-600 hover:border-forest-400 dark:hover:border-forest-500 bg-white dark:bg-tavern-800'
                                            }`}
                                    >
                                        {todo.completed && <Check className="w-4 h-4" />}
                                    </button>
                                    <span
                                        className={`flex-1 text-base sm:text-lg break-words ${todo.completed ? 'line-through text-tavern-600 dark:text-tavern-400' : 'text-tavern-800 dark:text-tavern-200'
                                            }`}
                                    >
                                        {todo.text}
                                    </span>
                                    <button
                                        onClick={() => deleteTodo(todo.id)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="card">
                    <h3 className="text-xl sm:text-2xl font-semibold text-tavern-800 dark:text-amber-200 mb-3 sm:mb-4 flex items-center gap-2">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-copper-400 to-copper-500 dark:from-copper-600 dark:to-copper-700 rounded-full flex items-center justify-center flex-shrink-0">
                            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        Daily Schedule
                    </h3>

                    <div className="mb-4 space-y-2">
                        <input
                            type="text"
                            value={newScheduleItem.text}
                            onChange={(e) =>
                                setNewScheduleItem({ ...newScheduleItem, text: e.target.value })
                            }
                            placeholder="Activity name"
                            className="input-field"
                        />
                        <div className="flex gap-2">
                            <input
                                type="time"
                                value={newScheduleItem.time}
                                onChange={(e) =>
                                    setNewScheduleItem({ ...newScheduleItem, time: e.target.value })
                                }
                                className="input-field flex-1"
                            />
                            <button onClick={addScheduleItem} className="btn-game flex items-center gap-2">
                                <Plus className="w-5 h-5" />
                                Add
                            </button>
                        </div>
                    </div>

                    {schedule.length === 0 ? (
                        <p className="text-tavern-600 dark:text-tavern-400 italic text-lg">No schedule items yet. Plan your day! ⏰</p>
                    ) : (
                        <div className="space-y-2">
                            {schedule.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-3 p-3 bg-copper-100 dark:bg-copper-900 rounded-cozy group border-2 border-copper-300 dark:border-copper-700 hover:border-copper-400 dark:hover:border-copper-600 transition-all"
                                >
                                    <div className="flex-shrink-0 w-16 sm:w-20 text-xs sm:text-sm font-medium text-tavern-800 dark:text-tavern-200 bg-parchment-50 dark:bg-tavern-800 px-2 py-1 rounded-cozy border border-tavern-300 dark:border-tavern-600">
                                        {item.time}
                                    </div>
                                    <div className="flex-1 text-tavern-800 dark:text-tavern-200 text-base sm:text-lg break-words">{item.text}</div>
                                    <button
                                        onClick={() => deleteScheduleItem(item.id)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default DailySchedule

