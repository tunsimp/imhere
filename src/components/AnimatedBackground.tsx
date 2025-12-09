import { useEffect, useRef } from 'react'
/// <reference types="vite/client" />

interface AnimatedBackgroundProps {
    src?: string // Path to GIF or video file
    type?: 'gif' | 'video'
    isDark?: boolean // Theme state
}

export default function AnimatedBackground({ src, type = 'gif', isDark = false }: AnimatedBackgroundProps) {
    const videoRef = useRef<HTMLVideoElement>(null)

    // Get the base URL from Vite (handles both dev and production)
    const baseUrl = (import.meta as any).env?.BASE_URL || '/'

    // Determine which background to use based on theme
    const backgroundSrc = src || (isDark ? '/bg.gif' : '/lightbg.jpg')
    const backgroundType = type || (isDark ? 'gif' : 'gif') // lightbg.jpg will be treated as image
    const fullSrc = baseUrl + backgroundSrc.replace(/^\//, '')

    useEffect(() => {
        // If using video, ensure it loops
        if (backgroundType === 'video' && videoRef.current) {
            videoRef.current.loop = true
            videoRef.current.muted = true
            videoRef.current.play().catch(() => {
                // Autoplay might fail, that's okay
            })
        }
    }, [backgroundType])

    useEffect(() => {
        // Debug: Log when component mounts and src changes
        console.log('AnimatedBackground mounted')
        console.log('Base URL:', baseUrl)
        console.log('Theme isDark:', isDark)
        console.log('Background src:', backgroundSrc)
        console.log('Full src path:', fullSrc)
        console.log('Type:', backgroundType)
    }, [isDark, backgroundSrc, backgroundType, baseUrl, fullSrc])

    return (
        <div className="fixed inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
            {backgroundType === 'video' ? (
                <video
                    ref={videoRef}
                    src={fullSrc}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover blur-[2px] sm:blur-[4px] opacity-100 dark:opacity-90 scale-110"
                    onError={() => {
                        console.error('Failed to load background video:', fullSrc)
                        console.error('Trying alternative path:', backgroundSrc)
                    }}
                    onLoadStart={() => console.log('Background video loading:', fullSrc)}
                />
            ) : (
                fullSrc && (
                    <img
                        src={fullSrc}
                        alt="Background"
                        className="w-full h-full object-cover blur-[2px] sm:blur-[4px] opacity-100 dark:opacity-90 scale-110"
                        onError={(e) => {
                            console.error('Failed to load background image:', fullSrc)
                            console.error('Trying alternative path:', backgroundSrc)
                            console.error('Full URL would be:', window.location.origin + fullSrc)
                            // Try the original path as fallback
                            if (e.currentTarget.src !== window.location.origin + backgroundSrc) {
                                e.currentTarget.src = backgroundSrc
                            } else {
                                e.currentTarget.style.display = 'none'
                            }
                        }}
                        onLoad={() => {
                            console.log('Background image loaded successfully:', fullSrc)
                        }}
                    />
                )
            )}
            {/* Additional overlay - removed for maximum GIF visibility */}
            <div className="absolute inset-0 bg-gradient-to-br from-parchment-100/0 via-parchment-200/0 to-tavern-100/0 dark:from-tavern-950/5 dark:via-[#2d1a12]/5 dark:to-tavern-950/5" />
        </div>
    )
}

