/* Tiny 8-bit sound engine using the Web Audio API.
   No external files — every blip and jingle is synthesized. */
const Sound = (() => {
  let ctx = null;
  let muted = false;

  function ensure() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) ctx = new AC();
    }
    // Browsers suspend audio until a user gesture; resume on demand.
    if (ctx && ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  // Play a single square-wave note.
  function note(freq, dur = 0.08, type = "square", vol = 0.12, when = 0) {
    if (muted) return;
    const c = ensure();
    if (!c) return;
    const t0 = c.currentTime + when;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(vol, t0);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain).connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + dur);
  }

  // Play a sequence: [ [freq, dur], ... ]
  function seq(notes, type = "square", vol = 0.12) {
    let t = 0;
    for (const [f, d] of notes) {
      if (f > 0) note(f, d * 0.95, type, vol, t);
      t += d;
    }
  }

  const N = { // a few useful frequencies
    C4: 261, D4: 294, E4: 330, F4: 349, G4: 392, A4: 440, B4: 494,
    C5: 523, D5: 587, E5: 659, G5: 784, C6: 1046,
  };

  return {
    toggleMute() { muted = !muted; return muted; },
    isMuted() { return muted; },
    resume() { ensure(); },

    blip()    { note(660, 0.03, "square", 0.05); },      // text typing
    move()    { note(330, 0.04, "square", 0.06); },      // menu move
    select()  { seq([[N.G4, 0.06], [N.C5, 0.10]]); },    // confirm
    back()    { seq([[N.C5, 0.05], [N.G4, 0.08]]); },    // cancel
    correct() { seq([[N.C5, 0.08], [N.E5, 0.08], [N.G5, 0.14]]); },
    wrong()   { seq([[220, 0.12], [180, 0.18]], "sawtooth", 0.12); },
    hit()     { note(150, 0.10, "sawtooth", 0.16); },
    sling()   { seq([[N.G4, 0.04], [N.C6, 0.06]], "square", 0.10); },
    victory() {
      seq([[N.C5, 0.10], [N.E5, 0.10], [N.G5, 0.10], [N.C6, 0.22]], "square", 0.13);
    },
    sad() {
      seq([[N.E4, 0.16], [N.D4, 0.16], [N.C4, 0.30]], "triangle", 0.13);
    },
    fanfare() {
      seq([[N.C5, 0.12], [N.C5, 0.10], [N.C5, 0.10], [N.E5, 0.22],
           [N.G5, 0.12], [N.C6, 0.30]], "square", 0.13);
    },
  };
})();
