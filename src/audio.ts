/**
 * Lo-fi Atmospheric Soundscape Generator using Web Audio API
 */
class AmbientSoundscape {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying = false;
  private stopTimeout: number | null = null;
  private nodes: (AudioNode | OscillatorNode | AudioBufferSourceNode)[] = [];

  private initContext() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public play() {
    this.initContext();
    if (!this.ctx) return;

    if (this.stopTimeout) {
      window.clearTimeout(this.stopTimeout);
      this.stopTimeout = null;
    }

    if (this.isPlaying) return;
    this.isPlaying = true;

    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Master gain with smooth fade in
    this.masterGain = ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.0001, now);
    this.masterGain.gain.exponentialRampToValueAtTime(0.2, now + 2.5);
    this.masterGain.connect(ctx.destination);

    // 1. Warm Pink/Brown Noise generator for tape/atmosphere
    const bufferSize = ctx.sampleRate * 3;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0,
      b1 = 0,
      b2 = 0,
      b3 = 0,
      b4 = 0,
      b5 = 0,
      b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.016898;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.035;
      b6 = white * 0.115926;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    // Low-pass filter for the noise
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(280, now);
    noiseFilter.Q.setValueAtTime(1.1, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.1, now);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    noiseSource.start();

    // 2. Harmonic Ambient Chords (Fm9 / Ab / Eb ethereal drone)
    // F2 (87.31), C3 (130.81), Eb3 (155.56), Ab3 (207.65), C4 (261.63), G4 (392.00)
    const frequencies = [87.31, 130.81, 155.56, 207.65, 261.63, 392.0];

    const chordFilter = ctx.createBiquadFilter();
    chordFilter.type = 'lowpass';
    chordFilter.frequency.setValueAtTime(380, now);
    chordFilter.Q.setValueAtTime(1.4, now);

    // Subtle LFO filter sweep (breathing effect)
    const filterLFO = ctx.createOscillator();
    filterLFO.frequency.setValueAtTime(0.07, now); // ~14s period
    const filterLFOGain = ctx.createGain();
    filterLFOGain.gain.setValueAtTime(140, now);
    filterLFO.connect(filterLFOGain);
    filterLFOGain.connect(chordFilter.frequency);
    filterLFO.start();

    chordFilter.connect(this.masterGain);

    const oscillators: OscillatorNode[] = [];
    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      const detune = (Math.sin(idx * 1.7) - 0.5) * 6;
      osc.frequency.setValueAtTime(freq, now);
      osc.detune.setValueAtTime(detune, now);

      const oscGain = ctx.createGain();
      const baseVolume = idx === 0 ? 0.22 : 0.1 / Math.sqrt(idx + 1);
      oscGain.gain.setValueAtTime(baseVolume, now);

      // Add subtle individual tremolo
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.09 + idx * 0.025, now);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(baseVolume * 0.35, now);
      lfo.connect(lfoGain);
      lfoGain.connect(oscGain.gain);
      lfo.start();

      osc.connect(oscGain);
      oscGain.connect(chordFilter);
      osc.start();
      oscillators.push(osc, lfo);
    });

    this.nodes = [noiseSource, filterLFO, ...oscillators];
  }

  public stop() {
    if (!this.isPlaying || !this.ctx || !this.masterGain) return;
    this.isPlaying = false;

    const now = this.ctx.currentTime;
    // Smooth 1.8s fade out
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(Math.max(this.masterGain.gain.value, 0.0001), now);
    this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

    this.stopTimeout = window.setTimeout(() => {
      this.nodes.forEach((node) => {
        if ('stop' in node && typeof (node as OscillatorNode).stop === 'function') {
          try {
            (node as OscillatorNode).stop();
          } catch (_) {}
        }
      });
      this.nodes = [];
    }, 1900);
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }
}

export const ambientSound = new AmbientSoundscape();
