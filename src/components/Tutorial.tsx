import { useState, useEffect, useRef } from 'react'
import { ArrowRight, MessageCircle, FastForward } from 'lucide-react'
import NPCAvatar from './NPCAvatar'
import { useLanguage } from '../hooks/useLanguage'

type Tab = 'gratitude' | 'schedule' | 'coping' | 'thoughts' | 'export' | 'music'

interface TutorialProps {
    tab: Tab
    onClose: () => void
}

function Tutorial({ tab, onClose }: TutorialProps) {
    const { t } = useLanguage()
    const [currentStep, setCurrentStep] = useState(0)
    const [displayedText, setDisplayedText] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const typingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

    // Convert translation arrays to the format expected by the component
    const messages = t.tutorial[tab] || []
    const conversations = [{
        messages: messages.map((text: string, index: number) => ({
            id: index,
            text,
            type: 'npc' as const,
        }))
    }]

    const currentConversation = conversations[currentStep]
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
    const currentMessage = currentConversation?.messages[currentMessageIndex]

    useEffect(() => {
        // Clear any existing interval
        if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current)
            typingIntervalRef.current = null
        }

        if (currentMessage?.text) {
            setIsTyping(true)
            setDisplayedText('')

            let charIndex = 0
            typingIntervalRef.current = setInterval(() => {
                if (charIndex < currentMessage.text.length) {
                    setDisplayedText(currentMessage.text.slice(0, charIndex + 1))
                    charIndex++
                } else {
                    setIsTyping(false)
                    if (typingIntervalRef.current) {
                        clearInterval(typingIntervalRef.current)
                        typingIntervalRef.current = null
                    }
                }
            }, 30) // Typing speed

            return () => {
                if (typingIntervalRef.current) {
                    clearInterval(typingIntervalRef.current)
                    typingIntervalRef.current = null
                }
            }
        } else {
            setDisplayedText('')
            setIsTyping(false)
        }
    }, [currentStep, currentMessageIndex, currentMessage?.text])

    const skipAnimation = () => {
        if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current)
            typingIntervalRef.current = null
        }
        if (currentMessage?.text) {
            setDisplayedText(currentMessage.text)
            setIsTyping(false)
        }
    }

    const handleContinue = () => {
        // If still typing, skip animation first
        if (isTyping) {
            skipAnimation()
            return
        }

        if (currentMessageIndex < currentConversation.messages.length - 1) {
            setCurrentMessageIndex(currentMessageIndex + 1)
        } else {
            if (currentStep < conversations.length - 1) {
                setCurrentStep(currentStep + 1)
                setCurrentMessageIndex(0)
            } else {
                onClose()
            }
        }
    }

    const handleSkip = () => {
        onClose()
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-3 sm:p-4">
            <div className="max-w-2xl w-full transform transition-all duration-300 animate-fade-in max-h-[90vh] overflow-y-auto">
                {/* Character Avatar */}
                <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 mb-4">
                    <div className="flex-shrink-0 mx-auto sm:mx-0">
                        <div className="transform hover:scale-110 transition-transform">
                            <NPCAvatar size="md" />
                        </div>
                        <div className="mt-2 text-center">
                            <p className="text-xs sm:text-sm font-medium text-white">{t.tutorial.tavernKeeper}</p>
                        </div>
                    </div>

                    {/* Chat Bubble */}
                    <div
                        className="flex-1 chat-bubble animate-slide-in min-w-0 relative group cursor-pointer hover:scale-[1.02] transition-transform"
                        onClick={isTyping ? skipAnimation : undefined}
                    >
                        {isTyping && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    skipAnimation()
                                }}
                                className="absolute top-2 right-2 p-1.5 rounded-cozy bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-800 transition-all opacity-0 group-hover:opacity-100 shadow-md z-10"
                                title={t.tutorial.skipAnimation}
                                aria-label={t.tutorial.skipAnimation}
                            >
                                <FastForward className="w-4 h-4" />
                            </button>
                        )}
                        <div className="flex items-start gap-2 sm:gap-3">
                            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-1" />
                            <div className="flex-1 min-w-0">
                                {currentMessage ? (
                                    <div>
                                        <p className="text-tavern-800 dark:text-tavern-200 text-base sm:text-lg leading-relaxed break-words">
                                            {displayedText}
                                            {isTyping && (
                                                <span className="inline-block w-2 h-5 bg-amber-500 dark:bg-amber-600 ml-1 animate-blink" />
                                            )}
                                        </p>
                                        {isTyping && (
                                            <p className="text-xs text-tavern-600 dark:text-tavern-400 mt-2 italic">
                                                {t.tutorial.clickToSkip}
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-tavern-800 dark:text-tavern-200 text-base sm:text-lg leading-relaxed break-words">
                                        Loading...
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progress Dots - Only show if multiple steps */}
                {conversations.length > 1 && (
                    <div className="flex justify-center gap-1.5 sm:gap-2 mb-4">
                        {conversations.map((_, index) => (
                            <div
                                key={index}
                                className={`h-2 rounded-full transition-all duration-300 ${index === currentStep
                                    ? 'bg-amber-500 dark:bg-amber-600 w-6 sm:w-8 scale-110'
                                    : index < currentStep
                                        ? 'bg-amber-400 dark:bg-amber-500 w-2'
                                        : 'bg-white bg-opacity-30 dark:bg-white dark:bg-opacity-20 w-2'
                                    }`}
                            />
                        ))}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
                    <button
                        onClick={handleSkip}
                        className="text-white hover:text-amber-200 dark:hover:text-amber-300 font-medium px-4 py-2 rounded-cozy transition-colors text-sm sm:text-base order-2 sm:order-1"
                    >
                        {t.tutorial.skipTutorial}
                    </button>
                    <button
                        onClick={handleContinue}
                        className="btn-game flex items-center justify-center gap-2 order-1 sm:order-2"
                    >
                        {isTyping
                            ? t.tutorial.skipAnimation
                            : currentMessageIndex < currentConversation.messages.length - 1
                                ? t.tutorial.continue
                                : currentStep < conversations.length - 1
                                    ? t.tutorial.next
                                    : t.tutorial.gotIt}
                        {isTyping ? (
                            <FastForward className="w-4 h-4 sm:w-5 sm:h-5" />
                        ) : (
                            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        )}
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes blink {
                    0%, 50% { opacity: 1; }
                    51%, 100% { opacity: 0; }
                }
                .animate-blink {
                    animation: blink 1s infinite;
                }
                @keyframes slide-in {
                    from {
                        opacity: 0;
                        transform: translateX(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                .animate-slide-in {
                    animation: slide-in 0.3s ease-out;
                }
            `}</style>
        </div>
    )
}

export default Tutorial
