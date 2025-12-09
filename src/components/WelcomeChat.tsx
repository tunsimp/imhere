import { useState, useEffect, useRef } from 'react'
import { X, MessageCircle } from 'lucide-react'
import NPCAvatar from './NPCAvatar'
import { useLanguage } from '../hooks/useLanguage'

interface WelcomeChatProps {
    onClose: () => void
}

function WelcomeChat({ onClose }: WelcomeChatProps) {
    const { t } = useLanguage()
    const [displayedText, setDisplayedText] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
    const typingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const autoCloseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    // Array of welcoming/comforting messages - randomly pick one
    const welcomeMessages = t.welcomeChat.messages

    // Randomly select a message set
    const [selectedMessages] = useState(() => {
        const randomIndex = Math.floor(Math.random() * welcomeMessages.length)
        return welcomeMessages[randomIndex]
    })

    const currentMessage = selectedMessages[currentMessageIndex]

    useEffect(() => {
        // Clear any existing interval
        if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current)
            typingIntervalRef.current = null
        }

        if (currentMessage) {
            setIsTyping(true)
            setDisplayedText('')

            let charIndex = 0
            typingIntervalRef.current = setInterval(() => {
                if (charIndex < currentMessage.length) {
                    setDisplayedText(currentMessage.slice(0, charIndex + 1))
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
    }, [currentMessageIndex, currentMessage])

    // Auto-advance to next message after typing completes
    useEffect(() => {
        if (!isTyping && currentMessageIndex < selectedMessages.length - 1) {
            const timeout = setTimeout(() => {
                setCurrentMessageIndex(currentMessageIndex + 1)
            }, 2000) // Wait 2 seconds before next message
            return () => clearTimeout(timeout)
        }
    }, [isTyping, currentMessageIndex, selectedMessages.length])

    // Auto-close after all messages are displayed
    useEffect(() => {
        if (!isTyping && currentMessageIndex === selectedMessages.length - 1) {
            autoCloseTimeoutRef.current = setTimeout(() => {
                onClose()
            }, 4000) // Wait 4 seconds after last message before auto-closing
            return () => {
                if (autoCloseTimeoutRef.current) {
                    clearTimeout(autoCloseTimeoutRef.current)
                }
            }
        }
    }, [isTyping, currentMessageIndex, selectedMessages.length, onClose])

    const handleClose = () => {
        // Clear all timeouts/intervals
        if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current)
        }
        if (autoCloseTimeoutRef.current) {
            clearTimeout(autoCloseTimeoutRef.current)
        }
        onClose()
    }

    return (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-50 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                {/* Character Avatar */}
                <div className="flex-shrink-0 mx-auto sm:mx-0">
                    <div className="transform hover:scale-110 transition-transform">
                        <NPCAvatar size="md" />
                    </div>
                </div>

                {/* Chat Bubble */}
                <div className="flex-1 chat-bubble animate-slide-in min-w-0 relative group">
                    <button
                        onClick={handleClose}
                        className="absolute top-2 right-2 p-1.5 rounded-cozy bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-800 transition-all opacity-70 hover:opacity-100 shadow-md z-10"
                        title="Close"
                        aria-label="Close welcome message"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    <div className="flex items-start gap-2 sm:gap-3 pr-8">
                        <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-1" />
                        <div className="flex-1 min-w-0">
                            {currentMessage ? (
                                <p className="text-tavern-800 dark:text-tavern-200 text-sm sm:text-base leading-relaxed break-words">
                                    {displayedText}
                                    {isTyping && (
                                        <span className="inline-block w-2 h-4 bg-amber-500 dark:bg-amber-600 ml-1 animate-blink" />
                                    )}
                                </p>
                            ) : (
                                <p className="text-tavern-800 dark:text-tavern-200 text-sm sm:text-base leading-relaxed break-words">
                                    Loading...
                                </p>
                            )}
                        </div>
                    </div>
                    {/* Progress indicator */}
                    <div className="flex justify-start gap-1 mt-3">
                        {selectedMessages.map((_, index) => (
                            <div
                                key={index}
                                className={`h-1.5 rounded-full transition-all duration-300 ${index <= currentMessageIndex
                                    ? 'bg-amber-500 dark:bg-amber-600 w-4'
                                    : 'bg-tavern-300 dark:bg-tavern-600 w-1.5'
                                    }`}
                            />
                        ))}
                    </div>
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

export default WelcomeChat

