// Clean Audio Engine: Exclusively plays the authentic Arctic Monkeys "I Wanna Be Yours" MP3!
// All synthetic chords, background ambient noise, and extra pads removed completely.

class SoundManager {
  private isMuted: boolean = false;
  private isPlaying: boolean = false;

  public playMusic() {
    if (this.isMuted) return;
    if (typeof window !== "undefined") {
      const audio = document.getElementById("bg-music-player") as HTMLAudioElement | null;
      if (audio) {
        audio.volume = 0.8;
        audio.play().then(() => {
          this.isPlaying = true;
        }).catch(() => {
          // Awaiting user interaction
        });
      }
    }
  }

  public stopMusic() {
    this.isPlaying = false;
    if (typeof window !== "undefined") {
      const audio = document.getElementById("bg-music-player") as HTMLAudioElement | null;
      if (audio) {
        audio.pause();
      }
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

  // Silent ambient hook: does NOT play any synthesizers or extra sounds
  public playAmbient(
    _theme?: "ocean" | "aurora" | "sakura" | "waterfall" | "rain" | "quiet"
  ) {
    if (!this.isPlaying && !this.isMuted) {
      this.playMusic();
    }
  }

  // Chime handler only for subtle button clicks if needed, without background drone
  public playChime(
    _type: "success" | "hint" | "click" | "heartbeat" | "error" = "click"
  ) {
    if (!this.isPlaying && !this.isMuted) {
      this.playMusic();
    }
  }
}

export const soundManager = new SoundManager();
