export class AudioEngine {
  private audioContext: AudioContext | null = null;
  private tickInterval: number | null = null;
  private isPlaying = false;
  private boomBuffer: AudioBuffer | null = null;
  private isInitialized = false;

  // Must be called from a direct user gesture (click/tap handler)
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();

      // Resume immediately in the user gesture
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      await this.loadBoomSound();
      this.isInitialized = true;
    }
  }

  private async loadBoomSound(): Promise<void> {
    if (!this.audioContext) return;

    try {
      const response = await fetch('/audio/boom.mp3');
      const arrayBuffer = await response.arrayBuffer();
      this.boomBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    } catch (error) {
      console.warn('Could not load boom sound, using synthesized sound:', error);
    }
  }

  private ensureContext(): AudioContext | null {
    if (!this.audioContext) return null;

    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    return this.audioContext;
  }

  playTick(intensity: number): void {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Higher pitch as intensity increases (400Hz to 800Hz)
    const frequency = 400 + intensity * 400;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    oscillator.type = 'square';

    // Volume increases with intensity (0.1 to 0.3)
    const volume = 0.1 + intensity * 0.2;
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.1);
  }

  playBoom(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;

    // Play loaded audio file if available
    if (this.boomBuffer) {
      const source = ctx.createBufferSource();
      source.buffer = this.boomBuffer;

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(1, ctx.currentTime);

      source.connect(gainNode);
      gainNode.connect(ctx.destination);
      source.start(ctx.currentTime);
      return;
    }

    // Fallback: synthesized explosion sound
    const bufferSize = ctx.sampleRate * 0.5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(500, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.5);

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.8, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    noise.start(ctx.currentTime);
    noise.stop(ctx.currentTime + 0.5);

    const oscillator = ctx.createOscillator();
    const bassGain = ctx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(80, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 0.3);

    bassGain.gain.setValueAtTime(0.6, ctx.currentTime);
    bassGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

    oscillator.connect(bassGain);
    bassGain.connect(ctx.destination);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.3);
  }

  startTickingLoop(getIntensity: () => number): void {
    if (this.isPlaying || !this.isInitialized) return;
    this.isPlaying = true;

    const tick = () => {
      if (!this.isPlaying) return;

      const currentIntensity = getIntensity();
      this.playTick(currentIntensity);

      // Tick interval: 1000ms at intensity 0, down to 100ms at intensity 1
      const interval = Math.max(100, 1000 - currentIntensity * 900);

      this.tickInterval = window.setTimeout(tick, interval);
    };

    tick();
  }

  stopTicking(): void {
    this.isPlaying = false;
    if (this.tickInterval) {
      clearTimeout(this.tickInterval);
      this.tickInterval = null;
    }
  }

  dispose(): void {
    this.stopTicking();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.isInitialized = false;
  }
}

let audioEngineInstance: AudioEngine | null = null;

export function getAudioEngine(): AudioEngine {
  if (!audioEngineInstance) {
    audioEngineInstance = new AudioEngine();
  }
  return audioEngineInstance;
}
