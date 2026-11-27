type SoundName = 'click' | 'buy' | 'upgrade' | 'golden' | 'achievement' | 'prestige';

let context: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!context) {
    const Ctor = window.AudioContext
      ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    context = new Ctor();
  }
  if (context.state === 'suspended') void context.resume();
  return context;
}

function tone(frequency: number, duration: number, type: OscillatorType, volume: number, delay = 0): void {
  const ctx = getContext();
  if (!ctx) return;
  const start = ctx.currentTime + delay;
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain).connect(ctx.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
}

export function playSound(name: SoundName, enabled: boolean): void {
  if (!enabled) return;
  switch (name) {
    case 'click':
      tone(340 + Math.random() * 90, 0.07, 'triangle', 0.035);
      break;
    case 'buy':
      tone(440, 0.09, 'square', 0.03);
      tone(660, 0.09, 'square', 0.025, 0.06);
      break;
    case 'upgrade':
      tone(523, 0.12, 'triangle', 0.04);
      tone(784, 0.16, 'triangle', 0.035, 0.09);
      break;
    case 'golden':
      tone(660, 0.14, 'sine', 0.05);
      tone(880, 0.14, 'sine', 0.05, 0.1);
      tone(1320, 0.24, 'sine', 0.045, 0.2);
      break;
    case 'achievement':
      tone(523, 0.12, 'sine', 0.04);
      tone(659, 0.12, 'sine', 0.04, 0.1);
      tone(784, 0.2, 'sine', 0.04, 0.2);
      break;
    case 'prestige':
      tone(220, 0.4, 'sawtooth', 0.03);
      tone(330, 0.4, 'sawtooth', 0.03, 0.12);
      tone(440, 0.5, 'sawtooth', 0.03, 0.24);
      break;
  }
}
