/**
 * audio.js - Web Audio API Polyphonic Synth and Progression Sequencer
 * High-quality sound synthesis for single notes, chords, and rhythmic loops.
 */

const AudioEngine = (() => {
  let audioCtx = null;
  let masterGain = null;
  let reverbNode = null;
  let isPlayingSequence = false;
  let sequenceTimeouts = [];
  let currentBpm = 100;
  let soundPreset = 'warm_keys'; // 'warm_keys', 'bright_piano', 'ambient_pad', 'acoustic_guitar'

  // Frequency calculation from MIDI note number (A4 = 69 = 440Hz)
  function midiToFreq(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  // Pitch (0-11) and Octave to MIDI note
  function pitchToMidi(pitch, octave = 4) {
    return (octave + 1) * 12 + ((pitch % 12 + 12) % 12);
  }

  // Initialize Web Audio Context (lazy-loaded on first user gesture)
  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();

      // Master Gain
      masterGain = audioCtx.createGain();
      masterGain.gain.value = 0.45;

      // Compressor to avoid clipping and give rich, polished dynamics
      const compressor = audioCtx.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-18, audioCtx.currentTime);
      compressor.knee.setValueAtTime(12, audioCtx.currentTime);
      compressor.ratio.setValueAtTime(4, audioCtx.currentTime);
      compressor.attack.setValueAtTime(0.005, audioCtx.currentTime);
      compressor.release.setValueAtTime(0.15, audioCtx.currentTime);

      // Simple algorithmic pseudo-reverb using delay feedback network
      const delay = audioCtx.createDelay();
      delay.delayTime.value = 0.18;
      const delayGain = audioCtx.createGain();
      delayGain.gain.value = 0.28;
      const delayFilter = audioCtx.createBiquadFilter();
      delayFilter.type = 'lowpass';
      delayFilter.frequency.value = 2400;

      delay.connect(delayGain);
      delayGain.connect(delayFilter);
      delayFilter.connect(delay);
      delayFilter.connect(compressor);

      masterGain.connect(compressor);
      masterGain.connect(delay);
      compressor.connect(audioCtx.destination);
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    return audioCtx;
  }

  // Play a single note with rich multi-oscillator synthesis & ADSR envelope
  function playNote(pitch, octave = 4, duration = 1.2, timeOffset = 0, velocity = 0.8) {
    const ctx = initAudio();
    const startTime = ctx.currentTime + timeOffset;
    const midi = pitchToMidi(pitch, octave);
    const freq = midiToFreq(midi);

    // Note Gain Envelope
    const noteGain = ctx.createGain();
    noteGain.gain.setValueAtTime(0.0001, startTime);

    // Lowpass filter for tone color
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';

    if (soundPreset === 'warm_keys') {
      // Warm Rhodes / Electric Piano Tone
      filter.frequency.setValueAtTime(1800, startTime);
      filter.frequency.exponentialRampToValueAtTime(700, startTime + duration);

      // Osc 1: Fundamental Sine
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, startTime);

      // Osc 2: Triangle with slight sub-harmonic/detune
      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 2, startTime);
      const osc2Gain = ctx.createGain();
      osc2Gain.gain.value = 0.25;

      // ADSR Envelope
      noteGain.gain.linearRampToValueAtTime(velocity * 0.7, startTime + 0.015);
      noteGain.gain.exponentialRampToValueAtTime(velocity * 0.35, startTime + 0.3);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc1.connect(noteGain);
      osc2.connect(osc2Gain);
      osc2Gain.connect(noteGain);
      noteGain.connect(filter);
      filter.connect(masterGain);

      osc1.start(startTime);
      osc2.start(startTime);
      osc1.stop(startTime + duration + 0.05);
      osc2.stop(startTime + duration + 0.05);

    } else if (soundPreset === 'bright_piano') {
      // Acoustic Piano Emulation
      filter.frequency.setValueAtTime(3200, startTime);
      filter.frequency.exponentialRampToValueAtTime(1000, startTime + duration);

      const osc1 = ctx.createOscillator();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(freq, startTime);

      const osc2 = ctx.createOscillator();
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(freq * 1.002, startTime); // subtle chorus detune
      const osc2Gain = ctx.createGain();
      osc2Gain.gain.value = 0.12;

      // Hammer transient click
      const click = ctx.createOscillator();
      click.type = 'square';
      click.frequency.setValueAtTime(freq * 4, startTime);
      const clickGain = ctx.createGain();
      clickGain.gain.setValueAtTime(0.2 * velocity, startTime);
      clickGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.02);
      click.connect(clickGain);
      clickGain.connect(filter);

      noteGain.gain.linearRampToValueAtTime(velocity * 0.8, startTime + 0.008);
      noteGain.gain.exponentialRampToValueAtTime(velocity * 0.4, startTime + 0.25);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc1.connect(noteGain);
      osc2.connect(osc2Gain);
      osc2Gain.connect(noteGain);
      noteGain.connect(filter);
      filter.connect(masterGain);

      osc1.start(startTime);
      osc2.start(startTime);
      click.start(startTime);
      osc1.stop(startTime + duration + 0.05);
      osc2.stop(startTime + duration + 0.05);
      click.stop(startTime + 0.03);

    } else if (soundPreset === 'ambient_pad') {
      // Lush Ambient Pad
      filter.frequency.setValueAtTime(900, startTime);
      filter.frequency.linearRampToValueAtTime(1600, startTime + duration * 0.5);
      filter.frequency.linearRampToValueAtTime(600, startTime + duration);

      const osc1 = ctx.createOscillator();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(freq, startTime);

      const osc2 = ctx.createOscillator();
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(freq * 0.998, startTime);

      // Slow attack and long release
      noteGain.gain.linearRampToValueAtTime(velocity * 0.5, startTime + 0.35);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc1.connect(noteGain);
      osc2.connect(noteGain);
      noteGain.connect(filter);
      filter.connect(masterGain);

      osc1.start(startTime);
      osc2.start(startTime);
      osc1.stop(startTime + duration + 0.05);
      osc2.stop(startTime + duration + 0.05);

    } else {
      // Plucked / Acoustic feel
      filter.frequency.setValueAtTime(2500, startTime);
      filter.frequency.exponentialRampToValueAtTime(400, startTime + duration);

      const osc1 = ctx.createOscillator();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(freq, startTime);

      noteGain.gain.linearRampToValueAtTime(velocity, startTime + 0.004);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc1.connect(noteGain);
      noteGain.connect(filter);
      filter.connect(masterGain);

      osc1.start(startTime);
      osc1.stop(startTime + duration + 0.05);
    }
  }

  // Play a full Chord (arpeggiated or block chord)
  function playChord(rootPitch, chordType = 'maj', options = {}) {
    const {
      octave = 3,
      duration = 2.0,
      arpeggiate = true,
      arpSpeed = 0.035, // seconds between notes
      velocity = 0.75,
      bassNote = true
    } = options;

    const formula = MusicTheory.CHORD_FORMULAS[chordType] || MusicTheory.CHORD_FORMULAS.maj;
    const intervals = formula.intervals;

    // Optional deep bass root note for warmth
    if (bassNote) {
      playNote(rootPitch, octave - 1, duration * 1.1, 0, velocity * 0.85);
    }

    // Play chord tones
    intervals.forEach((semitones, idx) => {
      const notePitch = (rootPitch + semitones) % 12;
      const noteOctave = octave + Math.floor((rootPitch + semitones) / 12);
      const delay = arpeggiate ? idx * arpSpeed : 0;
      playNote(notePitch, noteOctave, duration, delay, velocity);
    });
  }

  // Play a simple Metronome Click (Hi/Lo)
  function playClick(isAccent = false) {
    const ctx = initAudio();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(isAccent ? 1200 : 800, ctx.currentTime);

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.06);
  }

  // Sequencer to play a full Progression in real time
  function playProgression(progression, onChordChange = null, onComplete = null) {
    stopProgression();
    initAudio();

    if (!progression || !progression.chords || progression.chords.length === 0) return;

    isPlayingSequence = true;
    const bpm = progression.bpm || currentBpm;
    const beatDurationMs = (60 / bpm) * 1000;
    // Each chord lasts 4 beats (1 full measure of 4/4) or 2 beats if long
    const beatsPerChord = 4;
    const chordDurationMs = beatDurationMs * beatsPerChord;

    progression.chords.forEach((chord, index) => {
      const delayMs = index * chordDurationMs;

      // Schedule chord audio & UI notification
      const timeoutId = setTimeout(() => {
        if (!isPlayingSequence) return;

        // Visual / UI callback
        if (typeof onChordChange === 'function') {
          onChordChange(chord, index, progression.chords.length);
        }

        // Play chord sound
        playChord(chord.rootPitch, chord.chordType || 'maj', {
          octave: 3,
          duration: (chordDurationMs / 1000) * 0.95,
          arpeggiate: true,
          arpSpeed: 0.035
        });

      }, delayMs);

      sequenceTimeouts.push(timeoutId);
    });

    // Schedule Completion
    const totalDurationMs = progression.chords.length * chordDurationMs;
    const endTimeout = setTimeout(() => {
      isPlayingSequence = false;
      if (typeof onComplete === 'function') {
        onComplete();
      }
    }, totalDurationMs);
    sequenceTimeouts.push(endTimeout);
  }

  // Stop currently playing progression
  function stopProgression() {
    isPlayingSequence = false;
    sequenceTimeouts.forEach(id => clearTimeout(id));
    sequenceTimeouts = [];
  }

  function setBpm(bpm) {
    currentBpm = Math.max(40, Math.min(240, bpm));
  }

  function setPreset(preset) {
    if (['warm_keys', 'bright_piano', 'ambient_pad', 'acoustic_guitar'].includes(preset)) {
      soundPreset = preset;
    }
  }

  function setVolume(vol) {
    if (masterGain && audioCtx) {
      masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, vol)), audioCtx.currentTime);
    }
  }

  return {
    initAudio,
    playNote,
    playChord,
    playClick,
    playProgression,
    stopProgression,
    setBpm,
    setPreset,
    setVolume,
    getIsPlaying: () => isPlayingSequence,
    getBpm: () => currentBpm,
    getPreset: () => soundPreset
  };
})();

if (typeof window !== 'undefined') {
  window.AudioEngine = AudioEngine;
}
