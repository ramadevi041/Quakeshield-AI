// Self-contained Web Audio API synthesizer for emergency sirens and countdown beeps
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Plays an emergency early warning siren pulse (two-tone attention signal)
 */
export function playEmergencyAlertSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    // Frequency oscillation: 880Hz to 660Hz alarm sweep
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(660, now + 0.25);
    osc.frequency.setValueAtTime(880, now + 0.3);
    osc.frequency.exponentialRampToValueAtTime(660, now + 0.55);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.65);
  } catch (e) {
    console.warn('Audio alert playback not permitted or supported:', e);
  }
}

/**
 * Plays a discrete countdown tick for the S-wave arrival countdown
 */
export function playCountdownBeep(isFinal: boolean = false) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(isFinal ? 1200 : 750, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(isFinal ? 0.35 : 0.15, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + (isFinal ? 0.4 : 0.1));

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + (isFinal ? 0.45 : 0.15));
  } catch (e) {
    // Ignore audio permission error
  }
}

/**
 * Synthesizes a deep sub-bass rumble representing ground motion tremor
 */
export function playSimulatedTremorRumble(durationSeconds: number = 3) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(45, now);
    osc.frequency.linearRampToValueAtTime(32, now + durationSeconds);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.4);
    gain.gain.linearRampToValueAtTime(0.2, now + durationSeconds - 0.5);
    gain.gain.exponentialRampToValueAtTime(0.001, now + durationSeconds);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + durationSeconds + 0.1);
  } catch (e) {
    // Ignore
  }
}
