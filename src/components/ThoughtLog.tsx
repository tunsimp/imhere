import { useState, useEffect } from 'react'
import { Plus, Trash2, BookOpen, Calendar, Edit2, Check, X } from 'lucide-react'
import { storage } from '../utils/storage'
import { useLanguage } from '../hooks/useLanguage'

interface ThoughtEntry {
    id: string
    thought: string
    emotion: string
    intensity: number
    evidence: string
    date: string
    time: string
}

function ThoughtLog() {
    const { t, language } = useLanguage()
    const [entries, setEntries] = useState<ThoughtEntry[]>([])
    const [newEntry, setNewEntry] = useState({
        thought: '',
        emotion: '',
        intensity: 5,
        evidence: '',
    })
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
    const [editingEvidence, setEditingEvidence] = useState<string | null>(null)
    const [editingEvidenceValue, setEditingEvidenceValue] = useState('')

    useEffect(() => {
        const saved = storage.get<ThoughtEntry[]>('thought_log', [])
        setEntries(saved)
    }, [])

    const saveEntries = (updatedEntries: ThoughtEntry[]) => {
        setEntries(updatedEntries)
        storage.set('thought_log', updatedEntries)
    }

    const addEntry = () => {
        if (newEntry.thought.trim() && newEntry.emotion.trim()) {
            const entry: ThoughtEntry = {
                id: Date.now().toString(),
                thought: newEntry.thought.trim(),
                emotion: newEntry.emotion.trim(),
                intensity: newEntry.intensity,
                evidence: newEntry.evidence.trim(),
                date: selectedDate,
                time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            }
            const updated = [...entries, entry].sort(
                (a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time)
            )
            saveEntries(updated)
            setNewEntry({ thought: '', emotion: '', intensity: 5, evidence: '' })
        }
    }

    const deleteEntry = (id: string) => {
        const updated = entries.filter((e) => e.id !== id)
        saveEntries(updated)
    }

    const startEditingEvidence = (entry: ThoughtEntry) => {
        setEditingEvidence(entry.id)
        setEditingEvidenceValue(entry.evidence)
    }

    const saveEvidence = (id: string) => {
        const updated = entries.map((e) =>
            e.id === id ? { ...e, evidence: editingEvidenceValue.trim() } : e
        )
        saveEntries(updated)
        setEditingEvidence(null)
        setEditingEvidenceValue('')
    }

    const cancelEditingEvidence = () => {
        setEditingEvidence(null)
        setEditingEvidenceValue('')
    }

    const dateEntries = entries.filter((e) => e.date === selectedDate)
    const allEntries = entries

    const getIntensityColor = (intensity: number) => {
        if (intensity <= 3) return 'bg-green-500'
        if (intensity <= 6) return 'bg-yellow-500'
        return 'bg-red-500'
    }

    return (
        <div className="space-y-6">
            <div className="card">
                <h2 className="text-2xl sm:text-3xl font-bold text-tavern-800 dark:text-amber-200 mb-4 flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-wine-500 to-wine-600 dark:from-wine-700 dark:to-wine-800 rounded-full flex items-center justify-center shadow-tavern flex-shrink-0">
                        <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    {t.components.thoughts.title}
                </h2>
                <p className="text-tavern-700 dark:text-tavern-300 mb-4 sm:mb-6 text-base sm:text-lg">
                    {t.components.thoughts.description}
                </p>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-tavern-700 dark:text-tavern-300 mb-2">
                            {t.components.thoughts.dateLabel}
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
                            {t.components.thoughts.thoughtLabel}
                        </label>
                        <textarea
                            value={newEntry.thought}
                            onChange={(e) => setNewEntry({ ...newEntry, thought: e.target.value })}
                            placeholder="I'm thinking that..."
                            className="textarea-field h-24"
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-tavern-700 dark:text-tavern-300 mb-2">
                            {t.components.thoughts.emotionLabel}
                        </label>
                        <input
                            type="text"
                            value={newEntry.emotion}
                            onChange={(e) => setNewEntry({ ...newEntry, emotion: e.target.value })}
                            placeholder="e.g., anxious, sad, angry, worried..."
                            className="input-field"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-tavern-700 dark:text-tavern-300 mb-2">
                            {t.components.thoughts.intensityLabel}: {newEntry.intensity}
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={newEntry.intensity}
                            onChange={(e) =>
                                setNewEntry({ ...newEntry, intensity: parseInt(e.target.value) })
                            }
                            className="w-full accent-amber-500"
                        />
                        <div className="flex justify-between text-xs text-tavern-600 dark:text-tavern-400 mt-1">
                            <span>Mild</span>
                            <span>Moderate</span>
                            <span>Severe</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-tavern-700 dark:text-tavern-300 mb-2">
                            {t.components.thoughts.evidenceLabel}
                        </label>
                        <textarea
                            value={newEntry.evidence}
                            onChange={(e) => setNewEntry({ ...newEntry, evidence: e.target.value })}
                            placeholder="Consider: What evidence contradicts this thought? Are there alternative explanations? What would you tell a friend in this situation?"
                            className="textarea-field h-24"
                            rows={3}
                        />
                        <p className="text-xs text-tavern-600 dark:text-tavern-400 mt-1">
                            This helps challenge negative thoughts and develop more balanced thinking.
                        </p>
                    </div>

                    <button onClick={addEntry} className="btn-game flex items-center gap-2 w-full">
                        <Plus className="w-5 h-5" />
                        {t.components.thoughts.addButton}
                    </button>
                </div>
            </div>

            <div className="card">
                <h3 className="text-xl sm:text-2xl font-semibold text-tavern-800 dark:text-amber-200 mb-3 sm:mb-4 flex items-center gap-2">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span className="break-words text-sm sm:text-base md:text-lg">
                        {t.components.thoughts.entriesFor} {new Date(selectedDate).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })} ({dateEntries.length})
                    </span>
                </h3>
                {dateEntries.length === 0 ? (
                    <p className="text-tavern-600 dark:text-tavern-400 italic text-base sm:text-lg">{t.components.thoughts.noEntries}</p>
                ) : (
                    <div className="space-y-3 sm:space-y-4">
                        {dateEntries.map((entry) => (
                            <div
                                key={entry.id}
                                className="bg-wine-100 dark:bg-wine-900 border-l-4 border-wine-500 dark:border-wine-700 p-3 sm:p-4 rounded-cozy group border-2 border-wine-300 dark:border-wine-800 hover:border-wine-400 dark:hover:border-wine-700 transition-all"
                            >
                                <div className="flex items-start justify-between mb-2 gap-2">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-tavern-800 dark:text-tavern-200 font-medium mb-1 text-base sm:text-lg break-words">{entry.thought}</p>
                                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-tavern-700 dark:text-tavern-300 mb-3">
                                            <span className="font-medium">Emotion: {entry.emotion}</span>
                                            <span className="flex items-center gap-2">
                                                Intensity:
                                                <span
                                                    className={`px-2 py-1 rounded text-white text-xs font-medium ${getIntensityColor(
                                                        entry.intensity
                                                    )}`}
                                                >
                                                    {entry.intensity}/10
                                                </span>
                                            </span>
                                            <span>{entry.time}</span>
                                        </div>
                                        {editingEvidence === entry.id ? (
                                            <div className="mt-3 space-y-2">
                                                <label className="block text-sm font-medium text-tavern-700 dark:text-tavern-300">
                                                    Evidence that this thought might not be true:
                                                </label>
                                                <textarea
                                                    value={editingEvidenceValue}
                                                    onChange={(e) => setEditingEvidenceValue(e.target.value)}
                                                    className="textarea-field h-20"
                                                    rows={3}
                                                />
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => saveEvidence(entry.id)}
                                                        className="btn-primary flex items-center gap-2 text-sm"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={cancelEditingEvidence}
                                                        className="btn-secondary flex items-center gap-2 text-sm"
                                                    >
                                                        <X className="w-4 h-4" />
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="mt-3">
                                                <div className="flex items-start justify-between mb-1">
                                                    <label className="text-sm font-medium text-tavern-700">
                                                        Evidence that this thought might not be true:
                                                    </label>
                                                    <button
                                                        onClick={() => startEditingEvidence(entry)}
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-600 hover:text-amber-700 ml-2"
                                                        title="Edit evidence"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                {entry.evidence ? (
                                                    <p className="text-sm text-tavern-700 dark:text-tavern-300 bg-amber-50 dark:bg-amber-900 p-3 rounded-cozy border border-amber-200 dark:border-amber-800">
                                                        {entry.evidence}
                                                    </p>
                                                ) : (
                                                    <p className="text-sm text-tavern-600 italic bg-parchment-100 p-3 rounded-cozy">
                                                        No evidence recorded yet. Click edit to add.
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => deleteEntry(entry.id)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 ml-4"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {allEntries.length > dateEntries.length && (
                <div className="card">
                    <h3 className="text-xl font-semibold text-tavern-800 dark:text-amber-200 mb-4">{t.components.thoughts.allEntries}</h3>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {allEntries.map((entry) => (
                            <div
                                key={entry.id}
                                className="bg-parchment-100 dark:bg-tavern-700 border-l-4 border-tavern-400 dark:border-tavern-600 p-4 rounded-cozy group"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                        <p className="text-tavern-800 dark:text-tavern-200 font-medium mb-1">{entry.thought}</p>
                                        <div className="flex items-center gap-4 text-sm text-tavern-600 dark:text-tavern-400 mb-3">
                                            <span className="font-medium">Emotion: {entry.emotion}</span>
                                            <span className="flex items-center gap-2">
                                                Intensity:
                                                <span
                                                    className={`px-2 py-1 rounded text-white text-xs font-medium ${getIntensityColor(
                                                        entry.intensity
                                                    )}`}
                                                >
                                                    {entry.intensity}/10
                                                </span>
                                            </span>
                                            <span>
                                                {new Date(entry.date).toLocaleDateString()} at {entry.time}
                                            </span>
                                        </div>
                                        {editingEvidence === entry.id ? (
                                            <div className="mt-3 space-y-2">
                                                <label className="block text-sm font-medium text-tavern-700 dark:text-tavern-300">
                                                    Evidence that this thought might not be true:
                                                </label>
                                                <textarea
                                                    value={editingEvidenceValue}
                                                    onChange={(e) => setEditingEvidenceValue(e.target.value)}
                                                    className="textarea-field h-20"
                                                    rows={3}
                                                />
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => saveEvidence(entry.id)}
                                                        className="btn-primary flex items-center gap-2 text-sm"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={cancelEditingEvidence}
                                                        className="btn-secondary flex items-center gap-2 text-sm"
                                                    >
                                                        <X className="w-4 h-4" />
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="mt-3">
                                                <div className="flex items-start justify-between mb-1">
                                                    <label className="text-sm font-medium text-tavern-700">
                                                        Evidence that this thought might not be true:
                                                    </label>
                                                    <button
                                                        onClick={() => startEditingEvidence(entry)}
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-600 hover:text-amber-700 ml-2"
                                                        title="Edit evidence"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                {entry.evidence ? (
                                                    <p className="text-sm text-tavern-700 dark:text-tavern-300 bg-amber-50 dark:bg-amber-900 p-3 rounded-cozy border border-amber-200 dark:border-amber-800">
                                                        {entry.evidence}
                                                    </p>
                                                ) : (
                                                    <p className="text-sm text-tavern-600 italic bg-parchment-100 p-3 rounded-cozy">
                                                        No evidence recorded yet. Click edit to add.
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => deleteEntry(entry.id)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 ml-4"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ThoughtLog

