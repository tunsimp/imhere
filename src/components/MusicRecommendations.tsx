import { useState, useEffect } from 'react'
import { Music, RefreshCw } from 'lucide-react'

function MusicRecommendations() {
    // Hardcoded track IDs from your playlist
    // Add more track IDs here to randomly select from multiple songs
    // SECURITY NOTE: Track IDs are safe to hardcode - they're public information
    const trackIdsArray = [
        '5LrN7yUQAzvthd4QujgPFr',
        '0CokSRCu5hZgPxcZBaEzVE',
        '1ko2lVN0vKGUl9zrU0qSlT',
        '65FftemJ1DbbZ45DUfHJXE',
        '08MFgEQeVLF37EyZ7jcwLc',
        '3W4U7TEgILGpq0EmquurtH',
        '1Fhb9iJPufNMZSwupsXiRe',
        '4xk70Qur2QeRmWIzWPC63V',
        '10zz9RZt9DnqcxNWksRNrx',
        '4yNk9iz9WVJikRFle3XEvn',
        '6xGruZOHLs39ZbVccQTuPZ',
        '7AMGgAPFczs3wJgMqu6Eqi',
        '0o9zmvc5f3EFApU52PPIyW',
        '51oc6MEsXTpnPn6GOw5VuP',
        '09mEdoA6zrmBPgTEN5qXmN',
        '6qYkmqFsXbj8CQjAdbYz07',
        '5QO79kh1waicV47BqGRL3g',
        '2Ch7LmS7r2Gy2kc64wv3Bz',
        '2SLwbpExuoBDZBpjfefCtV',
        '2p8IUWQDrpjuFltbdgLOag',
        '1Ukxccao1BlWrPhYkcXbwZ',
        '4fsQ0K37TOXa3hEQfjEic1',
        '4h9wh7iOZ0GGn8QVp4RAOB',
        '0KKkJNfGyhkQ5aFogxQAPU',
        '2Q3QRjA8MjzqpFaIkFludb',
        '6D6HVKe7Qu3imn4zzJD0W9',
        '5SlU0Yhi51jobhEiGE4xDv',
        '6gi6y1xwmVszDWkUqab1qw',
        '37F0uwRSrdzkBiuj0D5UHI',
        '4JNdwEfqwFRiAeEISC8RU8',
        '3UZDl7g2r84o1b5marUjfK',
        '2bdVgAQgosGUJoViVDNeOV',
        '65Qe0x9oCbs9pNJc6QBFx7',
        '0mL82sxCRjrs3br407IdJh',
        '3M0lSi5WW79CXQamgSBIjx',
        '7KA4W4McWYRpgf0fWsJZWB',
        '1gmarFWgSwb4SWlmqDjWka',
        '7crMiinWx373rNBZBaVske',
        '3FNy4yzOhHhFBeA5p4ofoq',
        '6TqXcAFInzjp0bODyvrWEq',
        '21jGcNKet2qwijlDFuPiPb',
        '48DKpTEVJ2pAjxQbWTad3q',
        '7JJmb5XwzOO8jgpou264Ml',
        '09CtPGIpYB4BrO8qb1RGsF',
        '3zkWCteF82vJwv0hRLba76',
        '2Z8yfpFX0ZMavHkcIeHiO1',
        '3FAJ6O0NOHQV8Mc5Ri6ENp',
        '7sEIHN9lpk8ad8iIAYnR5Y',
        '4h90qkbnW1Qq6pBhoPvwko',
        '7szuecWAPwGoV1e5vGu8tl',
        '1cKHdTo9u0ZymJdPGSh6nq',
        '2lz3zjQ5QCVXiyOzIk02vW',
        '1Y3LN4zO1Edc2EluIoSPJN',
        '21ApmVGIzIAIDSBdHu6SVt',
        '7hCHIRCHzMxH5q3bBSd7nL',
        '7kpNUrBDYDoX6QKGzrBD1R',
        '612W0NwTVl5Gr3glYKz7rp',
        '3GZD6HmiNUhxXYf8Gch723',
        '5K3SJuYEkvvrLbzOjPyRi1',
        '1sZBzYhrQG40zcSuKkI93c',
        '6wBpO4Xc4YgShnENGSFA1M',
        '3qonjOrhFCfTnaaMruHzxW',
        '2RSHsoi04658QL5xgQVov3',
        '0Ryd8975WihbObpp5cPW1t',
        '27BgDmciSjoxTG0almHTpZ',
        '0t3ZvGKlmYmVsDzBJAXK8C',
        '4umIPjkehX1r7uhmGvXiSV',
        '6HGOxrNik4iPurqStawTFQ',
        '0xaFw2zDYf1rIJWl2dXiSF',
        '5wG3HvLhF6Y5KTGlK0IW3J',
        '7lozLnUfzcgEpMMVQI7yhA',
        '6VXVYATpQXEIoZ97NnWCmn',
        '27Z9T0mSWHYWSj9SNOGvyt',
        '2xLMifQCjDGFmkHkpNLD9h',
        '6M6MZ3rXmrr0usWH14IU6q',
        '3nBGFgfRQ8ujSmu5cGlZIU',
        '4uOBL4DDWWVx4RhYKlPbPC',
        '7D4lgMbSs10AQ0zX3ZldJc',
        '4RxdAzEmkPXTiIU6ULLoXh',
        '3KkXRkHbMCARz0aVfEt68P',
        '0JmnkIqdlnUzPaf8sqBRs3',
        '0AAMnNeIc6CdnfNU85GwCH',
        '39MK3d3fonIP8Mz9oHCTBB',
        '4EWBhKf1fOFnyMtUzACXEc',
        '6Ec5LeRzkisa5KJtwLfOoW',
        '0rOLFkjY5DSIViVBNnzOuK',
        '0t6y8zrSPUVcsqDJXHWvUo',
        '3B54sVLJ402zGa6Xm4YGNe',
        '0y1QJc3SJVPKJ1OvFmFqe6',
        '02Jf3KszL1FB1kG6CILEWE',
        '64rqvMhAPLLEag310IG3z9',
        '3IqcBL5yjJK3ri0TGaL3MC',
        '7ivYWXqrPLs66YwakDuSim',
        '3YctJXK6kznnWl68TnYobN',
        '7jLSThU5Kg1RWt19Leiaxm',
        '6KxgptZSrQC4Vv21ZBOG7S',
        '1gH1h30wkQdd9zhY3j7a8T',
        '0QzuaeCEOV40Pn7IvKEny',
        '3Eb5sztvEMa0Mqnb8DUAlU',
        '1Qrg8KqiBpW07V7PNxwwwL',
        '3iLBFgaQJ94iarMgzrTuWb',
        '4B0JvthVoAAuygILe3n4Bs',
        '3iqlzKw1tLt6tXZyKWV0fZ',
        '5dewQ7ojISR32NAYNHFYWC',
        '2Dzzhb1oV5ckgOjWZLraIB',
        '0d28khcov6AiegSCpG5TuT',
        '4b4oJs9K6vJad1ymkdA024',
        '5xwBIieMMFUmLDgvG4DjFe',
        '5UXJzLFdBn6u9FJTCnoHrH',
        '4xqrdfXkTW4T0RauPLv3WA',
        '6KfoDhO4XUWSbnyKjNp9c4',
        '0kn2gu8Pd03DiYHzRvX2Xk',
        '6me7F0aaZjwDo6RJ5MrfBD',
        '6I3mqTwhRpn34SLVafSH7G',
        '567e29TDzLwZwfDuEpGTwo',
        '1zi7xx7UVEFkmKfv06H8x0',
        '4iJyoBOLtHqaGxP12qzhQI',
        '161DnLWsx1i3u1JT05lzqU',
        '6RUKPb4LETWmmr3iAEQktW',
        '66hayvUbTotekKU3H4ta1f',
        '2nGFzvICaeEWjIrBrL2RAx',
        '0tMMPZEt6Gyrl9FI8zSicm',
        '17iGUekw5nFt5mIRJcUm3R',
        '4KnjQKwfL4kd1hD4jHZ7XT',
        '6b8Be6ljOzmkOmFslEb23P',
        '1N8TTK1Uoy7UvQNUazfUt5',
        '6PGoSes0D9eUDeeAafB2As',
        '74tLlkN3rgVzRqQJgPfink',
        '5XdLHSvaV2SMBj35SVFtfT',
        '4bdzlt280luOgFi0ZlkTvR',
        '6K4t31amVTZDgR3sKmwUJJ',
        '52ojopYMUzeNcudsoz7O9D',
        '76hfruVvmfQbw0eYn1nmeC',
        '4VnDmjYCZkyeqeb0NIKqdA',
        '1A7qPfbcyRVEdcZiwTFhZI',
        '0QIjsbm2fh1cJ45XO9eGqq',
        '1FmdRNbzDEv7iII6Iaxm6g',
        '6F5mZpEEjhsAW8UEqbIpz1',
        '035MzEbx4z2DxuRDymHXbv',
        '3uuR20w7HgLlb5Hha2mCxb',
        '63S5CqzDOTLGo56NMkc8cU',
        '0X2bh8NVQ8svDQIn2AdCbW',
        '3azJifCSqg9fRij2yKIbWz',
        '1lORkxEMmsCZqhoxcmk3A3',
        '21a1k8q3DJtsF8GorRfcL8',
        '6WzRpISELf3YglGAh7TXcG',
        '1JgknGBbrfmEHeOZH051SS',
        '3vkCueOmm7xQDoJ17W1Pm3',
        '48k3HCHPnUuKLok43GUC41',
        '3rUGC1vUpkDG9CZFHMur1t',
        '5x8Gy4R2HMkb1pQ7MLD5Hc',
        '5BE96iX1TLgVHFDJPcKpkp',
        '4jWmhzf53Q0ZvZMuGdiR9x',
        '0M5Vaj3y4yhNQ1PX471F8P',
        '7B909vn7L9vAEdTYjXi7EC',
        '2FRnf9qhLbvw8fu4IBXx78',
        '5BgztqoQ6NHOhNg5yq8SUQ',
        '4m4aQLiPbWFyE07xRoJPhc',
        '2MxFuFt5c2zQ1YUf93RDQt',
        '5Ts1DYOuouQLgzTaisxWYh',
        '4Nw7kywWurWS6ceinn1cHK',
        '29KwH2LEjfWEtiC2jCrLVw',
        '5r5cp9IpziiIsR6b93vcnQ',
        '0mNzElhEofvgMWAJoOA4q9'
    ]

    const [currentTrackId, setCurrentTrackId] = useState<string>('')

    // Select a random track on mount or when track IDs change
    useEffect(() => {
        if (trackIdsArray.length > 0) {
            selectRandomTrack()
        }
    }, [trackIdsArray.join(',')])

    const selectRandomTrack = () => {
        if (trackIdsArray.length > 0) {
            const randomIndex = Math.floor(Math.random() * trackIdsArray.length)
            setCurrentTrackId(trackIdsArray[randomIndex])
        }
    }




    return (
        <div className="space-y-6">
            <div className="card">
                <h2 className="text-2xl sm:text-3xl font-bold text-tavern-800 dark:text-amber-200 mb-4 flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-400 to-amber-500 dark:from-amber-600 dark:to-amber-700 rounded-full flex items-center justify-center shadow-tavern flex-shrink-0">
                        <Music className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    Random Song 🎵
                </h2>
                <p className="text-tavern-700 dark:text-tavern-300 mb-4 sm:mb-6 text-base sm:text-lg">
                    Discover a random song from our curated playlist to help you relax, focus, or boost your mood. 🎶
                </p>

                {/* Spotify Track Embed - Secure, no API calls needed */}
                {currentTrackId && (
                    <div className="bg-parchment-100 dark:bg-tavern-700 rounded-cozy p-4 border-2 border-tavern-300 dark:border-tavern-600">
                        {trackIdsArray.length > 1 && (
                            <div className="mb-3 flex justify-end">
                                <button
                                    onClick={selectRandomTrack}
                                    className="btn-secondary flex items-center gap-2"
                                    title="Get another random song"
                                >
                                    <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                                    <span>Another Song</span>
                                </button>
                            </div>
                        )}
                        <iframe
                            src={`https://open.spotify.com/embed/track/${currentTrackId}`}
                            width="100%"
                            height="352"
                            frameBorder="0"
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            className="rounded-cozy"
                            title="Spotify Track"
                        />
                    </div>
                )}
            </div>

        </div>
    )
}

export default MusicRecommendations

