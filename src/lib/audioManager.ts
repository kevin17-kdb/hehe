// Pure Web Audio API Synthesizer Engine for "I Wanna Be Yours" (Arctic Monkeys)
// Generates continuous chords, deep warm bassline, and lead guitar melody directly in browser
// 100% self-contained: works instantly on any computer/phone without external audio downloads!

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isPlaying: boolean = false;
  private loopInterval: number | null = null;

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

  // Play a note with custom oscillator, attack and decay
  private playNote(
    freq: number,
    startTime: number,
    duration: number,
    type: OscillatorType = "sine",
    vol = 0.12
  ) {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);

      // Smooth attack and warm release envelope
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(vol, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      // Warm lowpass filter for dreamy vintage indie sound
      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1200, startTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);
    } catch {}
  }

  // Plays one loop of "I Wanna Be Yours" chord progression & iconic melody
  // Key of Cm: Cm (C-Eb-G) -> Ab (Ab-C-Eb) -> Bb (Bb-D-F) -> Fm (F-Ab-C)
  private playSongMeasure(startTime: number) {
    if (!this.ctx || this.isMuted) return;

    // 1. Deep sub-bass notes (warm indie bass groove)
    const bass = [
      { f: 65.41, t: 0, d: 2.8 },   // C2
      { f: 51.91, t: 3, d: 2.8 },   // Ab1
      { f: 58.27, t: 6, d: 2.8 },   // Bb1
      { f: 43.65, t: 9, d: 2.8 },   // F1
    ];
    bass.forEach((b) => this.playNote(b.f, startTime + b.t, b.d, "triangle", 0.25));

    // 2. Dreamy Rhodes electric piano chords
    const chords = [
      // Cm (t: 0)
      { notes: [130.81, 155.56, 196.0], t: 0, d: 2.7 },
      // Ab (t: 3)
      { notes: [103.83, 130.81, 155.56], t: 3, d: 2.7 },
      // Bb (t: 6)
      { notes: [116.54, 146.83, 174.61], t: 6, d: 2.7 },
      // Fm (t: 9)
      { notes: [87.31, 103.83, 130.81], t: 9, d: 2.7 },
    ];
    chords.forEach((c) => {
      c.notes.forEach((freq) => {
        this.playNote(freq, startTime + c.t, c.d, "sine", 0.08);
      });
    });

    // 3. Iconic Vocal/Guitar Hook ("Secrets I have held in my heart...")
    // [C4 -> Eb4 -> D4 -> C4 -> Bb3 -> C4]
    const leadRiff = [
      { f: 261.63, t: 0.4, d: 0.5 },  // C4
      { f: 311.13, t: 1.0, d: 0.6 },  // Eb4
      { f: 293.66, t: 1.8, d: 0.5 },  // D4
      { f: 261.63, t: 2.4, d: 0.8 },  // C4
      { f: 233.08, t: 3.4, d: 0.6 },  // Bb3
      { f: 261.63, t: 4.2, d: 1.2 },  // C4
      // Repeat echo phrase
      { f: 261.63, t: 6.4, d: 0.5 },  // C4
      { f: 311.13, t: 7.0, d: 0.6 },  // Eb4
      { f: 293.66, t: 7.8, d: 0.5 },  // D4
      { f: 261.63, t: 8.5, d: 1.0 },  // C4
      { f: 233.08, t: 9.6, d: 0.8 },  // Bb3
      { f: 261.63, t: 10.6, d: 1.2 }, // C4
    ];
    leadRiff.forEach((note) => {
      this.playNote(note.f, startTime + note.t, note.d, "triangle", 0.14);
    });
  }

  public playMusic() {
    this.initContext();
    if (!this.ctx || this.isMuted || this.isPlaying) return;

    this.isPlaying = true;
    const loopDurationSec = 12;

    // Start first loop immediately
    const now = this.ctx.currentTime + 0.05;
    this.playSongMeasure(now);

    // Continuous loop interval every 12 seconds
    if (this.loopInterval) window.clearInterval(this.loopInterval);
    this.loopInterval = window.setInterval(() => {
      if (!this.ctx || this.isMuted || !this.isPlaying) return;
      this.playSongMeasure(this.ctx.currentTime);
    }, loopDurationSec * 1000);
  }

  public stopMusic() {
    this.isPlaying = false;
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
    // Resume/start music on user click if browser had paused it
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
