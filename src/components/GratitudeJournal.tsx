import { useState, useEffect } from 'react'
import { Plus, Trash2, Sparkles } from 'lucide-react'
import { storage } from '../utils/storage'
import { useLanguage } from '../hooks/useLanguage'

interface GratitudeEntry {
    id: string
    text: string
    date: string
}

function GratitudeJournal() {
    const { t } = useLanguage()
    const [entries, setEntries] = useState<GratitudeEntry[]>([])
    const [newEntry, setNewEntry] = useState('')
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

    useEffect(() => {
        const saved = storage.get<GratitudeEntry[]>('gratitude_entries', [])
        setEntries(saved)
    }, [])

    const saveEntries = (updatedEntries: GratitudeEntry[]) => {
        setEntries(updatedEntries)
        storage.set('gratitude_entries', updatedEntries)
    }

    const addEntry = () => {
        if (newEntry.trim()) {
            const entry: GratitudeEntry = {
                id: Date.now().toString(),
                text: newEntry.trim(),
                date: selectedDate,
            }
            const updated = [...entries, entry]
            saveEntries(updated)
            setNewEntry('')
        }
    }

    const deleteEntry = (id: string) => {
        const updated = entries.filter((e) => e.id !== id)
        saveEntries(updated)
    }

    const todayEntries = entries.filter((e) => e.date === selectedDate)
    const allEntries = entries.sort((a, b) => b.date.localeCompare(a.date))

    return (
        <div className="space-y-6">
            <div className="card">
                <h2 className="text-2xl sm:text-3xl font-bold text-tavern-800 dark:text-amber-200 mb-4 flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-400 to-amber-500 dark:from-amber-600 dark:to-amber-700 rounded-full flex items-center justify-center shadow-tavern flex-shrink-0">
                        <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    {t.components.gratitude.title}
                </h2>
                <p className="text-tavern-700 dark:text-tavern-300 mb-4 sm:mb-6 text-base sm:text-lg">
                    {t.components.gratitude.description}
                </p>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-tavern-700 dark:text-tavern-300 mb-2">
                            {t.components.gratitude.dateLabel}
                        </label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="input-field"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-tavern-700 dark:text-tavern-300 mb-2">
                            {t.components.gratitude.entryLabel}
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newEntry}
                                onChange={(e) => setNewEntry(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addEntry()}
                                placeholder="I'm grateful for..."
                                className="input-field flex-1"
                            />
                            <button onClick={addEntry} className="btn-game flex items-center gap-2">
                                <Plus className="w-5 h-5" />
                                {t.components.gratitude.addButton}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <h3 className="text-xl sm:text-2xl font-semibold text-tavern-800 dark:text-amber-200 mb-3 sm:mb-4">
                    {t.components.gratitude.todayGratitudes} ({todayEntries.length})
                </h3>
                {todayEntries.length === 0 ? (
                    <p className="text-tavern-600 dark:text-tavern-400 italic text-base sm:text-lg">{t.components.gratitude.noEntries}</p>
                ) : (
                    <div className="space-y-2 sm:space-y-3">
                        {todayEntries.map((entry) => (
                            <div
                                key={entry.id}
                                className="bg-gradient-to-r from-amber-100 to-amber-50 dark:from-amber-900 dark:to-amber-800 p-3 sm:p-4 rounded-cozy flex items-start justify-between group border-2 border-amber-300 dark:border-amber-700 hover:border-amber-400 dark:hover:border-amber-600 transition-all shadow-md hover:shadow-tavern"
                            >
                                <p className="text-tavern-800 dark:text-amber-100 flex-1 text-base sm:text-lg pr-2">{entry.text}</p>
                                <button
                                    onClick={() => deleteEntry(entry.id)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 ml-4 p-1 hover:bg-red-50 rounded-cozy"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {allEntries.length > todayEntries.length && (
                <div className="card">
                    <h3 className="text-xl sm:text-2xl font-semibold text-tavern-800 dark:text-amber-200 mb-3 sm:mb-4">{t.components.gratitude.allEntries}</h3>
                    <div className="space-y-2 sm:space-y-3 max-h-96 overflow-y-auto">
                        {allEntries.map((entry) => (
                            <div
                                key={entry.id}
                                className="bg-parchment-100 dark:bg-tavern-700 p-3 sm:p-4 rounded-cozy flex items-start justify-between group border-2 border-tavern-200 dark:border-tavern-600 hover:border-tavern-300 dark:hover:border-tavern-500 transition-all"
                            >
                                <div className="flex-1 min-w-0">
                                    <p className="text-tavern-800 dark:text-tavern-200 text-base sm:text-lg break-words">{entry.text}</p>
                                    <p className="text-xs sm:text-sm text-tavern-600 dark:text-tavern-400 mt-1">
                                        {new Date(entry.date).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                </div>
                                <button
                                    onClick={() => deleteEntry(entry.id)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 ml-4 p-1 hover:bg-red-50 rounded-cozy"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default GratitudeJournal

