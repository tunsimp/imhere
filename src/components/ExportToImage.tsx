import { useState, useRef, useEffect } from 'react'
import { Download, Upload, Camera, Loader2, Video, X, Circle } from 'lucide-react'
import { storage } from '../utils/storage'

interface TodoItem {
    id: string
    text: string
    completed: boolean
    time?: string
}

interface ScheduleItem {
    id: string
    text: string
    time: string
}

interface ThoughtEntry {
    id: string
    thought: string
    emotion: string
    intensity: number
    evidence: string
    date: string
    time: string
}

function ExportToImage() {
    const [selfie, setSelfie] = useState<string | null>(null)
    const [isGenerating, setIsGenerating] = useState(false)
    const [imageGenerated, setImageGenerated] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [isCameraActive, setIsCameraActive] = useState(false)
    const [isVideoReady, setIsVideoReady] = useState(false)
    const [stream, setStream] = useState<MediaStream | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const captureCanvasRef = useRef<HTMLCanvasElement>(null)

    // Cleanup camera stream on unmount
    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop())
            }
        }
    }, [stream])

    const startCamera = async () => {
        try {
            // Check if getUserMedia is available
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                alert('Camera access is not supported in your browser. Please use a modern browser or upload a photo instead.')
                return
            }

            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'user', // Use front-facing camera
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                },
                audio: false
            })

            setStream(mediaStream)
            setIsCameraActive(true)
            setIsVideoReady(false)

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream

                // Wait for video to be ready
                videoRef.current.onloadedmetadata = () => {
                    if (videoRef.current) {
                        videoRef.current.play()
                            .then(() => {
                                setIsVideoReady(true)
                            })
                            .catch((err) => {
                                console.error('Error playing video:', err)
                                alert('Error starting camera. Please try again.')
                                stopCamera()
                            })
                    }
                }
            }
        } catch (error: any) {
            console.error('Error accessing camera:', error)
            let errorMessage = 'Unable to access camera. '

            if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                errorMessage += 'Please allow camera access in your browser settings and try again.'
            } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
                errorMessage += 'No camera found. Please check your device has a camera connected.'
            } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
                errorMessage += 'Camera is already in use by another application.'
            } else {
                errorMessage += 'Please check your permissions and try again.'
            }

            alert(errorMessage)
            setIsCameraActive(false)
        }
    }

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop())
            setStream(null)
        }
        setIsCameraActive(false)
        setIsVideoReady(false)
        if (videoRef.current) {
            videoRef.current.srcObject = null
            videoRef.current.onloadedmetadata = null
        }
    }

    const capturePhoto = () => {
        if (!videoRef.current || !captureCanvasRef.current) {
            alert('Camera not ready. Please wait for the camera to start.')
            return
        }

        const video = videoRef.current
        const canvas = captureCanvasRef.current
        const ctx = canvas.getContext('2d')

        if (!ctx) {
            alert('Error: Could not get canvas context.')
            return
        }

        // Check if video is ready
        if (video.readyState !== video.HAVE_ENOUGH_DATA) {
            alert('Video not ready. Please wait a moment and try again.')
            return
        }

        // Check if video has valid dimensions
        if (!video.videoWidth || !video.videoHeight) {
            alert('Video dimensions not available. Please try again.')
            return
        }

        try {
            // Set canvas dimensions to match video
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight

            // Draw video frame to canvas
            // Note: CSS transform doesn't affect the video data, so we capture the normal (non-mirrored) image
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

            // Convert to data URL and set as selfie
            const dataUrl = canvas.toDataURL('image/png')
            setSelfie(dataUrl)

            // Stop camera after capture
            stopCamera()
        } catch (error) {
            console.error('Error capturing photo:', error)
            alert('Error capturing photo. Please try again.')
        }
    }

    const handleSelfieUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setSelfie(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const removeSelfie = () => {
        setSelfie(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const loadImage = (src: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
            const img = new Image()
            img.crossOrigin = 'anonymous'
            img.onload = () => resolve(img)
            img.onerror = reject
            img.src = src
        })
    }

    const wrapText = (
        ctx: CanvasRenderingContext2D,
        text: string,
        x: number,
        y: number,
        maxWidth: number,
        lineHeight: number
    ): number => {
        const words = text.split(' ')
        let line = ''
        let currentY = y

        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' '
            const metrics = ctx.measureText(testLine)
            const testWidth = metrics.width

            if (testWidth > maxWidth && n > 0) {
                ctx.fillText(line, x, currentY)
                line = words[n] + ' '
                currentY += lineHeight
            } else {
                line = testLine
            }
        }
        ctx.fillText(line, x, currentY)
        return currentY + lineHeight
    }

    const generateImage = async () => {
        if (!canvasRef.current) return

        setIsGenerating(true)

        // Wait for fonts to load
        await document.fonts.ready

        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        if (!ctx) {
            setIsGenerating(false)
            return
        }

        // Set canvas size (A4 ratio: 8.5x11 inches at 150 DPI)
        const width = 1275 // 8.5 * 150
        const height = 1650 // 11 * 150
        canvas.width = width
        canvas.height = height

        // Background gradient
        const gradient = ctx.createLinearGradient(0, 0, width, height)
        gradient.addColorStop(0, '#fdf9f3')
        gradient.addColorStop(0.5, '#fbf3e7')
        gradient.addColorStop(1, '#f5ede0')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, width, height)

        // Title - using Cinzel (fantasy serif font)
        ctx.fillStyle = '#543a28'
        ctx.font = 'bold 48px Cinzel, serif'
        ctx.textAlign = 'center'
        ctx.fillText("My Wellness Journey", width / 2, 60)

        ctx.font = '24px Cinzel, serif'
        ctx.fillStyle = '#8b6544'
        const dateStr = new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        ctx.fillText(dateStr, width / 2, 100)

        let yPos = 150

        // Selfie section
        if (selfie) {
            try {
                const selfieImg = await loadImage(selfie)
                const selfieSize = 200
                const selfieX = (width - selfieSize) / 2
                ctx.drawImage(selfieImg, selfieX, yPos, selfieSize, selfieSize)
                yPos += selfieSize + 30
            } catch (error) {
                console.error('Error loading selfie:', error)
            }
        }

        // Get data from storage
        const selectedDate = new Date().toISOString().split('T')[0]
        const todos = storage.get<TodoItem[]>(`todos_${selectedDate}`, [])
        const schedule = storage.get<ScheduleItem[]>(`schedule_${selectedDate}`, [])
        const thoughts = storage.get<ThoughtEntry[]>('thought_log', [])
            .filter(t => t.date === selectedDate)

        // To-Do List Section
        yPos += 20
        ctx.fillStyle = '#543a28'
        ctx.font = 'bold 36px Cinzel, serif'
        ctx.textAlign = 'left'
        ctx.fillText('📋 To-Do List', 50, yPos)
        yPos += 40

        if (todos.length === 0) {
            ctx.fillStyle = '#8b6544'
            ctx.font = '20px MedievalSharp, cursive'
            ctx.fillText('No tasks for today', 50, yPos)
            yPos += 40
        } else {
            const completedCount = todos.filter(t => t.completed).length
            ctx.fillStyle = '#8b6544'
            ctx.font = '24px Cinzel, serif'
            ctx.fillText(`Completed: ${completedCount}/${todos.length}`, 50, yPos)
            yPos += 40

            todos.forEach((todo) => {
                if (yPos > height - 200) return // Prevent overflow
                ctx.fillStyle = todo.completed ? '#6b6544' : '#543a28'
                ctx.font = todo.completed ? 'italic 20px MedievalSharp, cursive' : '20px MedievalSharp, cursive'
                const prefix = todo.completed ? '✓ ' : '○ '
                const text = prefix + todo.text
                yPos = wrapText(ctx, text, 70, yPos, width - 140, 30)
                yPos += 10
            })
        }

        // Schedule Section
        yPos += 20
        ctx.fillStyle = '#543a28'
        ctx.font = 'bold 36px Cinzel, serif'
        ctx.fillText('⏰ Daily Schedule', 50, yPos)
        yPos += 40

        if (schedule.length === 0) {
            ctx.fillStyle = '#8b6544'
            ctx.font = '20px MedievalSharp, cursive'
            ctx.fillText('No schedule items for today', 50, yPos)
            yPos += 40
        } else {
            schedule.forEach((item) => {
                if (yPos > height - 200) return
                ctx.fillStyle = '#543a28'
                ctx.font = 'bold 20px Cinzel, serif'
                ctx.fillText(item.time, 70, yPos)
                ctx.fillStyle = '#8b6544'
                ctx.font = '20px MedievalSharp, cursive'
                const scheduleText = ' - ' + item.text
                yPos = wrapText(ctx, scheduleText, 150, yPos, width - 200, 30)
                yPos += 10
            })
        }

        // Thought Log Section
        yPos += 20
        ctx.fillStyle = '#543a28'
        ctx.font = 'bold 36px Cinzel, serif'
        ctx.fillText('💭 Thought Log', 50, yPos)
        yPos += 40

        if (thoughts.length === 0) {
            ctx.fillStyle = '#8b6544'
            ctx.font = '20px MedievalSharp, cursive'
            ctx.fillText('No thoughts logged for today', 50, yPos)
        } else {
            thoughts.slice(0, 5).forEach((thought) => { // Limit to 5 thoughts
                if (yPos > height - 300) return

                ctx.fillStyle = '#543a28'
                ctx.font = 'bold 22px Cinzel, serif'
                yPos = wrapText(ctx, thought.thought, 70, yPos, width - 140, 28)
                yPos += 10

                ctx.fillStyle = '#8b6544'
                ctx.font = '18px MedievalSharp, cursive'
                ctx.fillText(`Emotion: ${thought.emotion} | Intensity: ${thought.intensity}/10`, 70, yPos)
                yPos += 30

                if (thought.evidence) {
                    ctx.fillStyle = '#6b6544'
                    ctx.font = 'italic 18px MedievalSharp, cursive'
                    const evidenceText = 'Evidence: ' + thought.evidence
                    yPos = wrapText(ctx, evidenceText, 70, yPos, width - 140, 26)
                    yPos += 15
                }
                yPos += 15
            })
        }

        // Footer
        ctx.fillStyle = '#8b6544'
        ctx.font = '16px MedievalSharp, cursive'
        ctx.textAlign = 'center'
        ctx.fillText('Generated by I\'m Here - Your Wellness Companion', width / 2, height - 30)

        setPreviewUrl(canvas.toDataURL('image/png'))
        setImageGenerated(true)
        setIsGenerating(false)
    }

    const downloadImage = () => {
        if (!canvasRef.current || !imageGenerated) return
        const link = document.createElement('a')
        link.download = `wellness-journey-${new Date().toISOString().split('T')[0]}.png`
        link.href = canvasRef.current.toDataURL('image/png')
        link.click()
    }

    return (
        <div className="space-y-6">
            <div className="card">
                <h2 className="text-2xl sm:text-3xl font-bold text-tavern-800 dark:text-amber-200 mb-4 flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-700 rounded-full flex items-center justify-center shadow-tavern flex-shrink-0">
                        <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <span className="break-words">Export to Image</span>
                </h2>
                <p className="text-tavern-700 dark:text-tavern-300 mb-6 text-base sm:text-lg">
                    Create a beautiful snapshot of your wellness journey! Upload a selfie and combine it with your to-do list and thought log into a single image. 📸
                </p>

                {/* Selfie Upload */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-tavern-700 dark:text-tavern-300 mb-2">
                        Add Your Selfie
                    </label>
                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={isCameraActive ? stopCamera : startCamera}
                                className={`btn-game flex items-center gap-2 ${isCameraActive ? 'bg-red-600 hover:bg-red-700' : ''}`}
                            >
                                {isCameraActive ? (
                                    <>
                                        <X className="w-5 h-5" />
                                        Stop Camera
                                    </>
                                ) : (
                                    <>
                                        <Video className="w-5 h-5" />
                                        Take Photo
                                    </>
                                )}
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleSelfieUpload}
                                className="hidden"
                                id="selfie-upload"
                            />
                            <label
                                htmlFor="selfie-upload"
                                className="btn-game flex items-center gap-2 cursor-pointer"
                            >
                                <Upload className="w-5 h-5" />
                                Upload Photo
                            </label>
                        </div>

                        {/* Camera Preview */}
                        {isCameraActive && (
                            <div className="relative bg-tavern-900 rounded-cozy p-4 overflow-hidden">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="w-full max-w-md mx-auto rounded-cozy"
                                    style={{ transform: 'scaleX(-1)' }} // Mirror the video
                                />
                                {!isVideoReady && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-tavern-900 bg-opacity-75 rounded-cozy">
                                        <div className="text-center text-white">
                                            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                                            <p className="text-sm">Starting camera...</p>
                                        </div>
                                    </div>
                                )}
                                <div className="flex flex-col items-center mt-4 gap-3">
                                    {isVideoReady && (
                                        <p className="text-sm text-white text-center">
                                            Position yourself and click Capture
                                        </p>
                                    )}
                                    <div className="flex gap-3">
                                        <button
                                            onClick={capturePhoto}
                                            disabled={!isVideoReady}
                                            className={`btn-game flex items-center gap-2 bg-amber-600 hover:bg-amber-700 ${!isVideoReady ? 'opacity-50 cursor-not-allowed' : ''
                                                }`}
                                        >
                                            <Circle className="w-6 h-6 fill-white" />
                                            Capture
                                        </button>
                                        <button
                                            onClick={stopCamera}
                                            className="btn-game flex items-center gap-2 bg-red-600 hover:bg-red-700"
                                        >
                                            <X className="w-5 h-5" />
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Selfie Preview */}
                        {selfie && !isCameraActive && (
                            <div className="flex items-center gap-4 p-4 bg-parchment-100 dark:bg-tavern-800 rounded-cozy">
                                <img
                                    src={selfie}
                                    alt="Your selfie"
                                    className="w-32 h-32 object-cover rounded-cozy shadow-tavern"
                                />
                                <div className="flex-1">
                                    <p className="text-tavern-800 dark:text-tavern-200 font-medium mb-2">
                                        Selfie Ready!
                                    </p>
                                    <button
                                        onClick={removeSelfie}
                                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Hidden canvas for capturing photo */}
                <canvas ref={captureCanvasRef} className="hidden" />

                {/* Generate and Download */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={generateImage}
                        disabled={isGenerating}
                        className="btn-game flex items-center justify-center gap-2"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Camera className="w-5 h-5" />
                                Generate Image
                            </>
                        )}
                    </button>
                    <button
                        onClick={downloadImage}
                        disabled={isGenerating || !imageGenerated}
                        className={`btn-game flex items-center justify-center gap-2 ${!imageGenerated ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <Download className="w-5 h-5" />
                        Download Image
                    </button>
                </div>

                {/* Preview Canvas (hidden) */}
                <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Preview */}
            {previewUrl && imageGenerated && (
                <div className="card">
                    <h3 className="text-xl font-semibold text-tavern-800 dark:text-amber-200 mb-4">
                        Preview
                    </h3>
                    <div className="bg-parchment-100 dark:bg-tavern-800 p-4 rounded-cozy overflow-x-auto">
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full max-w-2xl mx-auto rounded-cozy shadow-tavern"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default ExportToImage

