import { useState, useEffect, useRef } from 'react'
import { Volume2, VolumeX, Music } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'

function BackgroundMusic() {
    const { t } = useLanguage()
    const [isPlaying, setIsPlaying] = useState(() => {
        const saved = localStorage.getItem('backgroundMusicEnabled')
        return saved === 'true'
    })
    const [volume, setVolume] = useState(() => {
        const saved = localStorage.getItem('backgroundMusicVolume')
        return saved ? parseFloat(saved) : 0.3
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const audioRef = useRef<HTMLAudioElement>(null)

    // Ambient tavern/cozy background music
    // Get the base URL from Vite (handles both dev and production)
    const baseUrl = (import.meta as any).env?.BASE_URL || '/'
    const musicUrl = baseUrl + 'bg-music.m4a'.replace(/^\//, '')

    // Initialize audio settings and handle loading
    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        // Debug: Log the audio path
        console.log('BackgroundMusic loading audio')
        console.log('Base URL:', baseUrl)
        console.log('Music URL:', musicUrl)
        console.log('Full URL would be:', window.location.origin + musicUrl)

        audio.volume = volume
        audio.muted = false

        // Handle audio loading events
        const handleLoadedData = () => {
            console.log('Audio loaded successfully')
            setError(null)
            setIsLoading(false)
        }

        const handleLoadStart = () => {
            console.log('Audio loading started')
            setIsLoading(true)
        }

        const handleCanPlay = () => {
            console.log('Audio can play')
            setIsLoading(false)
        }

        const handleError = () => {
            const audioError = audio.error
            let errorMsg = 'Unknown error'

            if (audioError) {
                switch (audioError.code) {
                    case MediaError.MEDIA_ERR_ABORTED:
                        errorMsg = 'Audio loading aborted'
                        break
                    case MediaError.MEDIA_ERR_NETWORK:
                        errorMsg = 'Network error loading audio'
                        break
                    case MediaError.MEDIA_ERR_DECODE:
                        errorMsg = 'Audio decode error'
                        break
                    case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                        errorMsg = 'Audio format not supported'
                        break
                    default:
                        errorMsg = `Audio error: ${audioError.message || 'Unknown'}`
                }
            }

            console.error('Audio error:', errorMsg, audioError)
            setError(errorMsg)
            setIsPlaying(false)
            setIsLoading(false)
        }

        audio.addEventListener('loadeddata', handleLoadedData)
        audio.addEventListener('loadstart', handleLoadStart)
        audio.addEventListener('canplay', handleCanPlay)
        audio.addEventListener('error', handleError)

        return () => {
            audio.removeEventListener('loadeddata', handleLoadedData)
            audio.removeEventListener('loadstart', handleLoadStart)
            audio.removeEventListener('canplay', handleCanPlay)
            audio.removeEventListener('error', handleError)
        }
    }, [])

    // Sync volume changes
    useEffect(() => {
        const audio = audioRef.current
        if (audio) {
            audio.volume = volume
        }
    }, [volume])

    // Sync playback state with audio element
    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        const handlePlay = () => setIsPlaying(true)
        const handlePause = () => setIsPlaying(false)
        const handleError = () => {
            console.error('Audio error:', audio.error)
            setIsPlaying(false)
            setIsLoading(false)
        }

        audio.addEventListener('play', handlePlay)
        audio.addEventListener('pause', handlePause)
        audio.addEventListener('error', handleError)

        // Don't auto-play on mount - require user interaction
        // This avoids browser autoplay restrictions

        return () => {
            audio.removeEventListener('play', handlePlay)
            audio.removeEventListener('pause', handlePause)
            audio.removeEventListener('error', handleError)
        }
    }, [isPlaying])

    const togglePlay = async () => {
        const audio = audioRef.current
        if (!audio) {
            console.error('Audio ref is null')
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            if (audio.paused) {
                // Play
                console.log('Attempting to play audio...')
                audio.muted = false
                audio.volume = volume

                // Ensure audio is loaded
                if (audio.readyState < 2) {
                    console.log('Audio not ready, loading...')
                    audio.load()
                    await new Promise((resolve, reject) => {
                        const handleCanPlay = () => {
                            audio.removeEventListener('canplay', handleCanPlay)
                            audio.removeEventListener('error', handleError)
                            resolve(true)
                        }
                        const handleError = () => {
                            audio.removeEventListener('canplay', handleCanPlay)
                            audio.removeEventListener('error', handleError)
                            reject(new Error('Audio failed to load'))
                        }
                        audio.addEventListener('canplay', handleCanPlay)
                        audio.addEventListener('error', handleError)
                    })
                }

                const playPromise = audio.play()

                if (playPromise !== undefined) {
                    await playPromise
                    console.log('Audio playing successfully')
                    setIsPlaying(true)
                    localStorage.setItem('backgroundMusicEnabled', 'true')
                }
            } else {
                // Pause
                console.log('Pausing audio...')
                audio.pause()
                setIsPlaying(false)
                localStorage.setItem('backgroundMusicEnabled', 'false')
            }
        } catch (error: any) {
            console.error('Error toggling audio:', error)
            setError(error?.message || 'Failed to play audio')
            setIsPlaying(false)
            localStorage.setItem('backgroundMusicEnabled', 'false')
        } finally {
            setIsLoading(false)
        }
    }

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value)
        setVolume(newVolume)
        localStorage.setItem('backgroundMusicVolume', newVolume.toString())

        const audio = audioRef.current
        if (audio) {
            audio.volume = newVolume
        }
    }

    return (
        <>
            <audio
                ref={audioRef}
                src={musicUrl}
                loop
                preload="auto"
            />
            <div className="flex items-center gap-2">
                {error && (
                    <span className="text-xs text-red-600 dark:text-red-400" title={error}>
                        ⚠️
                    </span>
                )}
                <button
                    onClick={togglePlay}
                    disabled={isLoading}
                    className="p-2 rounded-cozy bg-tavern-200 dark:bg-tavern-700 text-tavern-800 dark:text-amber-200 hover:bg-tavern-300 dark:hover:bg-tavern-600 transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label={isPlaying ? t.backgroundMusic.pause : t.backgroundMusic.play}
                    title={error ? error : (isPlaying ? t.backgroundMusic.pause : t.backgroundMusic.play)}
                >
                    {isLoading ? (
                        <Music className="w-5 h-5 animate-pulse" />
                    ) : isPlaying ? (
                        <Volume2 className="w-5 h-5" />
                    ) : (
                        <VolumeX className="w-5 h-5" />
                    )}
                </button>
                {isPlaying && (
                    <div className="hidden sm:flex items-center gap-2 min-w-[100px]">
                        <Music className="w-4 h-4 text-tavern-700 dark:text-tavern-300 flex-shrink-0" />
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="flex-1 h-2 bg-tavern-200 dark:bg-tavern-700 rounded-lg appearance-none cursor-pointer accent-amber-600"
                            aria-label={t.backgroundMusic.volume}
                        />
                    </div>
                )}
            </div>
        </>
    )
}

export default BackgroundMusic
