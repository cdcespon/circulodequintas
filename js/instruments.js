/**
 * instruments.js - Piano Keyboard & Guitar Fretboard Visualizers
 * Synchronized with Circle of Fifths, Scale modes, and Chord progressions.
 */

const InstrumentVisualizer = (() => {
  let pianoContainer = null;
  let fretboardContainer = null;

  // Guitar Tuning (Standard: 6=E2, 5=A2, 4=D3, 3=G3, 2=B3, 1=E4)
  // Pitch classes: E=4, A=9, D=2, G=7, B=11, E=4
  const GUITAR_STRINGS = [
    { stringNum: 1, name: 'E', openPitch: 4, openOctave: 4 },
    { stringNum: 2, name: 'B', openPitch: 11, openOctave: 3 },
    { stringNum: 3, name: 'G', openPitch: 7, openOctave: 3 },
    { stringNum: 4, name: 'D', openPitch: 2, openOctave: 3 },
    { stringNum: 5, name: 'A', openPitch: 9, openOctave: 2 },
    { stringNum: 6, name: 'E', openPitch: 4, openOctave: 2 }
  ];

  const TOTAL_FRETS = 12; // 0 to 12
  const FRET_MARKERS = [3, 5, 7, 9, 12];

  function init(pianoEl, fretboardEl) {
    pianoContainer = pianoEl;
    fretboardContainer = fretboardEl;
  }

  // Render 2-Octave Interactive Piano Keyboard (C3 to B4 or C4 to B5)
  function renderPiano(activePitches = [], rootPitch = null) {
    if (!pianoContainer) return;

    const startOctave = 3;
    const octavesCount = 2; // 24 keys
    const whiteNotesInOctave = [0, 2, 4, 5, 7, 9, 11]; // C, D, E, F, G, A, B
    const blackNotesInOctave = [
      { pitch: 1, offsetPercent: 6.8 },   // C#
      { pitch: 3, offsetPercent: 20.8 },  // D#
      { pitch: 6, offsetPercent: 49.6 },  // F#
      { pitch: 8, offsetPercent: 63.8 },  // G#
      { pitch: 10, offsetPercent: 77.8 }  // A#
    ];

    let whiteKeysHtml = '';
    let blackKeysHtml = '';
    let totalWhiteKeys = 7 * octavesCount;

    for (let oct = 0; oct < octavesCount; oct++) {
      const currentOct = startOctave + oct;

      // White Keys
      whiteNotesInOctave.forEach((pitch, wIdx) => {
        const isHighlighted = activePitches.includes(pitch);
        const isRoot = rootPitch !== null && pitch === rootPitch;
        const noteName = MusicTheory.getNoteName(pitch);
        const keyClass = `piano-key white-key ${isHighlighted ? 'active-note' : ''} ${isRoot ? 'root-note' : ''}`;

        whiteKeysHtml += `
          <div class="${keyClass}" data-pitch="${pitch}" data-octave="${currentOct}" title="${noteName}${currentOct}">
            <span class="key-label">${noteName}${oct === 0 && pitch === 0 ? currentOct : ''}</span>
          </div>
        `;
      });

      // Black Keys
      blackNotesInOctave.forEach((b) => {
        const isHighlighted = activePitches.includes(b.pitch);
        const isRoot = rootPitch !== null && b.pitch === rootPitch;
        const noteName = MusicTheory.getNoteName(b.pitch);
        const leftPercent = (oct * 50) + (b.offsetPercent * 0.5); // span over 2 octaves
        const keyClass = `piano-key black-key ${isHighlighted ? 'active-note' : ''} ${isRoot ? 'root-note' : ''}`;

        blackKeysHtml += `
          <div class="${keyClass}" style="left: ${leftPercent}%;" data-pitch="${b.pitch}" data-octave="${currentOct}" title="${noteName}${currentOct}">
            <span class="key-label">${noteName}</span>
          </div>
        `;
      });
    }

    pianoContainer.innerHTML = `
      <div class="piano-wrapper">
        <div class="piano-white-keys">${whiteKeysHtml}</div>
        <div class="piano-black-keys">${blackKeysHtml}</div>
      </div>
    `;

    // Attach click listeners to piano keys
    const allKeys = pianoContainer.querySelectorAll('.piano-key');
    allKeys.forEach(k => {
      k.addEventListener('click', (e) => {
        e.stopPropagation();
        const pitch = parseInt(k.getAttribute('data-pitch'), 10);
        const octave = parseInt(k.getAttribute('data-octave'), 10);
        AudioEngine.playNote(pitch, octave, 1.0, 0, 0.85);

        // Visual press effect
        k.classList.add('pressed');
        setTimeout(() => k.classList.remove('pressed'), 250);
      });
    });
  }

  // Render 6-String 12-Fret Guitar Fretboard
  function renderFretboard(activePitches = [], rootPitch = null) {
    if (!fretboardContainer) return;

    let fretboardHtml = `
      <div class="fretboard-wrapper">
        <!-- Nut (Fret 0) -->
        <div class="fretboard-nut"></div>

        <!-- Frets Column Grid -->
        <div class="fretboard-grid">
    `;

    // Build Frets Grid Headers / Markers
    let markersHtml = '<div class="fret-markers-row">';
    for (let f = 0; f <= TOTAL_FRETS; f++) {
      const hasMarker = FRET_MARKERS.includes(f);
      const isDouble = f === 12;
      markersHtml += `
        <div class="fret-marker-cell">
          <span class="fret-number">${f === 0 ? 'Nut' : f}</span>
          ${hasMarker ? `<span class="marker-dot ${isDouble ? 'double-dot' : ''}"></span>` : ''}
        </div>
      `;
    }
    markersHtml += '</div>';

    // Build Strings and Notes
    let stringsHtml = '<div class="fretboard-strings">';
    GUITAR_STRINGS.forEach((str) => {
      let stringRowHtml = `<div class="fret-string-row" data-string="${str.stringNum}">`;
      stringRowHtml += `<div class="string-line string-${str.stringNum}"></div>`;

      for (let f = 0; f <= TOTAL_FRETS; f++) {
        const fretPitch = (str.openPitch + f) % 12;
        const isHighlighted = activePitches.includes(fretPitch);
        const isRoot = rootPitch !== null && fretPitch === rootPitch;
        const noteName = MusicTheory.getNoteName(fretPitch);
        const fretOctave = str.openOctave + Math.floor((str.openPitch + f) / 12);

        stringRowHtml += `
          <div class="fret-cell" data-fret="${f}">
            ${isHighlighted ? `
              <div class="fret-note-dot ${isRoot ? 'root-fret-dot' : 'scale-fret-dot'}" 
                   data-pitch="${fretPitch}" 
                   data-octave="${fretOctave}" 
                   title="${noteName} (Cuerda ${str.stringNum}, Traste ${f})">
                ${noteName}
              </div>
            ` : (f === 0 ? `<span class="open-string-label">${str.name}</span>` : '')}
          </div>
        `;
      }
      stringRowHtml += '</div>';
      stringsHtml += stringRowHtml;
    });
    stringsHtml += '</div>';

    fretboardHtml += markersHtml + stringsHtml + `
        </div>
      </div>
    `;

    fretboardContainer.innerHTML = fretboardHtml;

    // Attach click to play individual notes on guitar fretboard
    const noteDots = fretboardContainer.querySelectorAll('.fret-note-dot');
    noteDots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        const pitch = parseInt(dot.getAttribute('data-pitch'), 10);
        const octave = parseInt(dot.getAttribute('data-octave'), 10);
        AudioEngine.playNote(pitch, octave, 1.2, 0, 0.9);

        dot.classList.add('pulse-glow');
        setTimeout(() => dot.classList.remove('pulse-glow'), 300);
      });
    });
  }

  // Update both instruments simultaneously with given active pitches
  function updateInstruments(activePitches = [], rootPitch = null) {
    renderPiano(activePitches, rootPitch);
    renderFretboard(activePitches, rootPitch);
  }

  return {
    init,
    renderPiano,
    renderFretboard,
    updateInstruments
  };
})();

if (typeof window !== 'undefined') {
  window.InstrumentVisualizer = InstrumentVisualizer;
}
