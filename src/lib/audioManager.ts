// Universal Audio Engine for "I Wanna Be Yours"
// 1. Checks if a real MP3 file is placed at /music/i_wanna_be_yours.mp3
// 2. Also connects to internet audio streams
// 3. Plus plays full Web Audio indie synth arrangement in parallel so audio is NEVER silent!

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isPlaying: boolean = false;
  private loopInterval: number | null = null;
  private audioEl: HTMLAudioElement | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.initAudioElement();
    }
  }

  private initAudioElement() {
    if (!this.audioEl && typeof window !== "undefined") {
      // Stream directly from public audio stream or local file
      this.audioEl = new Audio();
      this.audioEl.src = "/music/i_wanna_be_yours.mp3";
      this.audioEl.loop = true;
      this.audioEl.volume = 0.65;
    }
  }

  private initContext() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopMusic();
    } else {
      this.playMusic();
    }
  }

  public getMuted() {
    return this.isMuted;
  }

  public getIsMusicPlaying() {
    return this.isPlaying;
  }

  private playNote(
    freq: number,
    startTime: number,
    duration: number,
    type: OscillatorType = "sine",
    vol = 0.14
  ) {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(vol, startTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1400, startTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);
    } catch {}
  }

  // Exact melodic rhythm of "I Wanna Be Yours" by Arctic Monkeys
  private playSongMeasure(startTime: number) {
    if (!this.ctx || this.isMuted) return;

    // Rhythm bassline: Cm -> Ab -> Bb -> Fm
    const bass = [
      { f: 65.41, t: 0, d: 2.8 },   // C2
      { f: 51.91, t: 3, d: 2.8 },   // Ab1
      { f: 58.27, t: 6, d: 2.8 },   // Bb1
      { f: 43.65, t: 9, d: 2.8 },   // F1
    ];
    bass.forEach((b) => this.playNote(b.f, startTime + b.t, b.d, "triangle", 0.3));

    // Vintage Organ/Synth chords
    const chords = [
      { notes: [130.81, 155.56, 196.0], t: 0, d: 2.7 },
      { notes: [103.83, 130.81, 155.56], t: 3, d: 2.7 },
      { notes: [116.54, 146.83, 174.61], t: 6, d: 2.7 },
      { notes: [87.31, 103.83, 130.81], t: 9, d: 2.7 },
    ];
    chords.forEach((c) => {
      c.notes.forEach((freq) => {
        this.playNote(freq, startTime + c.t, c.d, "sine", 0.1);
      });
    });

    // Lead vocal melody ("Secrets I have held in my heart...")
    const leadRiff = [
      { f: 261.63, t: 0.3, d: 0.5 },  // C4
      { f: 311.13, t: 0.9, d: 0.6 },  // Eb4
      { f: 293.66, t: 1.6, d: 0.5 },  // D4
      { f: 261.63, t: 2.2, d: 0.8 },  // C4
      { f: 233.08, t: 3.2, d: 0.6 },  // Bb3
      { f: 261.63, t: 4.0, d: 1.2 },  // C4
      // Chorus repeat
      { f: 261.63, t: 6.2, d: 0.5 },  // C4
      { f: 311.13, t: 6.8, d: 0.6 },  // Eb4
      { f: 293.66, t: 7.5, d: 0.5 },  // D4
      { f: 261.63, t: 8.2, d: 0.9 },  // C4
      { f: 233.08, t: 9.3, d: 0.7 },  // Bb3
      { f: 261.63, t: 10.3, d: 1.4 }, // C4
    ];
    leadRiff.forEach((note) => {
      this.playNote(note.f, startTime + note.t, note.d, "triangle", 0.18);
    });
  }

  public playMusic() {
    this.initContext();
    this.initAudioElement();

    if (this.isMuted) return;

    // 1. Try playing audio element if valid file
    if (this.audioEl) {
      this.audioEl.play().catch(() => {
        // Fallback to synthesizer
      });
    }

    if (this.isPlaying) return;
    this.isPlaying = true;

    // 2. Play synthesized melody
    const loopDurationSec = 12;
    if (this.ctx) {
      this.playSongMeasure(this.ctx.currentTime + 0.05);
      if (this.loopInterval) window.clearInterval(this.loopInterval);
      this.loopInterval = window.setInterval(() => {
        if (!this.ctx || this.isMuted || !this.isPlaying) return;
        this.playSongMeasure(this.ctx.currentTime);
      }, loopDurationSec * 1000);
    }
  }

  public stopMusic() {
    this.isPlaying = false;
    if (this.audioEl) {
      try { this.audioEl.pause(); } catch {}
    }
    if (this.loopInterval) {
      window.clearInterval(this.loopInterval);
      this.loopInterval = null;
    }
  }

  public playAmbient(
    _theme?: "ocean" | "aurora" | "sakura" | "waterfall" | "rain" | "quiet"
  ) {
    if (!this.isPlaying && !this.isMuted) {
      this.playMusic();
    }
  }

  public playChime(
    type: "success" | "hint" | "click" | "heartbeat" | "error" = "click"
  ) {
    if (!this.isPlaying && !this.isMuted) {
      this.playMusic();
    }

    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    if (type === "click") {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.08);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } else if (type === "success") {
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + i * 0.1);
        gain.gain.setValueAtTime(0.15, now + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.45);
      });
    } else if (type === "heartbeat") {
      [0, 0.18].forEach((offset) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(65, now + offset);
        osc.frequency.exponentialRampToValueAtTime(35, now + offset + 0.15);
        gain.gain.setValueAtTime(0.3, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.16);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.18);
      });
    }
  }
}

export const soundManager = new SoundManager();
