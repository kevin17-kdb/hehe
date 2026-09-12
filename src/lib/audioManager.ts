// Ambient and sound effects synthesis using standard Web Audio API
// Runs smoothly on all browsers without external audio asset downloads

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private currentAmbientNode: { stop: () => void } | null = null;

  private initContext() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.currentAmbientNode) {
      this.currentAmbientNode.stop();
      this.currentAmbientNode = null;
    }
  }

  public getMuted() {
    return this.isMuted;
  }

  // Play subtle UI chime sounds
  public playChime(type: "success" | "hint" | "click" | "heartbeat" | "error" = "click") {
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
      // Sub-bass double pulse
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

  // Play ambient synthesized soundscapes for each world
  public playAmbient(theme: "ocean" | "aurora" | "sakura" | "waterfall" | "rain" | "quiet") {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    if (this.currentAmbientNode) {
      this.currentAmbientNode.stop();
      this.currentAmbientNode = null;
    }

    try {
      // Pink/White noise generator for waves/rain/waterfall
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Pink noise filtering
        lastOut = (lastOut * 0.95) + (white * 0.05);
        data[i] = lastOut;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      if (theme === "ocean") {
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(450, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
        
        // Gentle wave modulation with LFO
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime);
        lfoGain.gain.setValueAtTime(250, this.ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        lfo.start();

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start();

        this.currentAmbientNode = {
          stop: () => {
            try {
              noise.stop();
              lfo.stop();
            } catch {}
          }
        };
      } else if (theme === "rain") {
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(1200, this.ctx.currentTime);
        filter.Q.setValueAtTime(0.8, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.07, this.ctx.currentTime);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start();

        this.currentAmbientNode = {
          stop: () => {
            try { noise.stop(); } catch {}
          }
        };
      } else if (theme === "waterfall") {
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(900, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.09, this.ctx.currentTime);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start();

        this.currentAmbientNode = {
          stop: () => {
            try { noise.stop(); } catch {}
          }
        };
      } else if (theme === "aurora" || theme === "sakura") {
        // Ethereal chord pad
        const baseFreq = theme === "aurora" ? 220 : 261.63;
        const freqs = [baseFreq, baseFreq * 1.25, baseFreq * 1.5, baseFreq * 1.875];
        const oscs: OscillatorNode[] = [];
        const padGain = this.ctx.createGain();
        padGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

        freqs.forEach(f => {
          if (!this.ctx) return;
          const o = this.ctx.createOscillator();
          o.type = "sine";
          o.frequency.setValueAtTime(f, this.ctx.currentTime);
          o.connect(padGain);
          o.start();
          oscs.push(o);
        });
        padGain.connect(this.ctx.destination);

        this.currentAmbientNode = {
          stop: () => {
            oscs.forEach(o => {
              try { o.stop(); } catch {}
            });
          }
        };
      }
    } catch {
      // Graceful fallback if audio context blocked by browser autoplay
    }
  }
}

export const soundManager = new SoundManager();
