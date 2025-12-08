import { useState, useEffect, useRef } from 'react'
import { ArrowRight, MessageCircle, FastForward } from 'lucide-react'
import NPCAvatar from './NPCAvatar'

function Tutorial({ onClose }: { onClose: () => void }) {
    const [currentStep, setCurrentStep] = useState(0)
    const [displayedText, setDisplayedText] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const typingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

    const conversations = [
        {
            messages: [
                {
                    id: 0,
                    text: "Hey there! 👋 Welcome to your cozy little wellness space!",
                    type: 'npc' as const,
                },
                {
                    id: 1,
                    text: "I'm here to help you on your journey. Think of me as your friendly companion! 🌟",
                    type: 'npc' as const,
                },
                {
                    id: 2,
                    text: "Let me show you around this place. It's got some really neat features!",
                    type: 'npc' as const,
                },
            ]
        },
        {
            messages: [
                {
                    id: 0,
                    text: "First up, we have the Gratitude Journal! ✨",
                    type: 'npc' as const,
                },
                {
                    id: 1,
                    text: "Every day, you can write down things you're grateful for. It's like collecting little moments of joy!",
                    type: 'npc' as const,
                },
                {
                    id: 2,
                    text: "Research shows this simple practice can really brighten your day. Pretty cool, right? 😊",
                    type: 'npc' as const,
                },
            ]
        },
        {
            messages: [
                {
                    id: 0,
                    text: "Next, there's your Daily Schedule and To-Do List! 📅",
                    type: 'npc' as const,
                },
                {
                    id: 1,
                    text: "You can plan out your day with time slots and create tasks. When you complete them, you get that satisfying checkmark! ✅",
                    type: 'npc' as const,
                },
                {
                    id: 2,
                    text: "It's like leveling up in a game, but for real life!",
                    type: 'npc' as const,
                },
            ]
        },
        {
            messages: [
                {
                    id: 0,
                    text: "Feeling overwhelmed? Check out the Coping Strategies section! 💚",
                    type: 'npc' as const,
                },
                {
                    id: 1,
                    text: "There are lots of techniques you can try - breathing exercises, grounding techniques, and more!",
                    type: 'npc' as const,
                },
                {
                    id: 2,
                    text: "Think of them as your toolkit for when things get tough. Everyone's different, so find what works for you!",
                    type: 'npc' as const,
                },
            ]
        },
        {
            messages: [
                {
                    id: 0,
                    text: "Last but not least, there's the Thought Log! 📖",
                    type: 'npc' as const,
                },
                {
                    id: 1,
                    text: "When you have a tough thought, you can log it here. Write down what you're thinking and feeling.",
                    type: 'npc' as const,
                },
                {
                    id: 2,
                    text: "Then, you can challenge it! Ask yourself: 'Is there evidence this might not be true?' It's like being your own detective! 🕵️",
                    type: 'npc' as const,
                },
            ]
        },
        {
            messages: [
                {
                    id: 0,
                    text: "And that's everything! You're all set to start your wellness journey! 🎉",
                    type: 'npc' as const,
                },
                {
                    id: 1,
                    text: "Remember, this is your safe space. Take your time, be kind to yourself, and enjoy exploring!",
                    type: 'npc' as const,
                },
                {
                    id: 2,
                    text: "If you ever need help, just click 'Show Tutorial' in the header. I'll be here! 💫",
                    type: 'npc' as const,
                },
            ]
        },
    ]

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
                            <NPCAvatar size="md" className="shadow-tavern" />
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

                {/* Progress Dots */}
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
                                    : "Let's Go!"}
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
