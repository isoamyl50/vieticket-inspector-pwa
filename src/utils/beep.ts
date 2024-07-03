
export function beep(succeed: boolean = true) {
    succeed ? playBeep(1000, 0.059) : playBeep(220, 0.048, 5, 96);
}

const playBeep = (frequency: number, duration: number, repeat: number = 1, interval: number = 100) => {
    const audioContext = new (window.AudioContext)();
    let startTime = audioContext.currentTime;

    const playSingleBeep = (time: number) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = 'square';
        oscillator.frequency.value = frequency;

        gainNode.gain.setValueAtTime(0, time);
        gainNode.gain.linearRampToValueAtTime(1, time + 0.01);
        gainNode.gain.linearRampToValueAtTime(0, time + duration);

        oscillator.start(time);
        oscillator.stop(time + duration);
    };

    for (let i = 0; i < repeat; i++) {
        playSingleBeep(startTime + i * (interval / 1000));
    }
};