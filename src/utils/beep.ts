/**
 * Plays a beep sound or an audio file indicating success or failure.
 * @param succeed - A boolean indicating whether the beep should indicate success or failure. Default is true.
 */
export function beep(succeed: boolean = true) {
    const audioPath = succeed ? '/assets/audio/success.mp3' : '/assets/audio/failure.mp3';
    const audio = new Audio(audioPath);
    audio.play().catch(error => {
        if (error.name === 'NotAllowedError') {
            // NOOP if the browser blocks the audio autoplay
        } else {
            console.error('Error playing audio:', error);
        }
    });
}