/**
 * Local script to extract track IDs from a Spotify playlist
 * Run this locally with: npm run extract-tracks
 * 
 * This script is safe to run locally - it won't be deployed
 */

import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

async function extractPlaylistId(input) {
    // Check if it's a URL
    const urlMatch = input.match(/playlist\/([a-zA-Z0-9]+)/);
    if (urlMatch) {
        return urlMatch[1];
    }
    // Check if it's already just an ID
    if (/^[a-zA-Z0-9]{22}$/.test(input)) {
        return input;
    }
    return null;
}

async function fetchPlaylistTracks(playlistId, token) {
    try {
        const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = `Failed to fetch playlist: ${response.status} ${response.statusText}`;
            
            if (response.status === 401) {
                errorMessage = 'Invalid or expired token. Please get a new token from Spotify Developer Dashboard.';
            } else if (response.status === 403) {
                errorMessage = 'Access forbidden. Make sure your playlist is public and your token has the right permissions.';
            } else if (response.status === 404) {
                errorMessage = 'Playlist not found. Check your playlist ID.';
            }
            
            console.error('Response error:', errorText);
            throw new Error(errorMessage);
        }

        const data = await response.json();
        
        // Debug: log the response structure
        if (!data || !data.items) {
            console.error('Unexpected response structure:', JSON.stringify(data, null, 2));
            throw new Error('Unexpected response format from Spotify API');
        }

        // Handle pagination - fetch all tracks
        let allTracks = [...data.items];
        let nextUrl = data.next;

        // Fetch remaining pages if any
        while (nextUrl) {
            const nextResponse = await fetch(nextUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!nextResponse.ok) {
                break; // Stop if we hit an error
            }

            const nextData = await nextResponse.json();
            allTracks = [...allTracks, ...nextData.items];
            nextUrl = nextData.next;
        }

        return allTracks
            .map(item => item.track)
            .filter(track => track !== null)
            .map(track => track.id);
    } catch (error) {
        throw error;
    }
}

async function main() {
    console.log('\n🎵 Spotify Track ID Extractor\n');
    console.log('This script will help you extract track IDs from your playlist.');
    console.log('Your token will only be used locally and never deployed.\n');

    const playlistInput = await question('Enter your Spotify Playlist ID or URL: ');
    const playlistId = await extractPlaylistId(playlistInput.trim());

    if (!playlistId) {
        console.error('\n❌ Invalid playlist ID or URL. Please try again.');
        rl.close();
        return;
    }

    const token = await question('\nEnter your Spotify Access Token (get from https://developer.spotify.com/dashboard): ');
    
    if (!token.trim()) {
        console.error('\n❌ Token is required.');
        rl.close();
        return;
    }

    console.log('\n⏳ Fetching tracks from playlist...\n');

    try {
        const trackIds = await fetchPlaylistTracks(playlistId, token.trim());
        
        if (trackIds.length === 0) {
            console.log('❌ No tracks found in playlist.');
            rl.close();
            return;
        }

        console.log(`✅ Found ${trackIds.length} tracks!\n`);
        console.log('📋 Track IDs (comma-separated):\n');
        console.log(trackIds.join(','));
        console.log('\n📝 Add this to your .env file:');
        console.log(`VITE_SPOTIFY_TRACK_IDS=${trackIds.join(',')}\n`);
        console.log('💡 Or use individual track IDs:');
        trackIds.forEach((id, index) => {
            console.log(`Track ${index + 1}: ${id}`);
        });
        console.log('\n✅ Done! Remember: Never commit your .env file or token to git!\n');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error('\nMake sure:');
        console.error('1. Your playlist is public');
        console.error('2. Your token is valid and not expired');
        console.error('3. You have internet connection\n');
    }

    rl.close();
}

main();

