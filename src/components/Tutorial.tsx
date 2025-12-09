import { useState, useEffect, useRef } from 'react'
import { ArrowRight, MessageCircle, FastForward } from 'lucide-react'
import NPCAvatar from './NPCAvatar'

type Tab = 'gratitude' | 'schedule' | 'coping' | 'thoughts' | 'export' | 'music'

interface TutorialProps {
    tab: Tab
    onClose: () => void
}

// Tab-specific tutorial content
const tabTutorials: Record<Tab, Array<{ messages: Array<{ id: number; text: string; type: 'npc' }> }>> = {
    gratitude: [
        {
            messages: [
                {
                    id: 0,
                    text: "Hey, I'm so glad you're here! ✨",
                    type: 'npc' as const,
                },
                {
                    id: 1,
                    text: "You know what? Sometimes the best thing we can do is just pause and notice the good stuff. Even the tiny things count.",
                    type: 'npc' as const,
                },
                {
                    id: 2,
                    text: "When you're ready, just write down what you're grateful for today. No pressure - it's just between you and me. 😊",
                    type: 'npc' as const,
                },
            ]
        },
    ],
    schedule: [
        {
            messages: [
                {
                    id: 0,
                    text: "Hey there! 📅",
                    type: 'npc' as const,
                },
                {
                    id: 1,
                    text: "I know life can get overwhelming sometimes. That's why I thought we could plan things out together, one step at a time.",
                    type: 'npc' as const,
                },
                {
                    id: 2,
                    text: "Write down what you need to do, and when you finish something, check it off. Trust me, that feeling? It's pretty satisfying! ✅",
                    type: 'npc' as const,
                },
            ]
        },
    ],
    coping: [
        {
            messages: [
                {
                    id: 0,
                    text: "Hey, are you doing okay? 💚",
                    type: 'npc' as const,
                },
                {
                    id: 1,
                    text: "When things feel heavy, I've got some techniques that might help. Breathing exercises, grounding stuff - things that have helped others.",
                    type: 'npc' as const,
                },
                {
                    id: 2,
                    text: "Try them out and see what feels right for you. Everyone's different, and that's totally okay. I'm here with you.",
                    type: 'npc' as const,
                },
            ]
        },
    ],
    thoughts: [
        {
            messages: [
                {
                    id: 0,
                    text: "Hey, I see you're here. 📖",
                    type: 'npc' as const,
                },
                {
                    id: 1,
                    text: "Sometimes our thoughts can be really loud, you know? When that happens, it helps to write them down - get them out of your head.",
                    type: 'npc' as const,
                },
                {
                    id: 2,
                    text: "Then, maybe we can look at them together. Ask yourself: 'Is this thought really true?' Sometimes our minds play tricks on us. 🕵️",
                    type: 'npc' as const,
                },
            ]
        },
    ],
    music: [
        {
            messages: [
                {
                    id: 0,
                    text: "Hey! Want to listen to something? 🎵",
                    type: 'npc' as const,
                },
                {
                    id: 1,
                    text: "I've got some songs here that might help - whether you need to relax, focus, or just feel a bit better.",
                    type: 'npc' as const,
                },
                {
                    id: 2,
                    text: "Just hit 'Another Song' if you want something different. Music can be pretty powerful, you know? 🎶",
                    type: 'npc' as const,
                },
            ]
        },
    ],
    export: [
        {
            messages: [
                {
                    id: 0,
                    text: "Hey! 📸",
                    type: 'npc' as const,
                },
                {
                    id: 1,
                    text: "Want to save what you've written? Or maybe share it with someone? You can turn your entries into an image right here.",
                    type: 'npc' as const,
                },
                {
                    id: 2,
                    text: "It's nice to look back sometimes, you know? See how far you've come. 💫",
                    type: 'npc' as const,
                },
            ]
        },
    ],
}

function Tutorial({ tab, onClose }: TutorialProps) {
    const [currentStep, setCurrentStep] = useState(0)
    const [displayedText, setDisplayedText] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const typingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

    const conversations = tabTutorials[tab] || []

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
                            <p className="text-xs sm:text-sm font-medium text-white">Tavern Keeper</p>
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
                                title="Skip animation (or click anywhere on the bubble)"
                                aria-label="Skip animation"
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
                                                Click to skip animation
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
                        Skip Tutorial
                    </button>
                    <button
                        onClick={handleContinue}
                        className="btn-game flex items-center justify-center gap-2 order-1 sm:order-2"
                    >
                        {isTyping
                            ? 'Skip Animation'
                            : currentMessageIndex < currentConversation.messages.length - 1
                                ? 'Continue'
                                : currentStep < conversations.length - 1
                                    ? 'Next'
                                    : 'Got it!'}
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
