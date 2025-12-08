import { useState } from 'react'
import { Heart } from 'lucide-react'

interface NPCAvatarProps {
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

function NPCAvatar({ size = 'md', className = '' }: NPCAvatarProps) {
    // Update this path to match your NPC image location
    // Place your image in the public folder and update the path accordingly
    // Example: '/npc-avatar.png' or '/images/npc.png'
    const imagePath = '/TavernKeeper.png' // Change this to your image filename

    const [imageError, setImageError] = useState(false)

    const sizeClasses = {
        sm: 'w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24',
        md: 'w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40',
        lg: 'w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48'
    }

    const iconSizeClasses = {
        sm: 'w-6 h-6 sm:w-8 sm:h-8',
        md: 'w-8 h-8 sm:w-12 sm:h-12',
        lg: 'w-10 h-10 sm:w-14 sm:h-14'
    }

    if (imageError) {
        // Fallback to Heart icon if image fails to load
        return (
            <Heart className={`${iconSizeClasses[size]} text-white ${className}`} />
        )
    }

    return (
        <img
            src={imagePath}
            alt="NPC Avatar"
            className={`${sizeClasses[size]} object-cover ${className}`}
            onError={() => setImageError(true)}
        />
    )
}

export default NPCAvatar

