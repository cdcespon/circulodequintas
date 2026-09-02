/**
 * circle.js - Interactive SVG Circle of Fifths Visualizer
 * Renders Major/Minor rings, accidental badges, harmonic degree highlights,
 * and interval/scale geometric polygons with glowing cyberpunk/modern aesthetic.
 */

const CircleVisualizer = (() => {
  let svgContainer = null;
  let currentKeyIndex = 0; // C Major by default
  let isMinorSelected = false;
  let activeInterval = null; // e.g. 'P5', 'TT', 'P4'
  let activeScale = 'major';
  let highlightedKeys = []; // [{ keyIndex, isMinor, role, label }]
  let onKeySelectCallback = null;

  const CX = 300;
  const CY = 300;
  const R_OUTER_MAX = 285;
  const R_OUTER_MIN = 205;
  const R_INNER_MAX = 205;
  const R_INNER_MIN = 135;
  const R_ACC_MAX = 135;
  const R_ACC_MIN = 85;
  const R_CENTER = 85;

  // Degrees to Radians
  function toRad(deg) {
    return (deg * Math.PI) / 180;
  }

  // Polar to Cartesian
  function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = toRad(angleInDegrees - 90); // 0 deg is at top (12 o'clock)
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    };
  }

  // Create an SVG Sector / Annular Wedge Path
  function describeArc(x, y, innerRadius, outerRadius, startAngle, endAngle) {
    const startOuter = polarToCartesian(x, y, outerRadius, endAngle);
    const endOuter = polarToCartesian(x, y, outerRadius, startAngle);
    const startInner = polarToCartesian(x, y, innerRadius, endAngle);
    const endInner = polarToCartesian(x, y, innerRadius, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    return [
      'M', startOuter.x, startOuter.y,
      'A', outerRadius, outerRadius, 0, largeArcFlag, 0, endOuter.x, endOuter.y,
      'L', endInner.x, endInner.y,
      'A', innerRadius, innerRadius, 0, largeArcFlag, 1, startInner.x, startInner.y,
      'Z'
    ].join(' ');
  }

  function init(containerElement, onKeySelect) {
    svgContainer = containerElement;
    onKeySelectCallback = onKeySelect;
    render();
  }

  function setKey(keyIndex, isMinor = false) {
    currentKeyIndex = ((keyIndex % 12) + 12) % 12;
    isMinorSelected = isMinor;
    updateDiatonicHighlights();
    render();
  }

  function setIntervalOverlay(intervalShort) {
    activeInterval = intervalShort;
    render();
  }

  function setScaleMode(scaleKey) {
    activeScale = scaleKey;
    updateDiatonicHighlights();
    render();
  }

  function updateDiatonicHighlights() {
    const diatonic = MusicTheory.getDiatonicChords(currentKeyIndex, isMinorSelected);
    highlightedKeys = [];

    diatonic.forEach((chord) => {
      if (chord.circleKeyIndex !== null) {
        highlightedKeys.push({
          keyIndex: chord.circleKeyIndex,
          isMinor: chord.triadType === 'min' || chord.triadType === 'dim',
          role: chord.isTonic ? 'tonic' : chord.isDominant ? 'dominant' : chord.isSubdominant ? 'subdominant' : 'diatonic',
          degree: chord.degree,
          chordName: chord.triadName
        });
      }
    });
  }

  function render() {
    if (!svgContainer) return;

    const keys = MusicTheory.CIRCLE_KEYS;
    const wedgeAngle = 360 / 12; // 30 degrees per key

    // Create Base SVG
    let svgHtml = `
      <svg viewBox="0 0 600 600" class="circle-svg" id="circle-of-fifths-svg">
        <defs>
          <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="subtle-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <radialGradient id="center-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#1e293b" />
            <stop offset="100%" stop-color="#0f172a" />
          </radialGradient>
        </defs>

        <!-- Background guide circles -->
        <circle cx="${CX}" cy="${CY}" r="${R_OUTER_MAX + 5}" class="circle-bg-ring" />
    `;

    // 1. Render Outer Ring (Major Keys)
    for (let i = 0; i < 12; i++) {
      const key = keys[i];
      const startAngle = i * wedgeAngle - wedgeAngle / 2;
      const endAngle = startAngle + wedgeAngle;
      const pathData = describeArc(CX, CY, R_OUTER_MIN, R_OUTER_MAX, startAngle, endAngle);

      const isCurrentTonic = !isMinorSelected && currentKeyIndex === i;
      const highlight = highlightedKeys.find(h => h.keyIndex === i && !h.isMinor);

      let wedgeClass = 'wedge wedge-major';
      if (isCurrentTonic) wedgeClass += ' active-tonic';
      else if (highlight) wedgeClass += ` highlight-${highlight.role}`;

      const textPos = polarToCartesian(CX, CY, (R_OUTER_MAX + R_OUTER_MIN) / 2, i * wedgeAngle);

      svgHtml += `
        <g class="key-group key-group-major" data-index="${i}" data-type="major">
          <path d="${pathData}" class="${wedgeClass}" style="--key-color: ${key.color};" />
          <text x="${textPos.x}" y="${textPos.y - 4}" class="key-label major-label ${isCurrentTonic ? 'text-active' : ''}">
            ${key.major}
          </text>
          ${key.enharmonicMajor ? `
            <text x="${textPos.x}" y="${textPos.y + 14}" class="key-sublabel enharmonic-label">
              (${key.enharmonicMajor})
            </text>
          ` : ''}
          ${highlight ? `
            <text x="${textPos.x}" y="${textPos.y + 16}" class="degree-badge degree-${highlight.role}">
              ${highlight.degree}
            </text>
          ` : ''}
        </g>
      `;
    }

    // 2. Render Inner Ring (Minor Keys)
    for (let i = 0; i < 12; i++) {
      const key = keys[i];
      const startAngle = i * wedgeAngle - wedgeAngle / 2;
      const endAngle = startAngle + wedgeAngle;
      const pathData = describeArc(CX, CY, R_INNER_MIN, R_INNER_MAX, startAngle, endAngle);

      const isCurrentTonic = isMinorSelected && currentKeyIndex === i;
      const highlight = highlightedKeys.find(h => h.keyIndex === i && h.isMinor);

      let wedgeClass = 'wedge wedge-minor';
      if (isCurrentTonic) wedgeClass += ' active-tonic-minor';
      else if (highlight) wedgeClass += ` highlight-${highlight.role}`;

      const textPos = polarToCartesian(CX, CY, (R_INNER_MAX + R_INNER_MIN) / 2, i * wedgeAngle);

      svgHtml += `
        <g class="key-group key-group-minor" data-index="${i}" data-type="minor">
          <path d="${pathData}" class="${wedgeClass}" style="--key-color: ${key.color};" />
          <text x="${textPos.x}" y="${textPos.y - 2}" class="key-label minor-label ${isCurrentTonic ? 'text-active-minor' : ''}">
            ${key.minor}
          </text>
          ${highlight ? `
            <text x="${textPos.x}" y="${textPos.y + 14}" class="degree-badge degree-${highlight.role}">
              ${highlight.degree}
            </text>
          ` : ''}
        </g>
      `;
    }

    // 3. Render Accidentals Ring
    for (let i = 0; i < 12; i++) {
      const key = keys[i];
      const startAngle = i * wedgeAngle - wedgeAngle / 2;
      const endAngle = startAngle + wedgeAngle;
      const pathData = describeArc(CX, CY, R_ACC_MIN, R_ACC_MAX, startAngle, endAngle);
      const textPos = polarToCartesian(CX, CY, (R_ACC_MAX + R_ACC_MIN) / 2, i * wedgeAngle);

      let accText = '0';
      if (key.sharps > 0 && key.flats > 0) accText = '6#/6♭';
      else if (key.sharps > 0) accText = `${key.sharps}#`;
      else if (key.flats > 0) accText = `${key.flats}♭`;

      svgHtml += `
        <g class="accidental-group">
          <path d="${pathData}" class="wedge wedge-accidental" />
          <text x="${textPos.x}" y="${textPos.y + 4}" class="accidental-text">
            ${accText}
          </text>
        </g>
      `;
    }

    // 4. Render Interval Geometric Relationship Lines (if an interval is active)
    if (activeInterval) {
      const intervalDef = MusicTheory.INTERVALS.find(int => int.short === activeInterval);
      if (intervalDef) {
        const targetIndex = (currentKeyIndex + intervalDef.circleSteps) % 12;
        const originPos = polarToCartesian(CX, CY, (R_OUTER_MAX + R_OUTER_MIN) / 2, currentKeyIndex * wedgeAngle);
        const targetPos = polarToCartesian(CX, CY, (R_OUTER_MAX + R_OUTER_MIN) / 2, targetIndex * wedgeAngle);

        svgHtml += `
          <!-- Interval Ray Line -->
          <line x1="${originPos.x}" y1="${originPos.y}" x2="${targetPos.x}" y2="${targetPos.y}" class="interval-ray" />
          <circle cx="${originPos.x}" cy="${originPos.y}" r="8" class="interval-node-origin" />
          <circle cx="${targetPos.x}" cy="${targetPos.y}" r="8" class="interval-node-target" />
        `;
      }
    }

    // 5. Render Scale Mode Geometry Polygon
    if (activeScale && !activeInterval) {
      const scaleDef = MusicTheory.SCALES[activeScale];
      if (scaleDef) {
        const key = keys[currentKeyIndex];
        const rootPitch = isMinorSelected ? key.minorPitch : key.majorPitch;
        const polygonPoints = [];

        scaleDef.intervals.forEach((semitones) => {
          const notePitch = (rootPitch + semitones) % 12;
          // Find matching key index on the circle
          const matchedKey = keys.find(k => k.majorPitch === notePitch);
          if (matchedKey) {
            const pt = polarToCartesian(CX, CY, (R_OUTER_MAX + R_OUTER_MIN) / 2, matchedKey.id * wedgeAngle);
            polygonPoints.push(`${pt.x},${pt.y}`);
          }
        });

        if (polygonPoints.length > 2) {
          svgHtml += `
            <polygon points="${polygonPoints.join(' ')}" class="scale-mode-polygon" />
          `;
        }
      }
    }

    // 6. Center Hub with Current Tonal Center details & Quick Play Button
    const activeKeyData = keys[currentKeyIndex];
    const currentTonicName = isMinorSelected ? activeKeyData.minor : activeKeyData.major;
    const relativeName = isMinorSelected ? activeKeyData.major : activeKeyData.minor;

    svgHtml += `
      <!-- Center Hub -->
      <g class="center-hub" id="center-hub-button" role="button" tabindex="0" aria-label="Tocar acorde tónica">
        <circle cx="${CX}" cy="${CY}" r="${R_CENTER}" class="center-circle" />
        <circle cx="${CX}" cy="${CY}" r="${R_CENTER - 4}" class="center-circle-inner" />
        
        <!-- Play Icon Ripple -->
        <circle cx="${CX}" cy="${CY}" r="${R_CENTER - 18}" class="center-ripple" />
        
        <text x="${CX}" y="${CY - 22}" class="center-label-caption">TONALIDAD</text>
        <text x="${CX}" y="${CY + 6}" class="center-label-key">${currentTonicName}</text>
        <text x="${CX}" y="${CY + 26}" class="center-label-relative">Rel: ${relativeName}</text>
        <text x="${CX}" y="${CY + 44}" class="center-label-play">▶ Tocar</text>
      </g>
    `;

    svgHtml += `</svg>`;

    svgContainer.innerHTML = svgHtml;
    attachEventListeners();
  }

  function attachEventListeners() {
    if (!svgContainer) return;

    // Outer & Inner ring key clicks
    const keyGroups = svgContainer.querySelectorAll('.key-group');
    keyGroups.forEach(group => {
      group.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(group.getAttribute('data-index'), 10);
        const type = group.getAttribute('data-type');
        const isMinor = type === 'minor';
        
        setKey(index, isMinor);

        // Sound preview on click
        const keyData = MusicTheory.getKeyByIndex(index);
        const pitch = isMinor ? keyData.minorPitch : keyData.majorPitch;
        AudioEngine.playChord(pitch, isMinor ? 'min' : 'maj', { arpeggiate: true });

        if (typeof onKeySelectCallback === 'function') {
          onKeySelectCallback(keyData, isMinor);
        }
      });
    });

    // Center hub click (play tonic chord)
    const centerHub = svgContainer.querySelector('#center-hub-button');
    if (centerHub) {
      centerHub.addEventListener('click', () => {
        const keyData = MusicTheory.getKeyByIndex(currentKeyIndex);
        const pitch = isMinorSelected ? keyData.minorPitch : keyData.majorPitch;
        AudioEngine.playChord(pitch, isMinorSelected ? 'min' : 'maj', { arpeggiate: true, duration: 2.2 });
      });
    }
  }

  return {
    init,
    setKey,
    setIntervalOverlay,
    setScaleMode,
    render,
    getCurrentKey: () => MusicTheory.getKeyByIndex(currentKeyIndex),
    isMinor: () => isMinorSelected
  };
})();

if (typeof window !== 'undefined') {
  window.CircleVisualizer = CircleVisualizer;
}
