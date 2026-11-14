// A few small synthesised sounds. No audio files, and nothing plays until
// the player has interacted with the page.

import { store } from './store.js';

let ctx = null;
let enabled = store.getSetting('sound', true) !== false;

function audio() {
  if (!enabled) return null;
  try {
    if (!ctx) {
      const Ctor = window.AudioContext || window.webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone({ from, to = from, dur = 0.15, type = 'sine', gain = 0.06, delay = 0 }) {
  const ac = audio();
  if (!ac) return;
  try {
    const t = ac.currentTime + delay;
    const osc = ac.createOscillator();
    const amp = ac.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(from, t);
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, to), t + dur);
    amp.gain.setValueAtTime(0.0001, t);
    amp.gain.exponentialRampToValueAtTime(gain, t + 0.012);
    amp.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(amp).connect(ac.destination);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  } catch {
    // Sound is a nicety; never let it break a shot.
  }
}

function noise({ dur = 0.2, gain = 0.05, cutoff = 1800, delay = 0 }) {
  const ac = audio();
  if (!ac) return;
  try {
    const t = ac.currentTime + delay;
    const length = Math.max(1, Math.floor(ac.sampleRate * dur));
    const buffer = ac.createBuffer(1, length, ac.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length);
    const src = ac.createBufferSource();
    src.buffer = buffer;
    const filter = ac.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = cutoff;
    const amp = ac.createGain();
    amp.gain.value = gain;
    src.connect(filter).connect(amp).connect(ac.destination);
    src.start(t);
  } catch {
    // As above.
  }
}

export const sfx = {
  get enabled() {
    return enabled;
  },
  setEnabled(on) {
    enabled = Boolean(on);
    store.setSetting('sound', enabled);
  },
  swing() {
    noise({ dur: 0.16, gain: 0.05, cutoff: 2600 });
    tone({ from: 260, to: 520, dur: 0.09, type: 'triangle', gain: 0.05, delay: 0.05 });
  },
  putt() {
    tone({ from: 420, to: 380, dur: 0.07, type: 'triangle', gain: 0.05 });
  },
  land() {
    tone({ from: 150, to: 90, dur: 0.12, gain: 0.07 });
  },
  sand() {
    noise({ dur: 0.22, gain: 0.05, cutoff: 900 });
  },
  splash() {
    noise({ dur: 0.38, gain: 0.07, cutoff: 1400 });
    tone({ from: 500, to: 120, dur: 0.3, gain: 0.03 });
  },
  lost() {
    tone({ from: 220, to: 110, dur: 0.3, type: 'triangle', gain: 0.06 });
  },
  holed() {
    [523, 659, 784, 1047].forEach((f, i) => tone({ from: f, dur: 0.16, type: 'triangle', gain: 0.06, delay: i * 0.09 }));
  },
  bad() {
    tone({ from: 190, to: 150, dur: 0.12, type: 'square', gain: 0.025 });
  },
};
