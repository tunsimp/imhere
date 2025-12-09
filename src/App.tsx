import { useState, useEffect } from 'react'
import { Heart, Calendar, BookOpen, Sparkles, Moon, Sun, Camera, Music } from 'lucide-react'
import GratitudeJournal from './components/GratitudeJournal'
import DailySchedule from './components/DailySchedule'
import CopingStrategies from './components/CopingStrategies'
import ThoughtLog from './components/ThoughtLog'
import ExportToImage from './components/ExportToImage'
import MusicRecommendations from './components/MusicRecommendations'
import Tutorial from './components/Tutorial'
import WelcomeChat from './components/WelcomeChat'
import NPCAvatar from './components/NPCAvatar'
import AnimatedBackground from './components/AnimatedBackground'
import { useTheme } from './hooks/useTheme'

type Tab = 'gratitude' | 'schedule' | 'coping' | 'thoughts' | 'export' | 'music'

function App() {
    const [activeTab, setActiveTab] = useState<Tab>('gratitude')
    const [showTutorial, setShowTutorial] = useState(false)
    const [tutorialTab, setTutorialTab] = useState<Tab>('gratitude')
    const [showWelcomeChat, setShowWelcomeChat] = useState(false)
    const { isDark, toggleTheme } = useTheme()

    // Check if tutorial for a specific tab has been seen
    const hasSeenTabTutorial = (tab: Tab): boolean => {
        return localStorage.getItem(`hasSeenTutorial_${tab}`) === 'true'
    }

    // Mark tutorial as seen for a specific tab
    const markTabTutorialSeen = (tab: Tab) => {
        localStorage.setItem(`hasSeenTutorial_${tab}`, 'true')
    }

    // Show tutorial when switching to a new tab (if not seen before)
    useEffect(() => {
        if (!hasSeenTabTutorial(activeTab)) {
            setTutorialTab(activeTab)
            setShowTutorial(true)
        }
    }, [activeTab])

    useEffect(() => {
        // Show welcome chat after a short delay when page loads
        const timer = setTimeout(() => {
            setShowWelcomeChat(true)
        }, 500) // Small delay to let page render first

        return () => clearTimeout(timer)
    }, [])

    const tabs = [
        { id: 'gratitude' as Tab, label: 'Gratitude', icon: Sparkles },
        { id: 'schedule' as Tab, label: 'Schedule', icon: Calendar },
        { id: 'coping' as Tab, label: 'Coping', icon: Heart },
        { id: 'thoughts' as Tab, label: 'Thought Log', icon: BookOpen },
        { id: 'music' as Tab, label: 'Music', icon: Music },
        { id: 'export' as Tab, label: 'Export', icon: Camera },
    ]

    return (
        <div className="min-h-screen relative">
            {/* Animated blurred background */}
            <AnimatedBackground
                isDark={isDark}
            />

            {/* Content overlay - almost transparent to show background GIF */}
            <div className="relative z-10 min-h-screen bg-gradient-to-br from-parchment-100/5 via-parchment-200/5 to-tavern-100/5 dark:from-tavern-950/15 dark:via-[#2d1a12]/15 dark:to-tavern-950/15">
                {showTutorial && (
                    <Tutorial
                        tab={tutorialTab}
                        onClose={() => {
                            setShowTutorial(false)
                            markTabTutorialSeen(tutorialTab)
                        }}
                    />
                )}
                {showWelcomeChat && !showTutorial && (
                    <WelcomeChat
                        onClose={() => {
                            setShowWelcomeChat(false)
                        }}
                    />
                )}
                <header className="bg-parchment-50 dark:bg-tavern-900 shadow-tavern sticky top-0 z-50 border-b-4 border-tavern-400 dark:border-tavern-700">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-tavern-800 dark:text-amber-200 flex items-center gap-2 sm:gap-3">
                                    <NPCAvatar size="sm" className="flex-shrink-0" />
                                    <span className="truncate">I'm Here</span>
                                </h1>
                                <p className="text-tavern-700 dark:text-tavern-300 mt-1 text-sm sm:text-base md:text-lg">Your cozy tavern companion 🍺</p>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                                <button
                                    onClick={toggleTheme}
                                    className="p-2 rounded-cozy bg-tavern-200 dark:bg-tavern-700 text-tavern-800 dark:text-amber-200 hover:bg-tavern-300 dark:hover:bg-tavern-600 transition-colors flex-shrink-0"
                                    aria-label="Toggle theme"
                                >
                                    {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                                </button>
                                <button
                                    onClick={() => {
                                        setTutorialTab(activeTab)
                                        setShowTutorial(true)
                                    }}
                                    className="btn-game flex items-center gap-2 flex-1 sm:flex-initial text-sm sm:text-base px-3 sm:px-6 py-2 sm:py-3"
                                >
                                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                                    <span className="hidden sm:inline">Show Tutorial</span>
                                    <span className="sm:hidden">Tutorial</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                <nav className="bg-parchment-50 dark:bg-tavern-900 border-b-4 border-tavern-300 dark:border-tavern-700 sticky top-[88px] sm:top-[120px] z-40 shadow-sm">
                    <div className="max-w-7xl mx-auto px-2 sm:px-4">
                        <div className="flex justify-center items-center overflow-x-auto scrollbar-hide gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 py-2 sm:py-3 md:py-4">
                            {tabs.map((tab) => {
                                const Icon = tab.icon
                                const shortLabel = tab.label === 'Thought Log' ? 'Thoughts' : tab.label
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 md:gap-2 px-2 sm:px-3 md:px-5 lg:px-6 py-1.5 sm:py-2 md:py-3 lg:py-4 font-medium transition-all duration-200 whitespace-nowrap rounded-cozy text-[10px] sm:text-xs md:text-sm lg:text-base flex-shrink-0 min-w-[60px] sm:min-w-0 ${activeTab === tab.id
                                            ? 'text-tavern-800 dark:text-amber-100 bg-amber-100 dark:bg-amber-900 border-2 border-amber-500 dark:border-amber-600 shadow-tavern transform scale-105'
                                            : 'text-tavern-700 dark:text-tavern-300 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-tavern-800 border-2 border-transparent'
                                            }`}
                                    >
                                        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" />
                                        <span className="hidden sm:inline md:hidden">{shortLabel}</span>
                                        <span className="hidden md:inline">{tab.label}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </nav>

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
                    {activeTab === 'gratitude' && <GratitudeJournal />}
                    {activeTab === 'schedule' && <DailySchedule />}
                    {activeTab === 'coping' && <CopingStrategies />}
                    {activeTab === 'thoughts' && <ThoughtLog />}
                    {activeTab === 'music' && <MusicRecommendations />}
                    {activeTab === 'export' && <ExportToImage />}
                </main>
            </div>
        </div>
    )
}

export default App

