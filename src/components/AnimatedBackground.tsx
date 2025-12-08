import { useEffect, useRef } from 'react'
/// <reference types="vite/client" />

interface AnimatedBackgroundProps {
    src?: string // Path to GIF or video file
    type?: 'gif' | 'video'
}

export default function AnimatedBackground({ src, type = 'gif' }: AnimatedBackgroundProps) {
    const videoRef = useRef<HTMLVideoElement>(null)

    // Get the base URL from Vite (handles both dev and production)
    const baseUrl = (import.meta as any).env?.BASE_URL || '/'
    const fullSrc = src ? (baseUrl + src.replace(/^\//, '')) : undefined

    useEffect(() => {
        // If using video, ensure it loops
        if (type === 'video' && videoRef.current) {
            videoRef.current.loop = true
            videoRef.current.muted = true
            videoRef.current.play().catch(() => {
                // Autoplay might fail, that's okay
            })
        }
    }, [type])

    useEffect(() => {
        // Debug: Log when component mounts and src changes
        console.log('AnimatedBackground mounted')
        console.log('Base URL:', baseUrl)
        console.log('Original src:', src)
        console.log('Full src path:', fullSrc)
        console.log('Type:', type)
    }, [src, type, baseUrl, fullSrc])

    return (
        <div className="fixed inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
            {type === 'video' ? (
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
                        console.error('Trying alternative path:', src)
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
                            console.error('Trying alternative path:', src)
                            console.error('Full URL would be:', window.location.origin + fullSrc)
                            // Try the original path as fallback
                            if (e.currentTarget.src !== window.location.origin + (src || '')) {
                                e.currentTarget.src = src || ''
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

