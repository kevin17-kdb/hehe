// Ambient, Sound Effects & "I Wanna Be Yours" background music engine
// Uses standard Web Audio API & HTML5 Audio Element for seamless playback

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private currentAmbientNode: { stop: () => void } | null = null;
  private bgMusic: HTMLAudioElement | null = null;
  private isMusicPlaying: boolean = false;

  constructor() {
    if (typeof window !== "undefined") {
      this.initMusicElement();
    }
  }

  private initMusicElement() {
    if (!this.bgMusic && typeof window !== "undefined") {
      this.bgMusic = new Audio("/music/i_wanna_be_yours.mp3");
      this.bgMusic.loop = true;
      this.bgMusic.volume = 0.45;
    }
  }

  private initContext() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public playMusic() {
    if (this.isMuted) return;
    this.initMusicElement();
    if (this.bgMusic) {
      this.bgMusic.play().then(() => {
        this.isMusicPlaying = true;
      }).catch(() => {
        // Handled when user clicks or interacts
      });
    }
  }

  public pauseMusic() {
    if (this.bgMusic) {
      this.bgMusic.pause();
      this.isMusicPlaying = false;
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      if (this.bgMusic) this.bgMusic.pause();
      if (this.currentAmbientNode) {
        this.currentAmbientNode.stop();
        this.currentAmbientNode = null;
      }
    } else {
      if (this.bgMusic) {
        this.bgMusic.play().catch(() => {});
        this.isMusicPlaying = true;
      }
    }
  }

  public getMuted() {
    return this.isMuted;
  }

  public getIsMusicPlaying() {
    return this.isMusicPlaying;
  }

  // Play subtle UI chime sounds
  public playChime(type: "success" | "hint" | "click" | "heartbeat" | "error" = "click") {
    // Automatically trigger music on first user interaction if not started yet
    if (!this.isMusicPlaying && !this.isMuted) {
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
    } else if (type === "hint") {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.25);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === "error") {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.18);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
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

  // Synthesizes the memorable, dreamy riff of "I Wanna Be Yours" (Arctic Monkeys)
  // [C - Eb - G - Bb - C rhythm / bassline]
  public playSynthesizedIWannaBeYours() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    // Riff melody sequence for "I Wanna Be Yours"
    const notes = [
      { freq: 130.81, dur: 0.8 }, // C3
      { freq: 155.56, dur: 0.4 }, // Eb3
      { freq: 174.61, dur: 0.6 }, // F3
      { freq: 196.00, dur: 0.8 }, // G3
      { freq: 233.08, dur: 0.5 }, // Bb3
      { freq: 261.63, dur: 1.2 }, // C4
    ];

    let timeOffset = 0;
    notes.forEach((note) => {
      if (!this.ctx) return;
      const startTime = this.ctx.currentTime + timeOffset;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(note.freq, startTime);
      gain.gain.setValueAtTime(0.08, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + note.dur);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + note.dur + 0.05);
      timeOffset += note.dur + 0.1;
    });
  }

  // Ambient playback hook for scenes (safely plays music and atmospheric ambient)
  public playAmbient(theme?: "ocean" | "aurora" | "sakura" | "waterfall" | "rain" | "quiet") {
    if (!this.isMusicPlaying && !this.isMuted) {
      this.playMusic();
    }
    if (theme === "sakura" || theme === "quiet") {
      this.playSynthesizedIWannaBeYours();
    }
  }
}

export const soundManager = new SoundManager();
