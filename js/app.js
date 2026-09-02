/**
 * app.js - Main Application Orchestrator
 * Connects CircleVisualizer, MusicTheory, AudioEngine, and InstrumentVisualizer.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Application State
  const state = {
    currentKeyIndex: 0, // 0 = C
    isMinor: false,
    currentScale: 'major',
    currentInterval: null,
    currentProgressionPlaying: null,
    activeInstrumentTab: 'piano', // 'piano' or 'guitar'
    quizScore: 0,
    quizTotal: 0,
    quizStreak: 0,
    currentQuizQuestion: null,
    generatedProgression: null
  };

  // DOM Elements cache
  const circleContainer = document.getElementById('circle-container');
  const pianoContainer = document.getElementById('piano-container');
  const fretboardContainer = document.getElementById('fretboard-container');
  const keyTitleEl = document.getElementById('key-title');
  const keyDescEl = document.getElementById('key-desc');
  const scaleNotesRowEl = document.getElementById('scale-notes-row');
  const diatonicChordsGridEl = document.getElementById('diatonic-chords-grid');
  const stylesContainerEl = document.getElementById('styles-container');

  // Sound Engine Controls
  const soundPresetSelect = document.getElementById('sound-preset');
  const bpmInput = document.getElementById('bpm-input');
  const soundVolumeSlider = document.getElementById('sound-volume');

  // Mode & Interval Quick Controls
  const scaleSelect = document.getElementById('scale-select');
  const intervalButtons = document.querySelectorAll('.interval-btn');
  const clearOverlayBtn = document.getElementById('clear-overlay-btn');

  // Navigation Tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-content-panel');

  // Instrument Tabs
  const instrumentTabBtns = document.querySelectorAll('.instrument-tab-btn');
  const pianoWrapEl = document.getElementById('piano-panel');
  const guitarWrapEl = document.getElementById('guitar-panel');

  // Random Generator Elements
  const genKeySelect = document.getElementById('gen-key');
  const genComplexitySelect = document.getElementById('gen-complexity');
  const genLengthSelect = document.getElementById('gen-length');
  const generateBtn = document.getElementById('generate-btn');
  const generatedResultBox = document.getElementById('generated-result-box');
  const genTitleEl = document.getElementById('gen-title');
  const genChordsRowEl = document.getElementById('gen-chords-row');
  const genPlayBtn = document.getElementById('gen-play-btn');
  const genApplyKeyBtn = document.getElementById('gen-apply-key-btn');

  // Quiz / Practice Elements
  const quizPromptEl = document.getElementById('quiz-prompt');
  const quizOptionsGridEl = document.getElementById('quiz-options-grid');
  const quizFeedbackEl = document.getElementById('quiz-feedback');
  const nextQuestionBtn = document.getElementById('next-question-btn');
  const quizScoreEl = document.getElementById('quiz-score');
  const quizStreakEl = document.getElementById('quiz-streak');
  const quizTypeSelect = document.getElementById('quiz-type-select');

  // 1. Initialize Visualizers & Engine
  CircleVisualizer.init(circleContainer, handleKeySelectFromCircle);
  InstrumentVisualizer.init(pianoContainer, fretboardContainer);

  // Initialize Key options in Random Generator
  initGeneratorOptions();

  // Populate UI for Default Key (C Major)
  updateAllViews();
  renderStylePresets();
  loadNewQuizQuestion();

  // -------------------------------------------------------------
  // EVENT LISTENERS
  // -------------------------------------------------------------

  // Tabs Navigation
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetTab = btn.getAttribute('data-tab');
      const panel = document.getElementById(targetTab);
      if (panel) panel.classList.add('active');

      if (targetTab === 'tab-styles') {
        renderStylePresets();
      }
    });
  });

  // Sound Engine Settings
  if (soundPresetSelect) {
    soundPresetSelect.addEventListener('change', (e) => {
      AudioEngine.setPreset(e.target.value);
    });
  }

  if (bpmInput) {
    bpmInput.addEventListener('change', (e) => {
      const val = parseInt(e.target.value, 10) || 100;
      AudioEngine.setBpm(val);
    });
  }

  if (soundVolumeSlider) {
    soundVolumeSlider.addEventListener('input', (e) => {
      AudioEngine.setVolume(parseFloat(e.target.value));
    });
  }

  // Scale / Mode Selector
  if (scaleSelect) {
    scaleSelect.addEventListener('change', (e) => {
      state.currentScale = e.target.value;
      CircleVisualizer.setScaleMode(state.currentScale);
      updateScaleAndInstruments();
    });
  }

  // Interval Buttons
  intervalButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      intervalButtons.forEach(b => b.classList.remove('active'));
      const intervalShort = btn.getAttribute('data-interval');

      if (state.currentInterval === intervalShort) {
        state.currentInterval = null;
        CircleVisualizer.setIntervalOverlay(null);
      } else {
        btn.classList.add('active');
        state.currentInterval = intervalShort;
        CircleVisualizer.setIntervalOverlay(intervalShort);

        // Sound preview of the interval
        const keyData = MusicTheory.getKeyByIndex(state.currentKeyIndex);
        const rootPitch = state.isMinor ? keyData.minorPitch : keyData.majorPitch;
        const intDef = MusicTheory.INTERVALS.find(i => i.short === intervalShort);
        if (intDef) {
          AudioEngine.playNote(rootPitch, 4, 1.2, 0);
          AudioEngine.playNote((rootPitch + intDef.semitones) % 12, 4 + Math.floor((rootPitch + intDef.semitones) / 12), 1.2, 0.25);
        }
      }
    });
  });

  if (clearOverlayBtn) {
    clearOverlayBtn.addEventListener('click', () => {
      state.currentInterval = null;
      intervalButtons.forEach(b => b.classList.remove('active'));
      CircleVisualizer.setIntervalOverlay(null);
    });
  }

  // Instrument Tabs Toggle (Piano vs Guitar)
  instrumentTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      instrumentTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const inst = btn.getAttribute('data-instrument');
      state.activeInstrumentTab = inst;

      if (inst === 'piano') {
        pianoWrapEl.style.display = 'block';
        guitarWrapEl.style.display = 'none';
      } else {
        pianoWrapEl.style.display = 'none';
        guitarWrapEl.style.display = 'block';
      }
    });
  });

  // Random Generator Button
  if (generateBtn) {
    generateBtn.addEventListener('click', () => {
      handleGenerateRandomProgression();
    });
  }

  if (genPlayBtn) {
    genPlayBtn.addEventListener('click', () => {
      if (state.generatedProgression) {
        playProgressionSequence(state.generatedProgression, genChordsRowEl);
      }
    });
  }

  if (genApplyKeyBtn) {
    genApplyKeyBtn.addEventListener('click', () => {
      if (state.generatedProgression) {
        setApplicationKey(state.generatedProgression.keyIndex, state.generatedProgression.isMinor);
        // Switch to main tab
        document.querySelector('.tab-btn[data-tab="tab-studio"]').click();
      }
    });
  }

  // Quiz / Practice Controls
  if (nextQuestionBtn) {
    nextQuestionBtn.addEventListener('click', () => {
      loadNewQuizQuestion();
    });
  }

  if (quizTypeSelect) {
    quizTypeSelect.addEventListener('change', () => {
      loadNewQuizQuestion();
    });
  }

  // -------------------------------------------------------------
  // CORE APP LOGIC & RENDERING
  // -------------------------------------------------------------

  function handleKeySelectFromCircle(keyData, isMinor) {
    state.currentKeyIndex = keyData.id;
    state.isMinor = isMinor;
    updateAllViews();
    renderStylePresets();
  }

  function setApplicationKey(keyIndex, isMinor = false) {
    state.currentKeyIndex = keyIndex;
    state.isMinor = isMinor;
    CircleVisualizer.setKey(keyIndex, isMinor);
    updateAllViews();
    renderStylePresets();
  }

  function updateAllViews() {
    const keyData = MusicTheory.getKeyByIndex(state.currentKeyIndex);
    const rootPitch = state.isMinor ? keyData.minorPitch : keyData.majorPitch;
    const currentName = state.isMinor ? keyData.minor : keyData.major;

    // 1. Update Header Banner Details
    if (keyTitleEl) {
      keyTitleEl.textContent = `${currentName} ${state.isMinor ? 'Menor' : 'Mayor'}`;
    }
    if (keyDescEl) {
      keyDescEl.textContent = `Armadura: ${keyData.keySignatureText} | Relativa: ${state.isMinor ? keyData.major + ' Mayor' : keyData.minor + ' Menor'}`;
    }

    // 2. Update Scale Notes & Instruments
    updateScaleAndInstruments();

    // 3. Render Diatonic Chords in Right Panel
    renderDiatonicChords();
  }

  function updateScaleAndInstruments() {
    const keyData = MusicTheory.getKeyByIndex(state.currentKeyIndex);
    const rootPitch = state.isMinor ? keyData.minorPitch : keyData.majorPitch;
    const preferFlats = keyData.flats > 0;
    const scaleNotes = MusicTheory.getScaleNotes(rootPitch, state.currentScale, preferFlats);

    // Scale Chips
    if (scaleNotesRowEl) {
      scaleNotesRowEl.innerHTML = scaleNotes.map((note, idx) => `
        <div class="note-chip" data-pitch="${note.pitch}">
          <span class="note-chip-name">${note.name}</span>
          <span class="note-chip-deg">${idx + 1}</span>
        </div>
      `).join('');

      scaleNotesRowEl.querySelectorAll('.note-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          const p = parseInt(chip.getAttribute('data-pitch'), 10);
          AudioEngine.playNote(p, 4, 1.2, 0);
        });
      });
    }

    // Update Virtual Piano & Guitar Fretboard
    const activePitches = scaleNotes.map(n => n.pitch);
    InstrumentVisualizer.updateInstruments(activePitches, rootPitch);
  }

  function renderDiatonicChords() {
    if (!diatonicChordsGridEl) return;

    const diatonic = MusicTheory.getDiatonicChords(state.currentKeyIndex, state.isMinor);

    diatonicChordsGridEl.innerHTML = diatonic.map(chord => {
      let roleClass = '';
      if (chord.isTonic) roleClass = 'is-tonic';
      else if (chord.isDominant) roleClass = 'is-dominant';
      else if (chord.isSubdominant) roleClass = 'is-subdominant';

      return `
        <div class="diatonic-chord-card ${roleClass}" 
             data-root="${chord.rootPitch}" 
             data-triad="${chord.triadType}" 
             data-seventh="${chord.seventhType}"
             title="Tocar acorde">
          <span class="chord-card-degree">${chord.degree}</span>
          <span class="chord-card-name">${chord.triadName}</span>
          <span class="chord-card-seventh">${chord.seventhName}</span>
          <button class="chord-card-btn">▶ Tocar</button>
        </div>
      `;
    }).join('');

    // Attach click to play chord and highlight on instruments
    diatonicChordsGridEl.querySelectorAll('.diatonic-chord-card').forEach(card => {
      card.addEventListener('click', () => {
        const root = parseInt(card.getAttribute('data-root'), 10);
        const triad = card.getAttribute('data-triad');
        
        // Play Audio
        AudioEngine.playChord(root, triad, { arpeggiate: true });

        // Highlight chord notes on instruments
        const chordNotes = MusicTheory.getChordNotes(root, triad);
        const chordPitches = chordNotes.map(n => n.pitch);
        InstrumentVisualizer.updateInstruments(chordPitches, root);

        // Reset to scale view after 2 seconds
        setTimeout(() => {
          const keyData = MusicTheory.getKeyByIndex(state.currentKeyIndex);
          const rootPitch = state.isMinor ? keyData.minorPitch : keyData.majorPitch;
          const scaleNotes = MusicTheory.getScaleNotes(rootPitch, state.currentScale);
          InstrumentVisualizer.updateInstruments(scaleNotes.map(n => n.pitch), rootPitch);
        }, 2200);
      });
    });
  }

  // -------------------------------------------------------------
  // STYLE PRESETS LIBRARY
  // -------------------------------------------------------------

  function renderStylePresets() {
    if (!stylesContainerEl) return;

    const progressions = MusicTheory.STYLE_PROGRESSIONS;

    stylesContainerEl.innerHTML = progressions.map(prog => {
      const transposed = MusicTheory.getProgressionInKey(prog.id, state.currentKeyIndex, state.isMinor);

      return `
        <div class="style-card" id="card-${prog.id}">
          <div>
            <div class="style-card-meta">
              <span class="style-category-tag">${prog.category}</span>
              <span class="style-bpm-tag">⚡ ${prog.bpm} BPM</span>
            </div>
            <h3 class="style-card-title">${prog.name}</h3>
            <p class="style-card-desc">${prog.description}</p>
          </div>

          <div class="style-progression-row" id="row-${prog.id}">
            ${transposed.chords.map((ch, idx) => `
              <div class="style-chord-box" data-idx="${idx}">
                <div class="style-chord-name">${ch.chordName}</div>
                <div class="style-chord-degree">${ch.degree}</div>
              </div>
            `).join('')}
          </div>

          <div class="style-card-actions">
            <button class="btn-primary play-style-btn" data-prog-id="${prog.id}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              Reproducir
            </button>
            <button class="btn-secondary stop-style-btn" data-prog-id="${prog.id}">
              ⏹ Detener
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Attach Play & Stop actions
    stylesContainerEl.querySelectorAll('.play-style-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const progId = btn.getAttribute('data-prog-id');
        const transposed = MusicTheory.getProgressionInKey(progId, state.currentKeyIndex, state.isMinor);
        const rowEl = document.getElementById(`row-${progId}`);
        playProgressionSequence(transposed, rowEl);
      });
    });

    stylesContainerEl.querySelectorAll('.stop-style-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        AudioEngine.stopProgression();
        clearAllPlayingHighlights();
      });
    });
  }

  function playProgressionSequence(progression, displayRowElement) {
    clearAllPlayingHighlights();
    AudioEngine.setBpm(progression.bpm || 100);

    AudioEngine.playProgression(
      progression,
      (chord, chordIndex) => {
        // Highlight active chord box in UI
        if (displayRowElement) {
          displayRowElement.querySelectorAll('.style-chord-box, .gen-chord-chip').forEach((box, i) => {
            if (i === chordIndex) {
              box.classList.add('playing-now');
            } else {
              box.classList.remove('playing-now');
            }
          });
        }

        // Highlight chord notes on piano and fretboard
        const chordNotes = MusicTheory.getChordNotes(chord.rootPitch, chord.chordType || 'maj');
        InstrumentVisualizer.updateInstruments(chordNotes.map(n => n.pitch), chord.rootPitch);
      },
      () => {
        // On completion
        clearAllPlayingHighlights();
        updateScaleAndInstruments();
      }
    );
  }

  function clearAllPlayingHighlights() {
    document.querySelectorAll('.playing-now').forEach(el => el.classList.remove('playing-now'));
  }

  // -------------------------------------------------------------
  // RANDOM GENERATOR
  // -------------------------------------------------------------

  function initGeneratorOptions() {
    if (!genKeySelect) return;
    genKeySelect.innerHTML = `
      <option value="auto">🎲 Tonalidad Aleatoria</option>
      ${MusicTheory.CIRCLE_KEYS.map(k => `
        <option value="${k.id}_maj">${k.major} Mayor</option>
        <option value="${k.id}_min">${k.minor} Menor</option>
      `).join('')}
    `;
  }

  function handleGenerateRandomProgression() {
    let keyIdx = state.currentKeyIndex;
    let isMin = state.isMinor;

    const keyVal = genKeySelect.value;
    if (keyVal === 'auto') {
      keyIdx = Math.floor(Math.random() * 12);
      isMin = Math.random() > 0.5;
    } else {
      const [idx, mode] = keyVal.split('_');
      keyIdx = parseInt(idx, 10);
      isMin = mode === 'min';
    }

    const complexity = genComplexitySelect.value;
    const length = parseInt(genLengthSelect.value, 10) || 4;

    const result = MusicTheory.generateRandomProgression({
      keyIndex: keyIdx,
      isMinor: isMin,
      complexity: complexity,
      length: length
    });

    state.generatedProgression = result;

    // Display Result
    if (generatedResultBox) {
      generatedResultBox.style.display = 'block';
      genTitleEl.textContent = `${result.name} (${result.bpm} BPM)`;
      
      genChordsRowEl.innerHTML = result.chords.map((ch, idx) => `
        <div class="gen-chord-chip" data-idx="${idx}">
          <div class="gen-chord-name">${ch.chordName}</div>
          <div class="gen-chord-deg">${ch.degree}</div>
        </div>
      `).join('');

      // Auto play sound of the generated progression
      playProgressionSequence(result, genChordsRowEl);
    }
  }

  // -------------------------------------------------------------
  // TRAINING & QUIZ ARENA
  // -------------------------------------------------------------

  function loadNewQuizQuestion() {
    const selectedType = quizTypeSelect ? quizTypeSelect.value : 'random';
    const q = MusicTheory.generateQuizQuestion(selectedType);
    state.currentQuizQuestion = q;

    if (quizFeedbackEl) {
      quizFeedbackEl.style.display = 'none';
      quizFeedbackEl.className = 'quiz-feedback-box';
    }

    if (quizPromptEl) {
      quizPromptEl.textContent = q.prompt;
    }

    if (quizOptionsGridEl) {
      quizOptionsGridEl.innerHTML = q.options.map(opt => `
        <button class="quiz-option-btn" data-val="${opt}">${opt}</button>
      `).join('');

      quizOptionsGridEl.querySelectorAll('.quiz-option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          handleQuizAnswer(btn.getAttribute('data-val'), btn);
        });
      });
    }
  }

  function handleQuizAnswer(userAnswer, buttonElement) {
    const q = state.currentQuizQuestion;
    if (!q) return;

    // Disable all options
    quizOptionsGridEl.querySelectorAll('.quiz-option-btn').forEach(b => {
      b.disabled = true;
      if (b.getAttribute('data-val') === q.correctAnswer) {
        b.classList.add('correct');
      }
    });

    const isCorrect = userAnswer === q.correctAnswer;
    state.quizTotal++;

    if (isCorrect) {
      state.quizScore++;
      state.quizStreak++;
      buttonElement.classList.add('correct');
      AudioEngine.playClick(true);

      quizFeedbackEl.textContent = `¡Correcto! 🎉 ${q.explanation}`;
      quizFeedbackEl.className = 'quiz-feedback-box correct';
    } else {
      state.quizStreak = 0;
      buttonElement.classList.add('wrong');
      AudioEngine.playClick(false);

      quizFeedbackEl.textContent = `Incorrecto. La respuesta correcta era "${q.correctAnswer}". ${q.explanation}`;
      quizFeedbackEl.className = 'quiz-feedback-box wrong';
    }

    quizFeedbackEl.style.display = 'block';

    // Update Scores
    if (quizScoreEl) quizScoreEl.textContent = `${state.quizScore}/${state.quizTotal}`;
    if (quizStreakEl) quizStreakEl.textContent = `Racha: ${state.quizStreak} 🔥`;
  }
});
