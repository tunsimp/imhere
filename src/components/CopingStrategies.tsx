import { useState } from 'react'
import { Heart, Lightbulb, Wind, Music, Book, Activity } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'

interface CopingStrategy {
    id: string
    title: string
    description: string
    category: string
    icon: any
}

function CopingStrategies() {
    const { t } = useLanguage()
    const [selectedCategory, setSelectedCategory] = useState<string>('all')

    const strategies: CopingStrategy[] = [
        {
            id: '1',
            title: 'Deep Breathing',
            description:
                'Take slow, deep breaths. Inhale for 4 counts, hold for 4 counts, exhale for 4 counts. Repeat 5-10 times.',
            category: 'breathing',
            icon: Wind,
        },
        {
            id: '2',
            title: '5-4-3-2-1 Grounding',
            description:
                'Name 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.',
            category: 'grounding',
            icon: Lightbulb,
        },
        {
            id: '3',
            title: 'Progressive Muscle Relaxation',
            description:
                'Tense and then relax each muscle group, starting from your toes and working up to your head.',
            category: 'physical',
            icon: Activity,
        },
        {
            id: '4',
            title: 'Listen to Music',
            description:
                'Put on calming or uplifting music. Music can help regulate emotions and provide comfort.',
            category: 'sensory',
            icon: Music,
        },
        {
            id: '5',
            title: 'Read Something Uplifting',
            description:
                'Read a favorite book, poem, or inspirational quote. Reading can be a form of escape and comfort.',
            category: 'mental',
            icon: Book,
        },
        {
            id: '6',
            title: 'Self-Compassion Break',
            description:
                'Acknowledge your pain, remember that suffering is part of being human, and offer yourself kindness.',
            category: 'emotional',
            icon: Heart,
        },
        {
            id: '7',
            title: 'Box Breathing',
            description:
                'Breathe in for 4 counts, hold for 4 counts, breathe out for 4 counts, hold for 4 counts. Visualize drawing a box.',
            category: 'breathing',
            icon: Wind,
        },
        {
            id: '8',
            title: 'Take a Walk',
            description:
                'Even a short 5-10 minute walk can help clear your mind and release endorphins.',
            category: 'physical',
            icon: Activity,
        },
        {
            id: '9',
            title: 'Write It Down',
            description:
                'Journal your feelings. Sometimes writing things down helps process and release emotions.',
            category: 'mental',
            icon: Book,
        },
        {
            id: '10',
            title: 'Practice Gratitude',
            description:
                'Think of or write down three things you are grateful for, no matter how small.',
            category: 'emotional',
            icon: Heart,
        },
    ]

    const categories = [
        { id: 'all', label: t.components.coping.allCategories },
        { id: 'breathing', label: 'Breathing' },
        { id: 'grounding', label: 'Grounding' },
        { id: 'physical', label: 'Physical' },
        { id: 'mental', label: 'Mental' },
        { id: 'emotional', label: 'Emotional' },
        { id: 'sensory', label: 'Sensory' },
    ]

    const filteredStrategies =
        selectedCategory === 'all'
            ? strategies
            : strategies.filter((s) => s.category === selectedCategory)

    return (
        <div className="space-y-6">
            <div className="card">
                <h2 className="text-2xl sm:text-3xl font-bold text-tavern-800 dark:text-amber-200 mb-4 flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-wine-400 to-wine-500 dark:from-wine-600 dark:to-wine-700 rounded-full flex items-center justify-center shadow-tavern flex-shrink-0">
                        <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <span className="break-words">{t.components.coping.title}</span>
                </h2>
                <p className="text-tavern-700 dark:text-tavern-300 mb-4 sm:mb-6 text-base sm:text-lg">
                    {t.components.coping.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-cozy font-medium transition-all shadow-md hover:shadow-tavern text-sm sm:text-base ${selectedCategory === cat.id
                                ? 'bg-amber-500 dark:bg-amber-600 text-white transform scale-105'
                                : 'bg-tavern-200 dark:bg-tavern-700 text-tavern-700 dark:text-tavern-300 hover:bg-tavern-300 dark:hover:bg-tavern-600'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredStrategies.map((strategy) => {
                    const Icon = strategy.icon
                    return (
                        <div key={strategy.id} className="card hover:scale-105 transition-transform">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-tavern-200 to-tavern-300 dark:from-tavern-700 dark:to-tavern-600 rounded-cozy flex items-center justify-center shadow-tavern">
                                    <Icon className="w-6 h-6 text-tavern-800 dark:text-amber-200" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-tavern-800 dark:text-amber-200 mb-2 text-base sm:text-lg">{strategy.title}</h3>
                                    <p className="text-tavern-700 dark:text-tavern-300 text-sm sm:text-base">{strategy.description}</p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {filteredStrategies.length === 0 && (
                <div className="card text-center py-12">
                    <p className="text-tavern-600 dark:text-tavern-400 text-lg">{t.components.coping.noStrategies}</p>
                </div>
            )}
        </div>
    )
}

export default CopingStrategies

