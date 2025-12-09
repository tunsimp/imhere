import { useState, useEffect, useRef } from 'react'
import { X, MessageCircle } from 'lucide-react'
import NPCAvatar from './NPCAvatar'

interface WelcomeChatProps {
    onClose: () => void
}

function WelcomeChat({ onClose }: WelcomeChatProps) {
    const [displayedText, setDisplayedText] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
    const typingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const autoCloseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    // Array of welcoming/comforting messages - randomly pick one
    const welcomeMessages = [
        [
            "Hello, traveler! 👋 Welcome to your cozy sanctuary.",
            "I'm here to keep you company. You're not alone in this journey.",
            "Take a deep breath. This is your safe space to rest and reflect. 💚"
        ],
        [
            "Greetings, wanderer! 🌟",
            "I see you've found your way here. Sometimes the path feels lonely, but remember - you're never truly alone.",
            "Let's take this moment together, one step at a time. 🍺"
        ],
        [
            "Hello there, friend! ✨",
            "I'm glad you're here. It takes courage to seek comfort, and I'm proud of you for that.",
            "This tavern is always open for you. Rest easy, traveler. 💫"
        ],
        [
            "Welcome, weary traveler! 🏮",
            "I can sense you might be feeling lonely or overwhelmed. That's okay - we all feel that way sometimes.",
            "You've come to the right place. Let's find some peace together. 🌙"
        ],
        [
            "Hey there! 👋",
            "You're here, and that's what matters. Whether you're feeling lonely, anxious, or just need a moment of calm - I'm here for you.",
            "This is your space. Take your time, be gentle with yourself. 💚"
        ],
        [
            "Well met, kind soul! 🕯️",
            "The fire's warm, and there's always room at this table for you.",
            "No need to rush. Sit awhile, and let your worries drift away like smoke. 🍃"
        ],
        [
            "Ah, a new face! Welcome, welcome! 🎭",
            "I've been keeping this place warm, waiting for travelers like you.",
            "You've made it here, and that's already a victory. Let's celebrate the small wins. 🎉"
        ],
        [
            "Come in, come in! The door's always open. 🚪",
            "I know the world outside can be harsh, but here? Here you're safe.",
            "Take off your worries like a heavy cloak. You can pick them up later if you need to. 🧥"
        ],
        [
            "Good to see you again, friend! 🌸",
            "Or perhaps it's your first time? Either way, I'm glad you're here.",
            "Every journey begins with a single step, and you've already taken it. Keep going. 💪"
        ],
        [
            "The stars are bright tonight, traveler. ⭐",
            "They remind me that even in darkness, there's always light to guide us.",
            "You're stronger than you know. Let's discover that strength together. ✨"
        ],
        [
            "Welcome back to your haven! 🏰",
            "I've been thinking about you. Wondering how your journey's been.",
            "Remember, it's okay to not be okay. That's why places like this exist. 💙"
        ],
        [
            "Ah, there you are! I was hoping you'd visit. 🎪",
            "Life can be overwhelming, can't it? But you don't have to face it alone.",
            "Let's tackle today together, one gentle step at a time. 🦋"
        ],
        [
            "Come sit by the hearth, traveler. 🔥",
            "The flames dance and tell stories of resilience and hope.",
            "Your story matters too. Let's write the next chapter together. 📖"
        ],
        [
            "Well, well, look who's here! 👀",
            "I've saved a special spot just for you. No reservations needed.",
            "You deserve kindness, especially from yourself. Remember that. 💝"
        ],
        [
            "Greetings from your friendly tavern keeper! 🍻",
            "I've noticed you might be carrying some heavy thoughts today.",
            "That's perfectly normal. Let's set them down for a while and breathe. 🌊"
        ],
        [
            "Hello, brave soul! 🛡️",
            "Coming here takes courage. Acknowledging you need support is brave.",
            "I'm proud of you for taking care of yourself. That's not always easy. 🌺"
        ],
        [
            "Welcome to your sanctuary, dear traveler! 🕊️",
            "The world outside can wait. Right now, this moment belongs to you.",
            "Let's find some calm together. You've got this. 🌿"
        ],
        [
            "Ahoy there! ⚓",
            "I see you've navigated through rough waters to get here.",
            "The storm will pass. Until then, this tavern is your safe harbor. ⛵"
        ],
        [
            "Good day, friend! ☀️",
            "Whether it's morning, noon, or night - you're always welcome here.",
            "Take a moment to appreciate how far you've come. You're doing great. 🌈"
        ],
        [
            "Welcome, welcome! Pull up a chair. 🪑",
            "I've been keeping watch, making sure this place stays warm and welcoming.",
            "You're not a burden. You're a person who deserves care and comfort. 💐"
        ],
        [
            "Hello, kindred spirit! 🤝",
            "I can see you've been through a lot. Your strength shows.",
            "But even the strongest travelers need rest. Let this be your rest stop. 🏕️"
        ],
        [
            "Well met on this fine day! 🌻",
            "Every day you show up is a victory, even if it doesn't feel like it.",
            "Small steps forward are still progress. Let's celebrate that. 🎊"
        ],
        [
            "Come in from the cold, traveler! 🧣",
            "I've stoked the fire and prepared a warm welcome just for you.",
            "You don't have to have it all figured out. That's what I'm here for. 🤗"
        ],
        [
            "Ah, a familiar face! Or perhaps new? Either way, welcome! 🎨",
            "This place exists for moments like this - when you need a pause.",
            "Take all the time you need. There's no rush here. ⏳"
        ],
        [
            "Greetings, fellow wanderer! 🗺️",
            "The path you're on isn't always easy, but you're walking it anyway.",
            "That persistence? That's your superpower. Let's use it wisely. 🦸"
        ]
    ]

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

