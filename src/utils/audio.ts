// Ambient boutique audio synthesizer using Web Audio API (no external file dependencies)
class BoutiqueAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private isPlaying: boolean = false;
  private intervalId: any = null;

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  public play() {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      this.masterGain.gain.exponentialRampToValueAtTime(0.08, this.ctx.currentTime + 3);
      this.masterGain.connect(this.ctx.destination);

      // Root Sa & Pa tanpura drone chords (D3 = ~146.8Hz, A3 = ~220Hz, D4 = ~293.6Hz)
      const baseFreqs = [146.83, 220.0, 293.66, 440.0];
      this.oscillators = baseFreqs.map((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const oscGain = this.ctx!.createGain();

        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime);

        // Subtly detune for natural acoustic resonance
        osc.detune.setValueAtTime((i - 1.5) * 5, this.ctx!.currentTime);

        oscGain.gain.value = 0.25 / (i + 1);
        osc.connect(oscGain);
        oscGain.connect(this.masterGain!);

        osc.start();
        return osc;
      });

      // Periodically trigger a delicate acoustic chime note (Bilahari / Yaman raga notes)
      const ragaNotes = [293.66, 329.63, 369.99, 440.0, 493.88, 587.33];
      this.intervalId = setInterval(() => {
        if (!this.ctx || this.ctx.state === 'suspended') return;
        const note = ragaNotes[Math.floor(Math.random() * ragaNotes.length)];
        const chime = this.ctx.createOscillator();
        const chimeGain = this.ctx.createGain();

        chime.type = 'sine';
        chime.frequency.setValueAtTime(note, this.ctx.currentTime);

        chimeGain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        chimeGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 4.5);

        chime.connect(chimeGain);
        chimeGain.connect(this.ctx.destination);

        chime.start();
        chime.stop(this.ctx.currentTime + 5);
      }, 3500);

      this.isPlaying = true;
    } catch (e) {
      console.warn('Web Audio playback failed or blocked:', e);
    }
  }

  public stop() {
    try {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1);
        setTimeout(() => {
          this.oscillators.forEach((osc) => {
            try {
              osc.stop();
              osc.disconnect();
            } catch (_) {}
          });
          this.oscillators = [];
          if (this.ctx && this.ctx.state !== 'closed') {
            this.ctx.close();
          }
          this.isPlaying = false;
        }, 1100);
      } else {
        this.isPlaying = false;
      }
    } catch (e) {
      this.isPlaying = false;
    }
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }
}

export const boutiqueAudio = new BoutiqueAudioEngine();
