// ====================================================
// SoundFX.js - 中奖音效生成器 (Web Audio API)
// 无需任何外部音频文件，纯代码合成
// ====================================================

const SoundFX = (() => {
    let ctx = null;

    function getCtx() {
        if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
        return ctx;
    }

    // Play a single note
    function playNote(frequency, startTime, duration, volume = 0.4, type = 'sine') {
        const ac = getCtx();
        const osc = ac.createOscillator();
        const gain = ac.createGain();

        osc.connect(gain);
        gain.connect(ac.destination);

        osc.type = type;
        osc.frequency.setValueAtTime(frequency, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(volume, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.start(startTime);
        osc.stop(startTime + duration + 0.05);
    }

    // 🎉 胜利号角 - 在中奖弹窗弹出时播放
    function playWinFanfare() {
        const ac = getCtx();
        const now = ac.currentTime;

        // 上升音阶
        const melody = [
            { freq: 523.25, t: 0.00, dur: 0.15 },   // C5
            { freq: 659.25, t: 0.12, dur: 0.15 },   // E5
            { freq: 783.99, t: 0.24, dur: 0.15 },   // G5
            { freq: 1046.5, t: 0.36, dur: 0.50 },   // C6 (高音长音)
            { freq: 880.00, t: 0.52, dur: 0.15 },   // A5
            { freq: 1046.5, t: 0.64, dur: 0.60 },   // C6 (结尾长音)
        ];

        melody.forEach(n => playNote(n.freq, now + n.t, n.dur, 0.35, 'triangle'));

        // 低音配合
        const bass = [
            { freq: 261.63, t: 0.00, dur: 0.30 },  // C4
            { freq: 329.63, t: 0.24, dur: 0.30 },  // E4
            { freq: 392.00, t: 0.48, dur: 0.50 },  // G4
        ];
        bass.forEach(n => playNote(n.freq, now + n.t, n.dur, 0.20, 'sine'));

        // 打击鼓点节奏
        playDrumBeat(now);
        playDrumBeat(now + 0.25);
        playDrumBeat(now + 0.5);
        playDrumBeat(now + 0.75);
    }

    // 🥁 鼓点音效
    function playDrumBeat(startTime) {
        const ac = getCtx();
        const bufSize = ac.sampleRate * 0.1;
        const buffer = ac.createBuffer(1, bufSize, ac.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufSize, 3);
        }

        const source = ac.createBufferSource();
        source.buffer = buffer;

        const gain = ac.createGain();
        gain.gain.setValueAtTime(0.3, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.1);

        source.connect(gain);
        gain.connect(ac.destination);
        source.start(startTime);
    }

    // 🎰 滚动中的嘀嗒声
    function playTick() {
        const ac = getCtx();
        const now = ac.currentTime;
        playNote(1200, now, 0.03, 0.06, 'square');
    }

    return { playWinFanfare, playTick };
})();

window.SoundFX = SoundFX;
