/**
 * musicTheory.js - Comprehensive Music Theory Engine
 * Circle of Fifths, Scales, Chords, Modes, Intervals, and Style Presets
 */

const MusicTheory = (() => {
  // 12 Semitones with enharmonic equivalents
  const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const NOTE_NAMES_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

  // Circle of 5ths sequence (Clockwise from C at top = index 0)
  const CIRCLE_KEYS = [
    {
      id: 0,
      major: 'C',
      minor: 'Am',
      sharps: 0,
      flats: 0,
      keySignatureText: 'Natural (0 #/♭)',
      accidentals: [],
      majorPitch: 0,   // C
      minorPitch: 9,   // A
      enharmonicMajor: null,
      enharmonicMinor: null,
      color: '#38bdf8' // Vibrant Cyan
    },
    {
      id: 1,
      major: 'G',
      minor: 'Em',
      sharps: 1,
      flats: 0,
      keySignatureText: '1 Sostenido (F#)',
      accidentals: ['F#'],
      majorPitch: 7,   // G
      minorPitch: 4,   // E
      enharmonicMajor: null,
      enharmonicMinor: null,
      color: '#34d399' // Emerald
    },
    {
      id: 2,
      major: 'D',
      minor: 'Bm',
      sharps: 2,
      flats: 0,
      keySignatureText: '2 Sostenidos (F#, C#)',
      accidentals: ['F#', 'C#'],
      majorPitch: 2,   // D
      minorPitch: 11,  // B
      enharmonicMajor: null,
      enharmonicMinor: null,
      color: '#a3e635' // Lime
    },
    {
      id: 3,
      major: 'A',
      minor: 'F#m',
      sharps: 3,
      flats: 0,
      keySignatureText: '3 Sostenidos (F#, C#, G#)',
      accidentals: ['F#', 'C#', 'G#'],
      majorPitch: 9,   // A
      minorPitch: 6,   // F#
      enharmonicMajor: null,
      enharmonicMinor: 'Gbm',
      color: '#facc15' // Amber Yellow
    },
    {
      id: 4,
      major: 'E',
      minor: 'C#m',
      sharps: 4,
      flats: 0,
      keySignatureText: '4 Sostenidos (F#, C#, G#, D#)',
      accidentals: ['F#', 'C#', 'G#', 'D#'],
      majorPitch: 4,   // E
      minorPitch: 1,   // C#
      enharmonicMajor: null,
      enharmonicMinor: 'Dbm',
      color: '#fb923c' // Orange
    },
    {
      id: 5,
      major: 'B',
      minor: 'G#m',
      sharps: 5,
      flats: 0,
      keySignatureText: '5 Sostenidos (F#, C#, G#, D#, A#)',
      accidentals: ['F#', 'C#', 'G#', 'D#', 'A#'],
      majorPitch: 11,  // B
      minorPitch: 8,   // G#
      enharmonicMajor: 'Cb',
      enharmonicMinor: 'Abm',
      color: '#f87171' // Coral Red
    },
    {
      id: 6,
      major: 'F#',
      minor: 'D#m',
      sharps: 6,
      flats: 6,
      keySignatureText: '6 Sostenidos / 6 Bemoles',
      accidentals: ['F#', 'C#', 'G#', 'D#', 'A#', 'E#'],
      majorPitch: 6,   // F#
      minorPitch: 3,   // D#
      enharmonicMajor: 'Gb',
      enharmonicMinor: 'Ebm',
      color: '#e879f9' // Pink Fuchsia
    },
    {
      id: 7,
      major: 'Db',
      minor: 'Bbm',
      sharps: 0,
      flats: 5,
      keySignatureText: '5 Bemoles (Bb, Eb, Ab, Db, Gb)',
      accidentals: ['Bb', 'Eb', 'Ab', 'Db', 'Gb'],
      majorPitch: 1,   // Db
      minorPitch: 10,  // Bb
      enharmonicMajor: 'C#',
      enharmonicMinor: 'A#m',
      color: '#c084fc' // Purple
    },
    {
      id: 8,
      major: 'Ab',
      minor: 'Fm',
      sharps: 0,
      flats: 4,
      keySignatureText: '4 Bemoles (Bb, Eb, Ab, Db)',
      accidentals: ['Bb', 'Eb', 'Ab', 'Db'],
      majorPitch: 8,   // Ab
      minorPitch: 5,   // F
      enharmonicMajor: 'G#',
      enharmonicMinor: null,
      color: '#818cf8' // Indigo
    },
    {
      id: 9,
      major: 'Eb',
      minor: 'Cm',
      sharps: 0,
      flats: 3,
      keySignatureText: '3 Bemoles (Bb, Eb, Ab)',
      accidentals: ['Bb', 'Eb', 'Ab'],
      majorPitch: 3,   // Eb
      minorPitch: 0,   // C
      enharmonicMajor: 'D#',
      enharmonicMinor: null,
      color: '#60a5fa' // Blue
    },
    {
      id: 10,
      major: 'Bb',
      minor: 'Gm',
      sharps: 0,
      flats: 2,
      keySignatureText: '2 Bemoles (Bb, Eb)',
      accidentals: ['Bb', 'Eb'],
      majorPitch: 10,  // Bb
      minorPitch: 7,   // G
      enharmonicMajor: 'A#',
      enharmonicMinor: null,
      color: '#2dd4bf' // Teal
    },
    {
      id: 11,
      major: 'F',
      minor: 'Dm',
      sharps: 0,
      flats: 1,
      keySignatureText: '1 Bemol (Bb)',
      accidentals: ['Bb'],
      majorPitch: 5,   // F
      minorPitch: 2,   // D
      enharmonicMajor: null,
      enharmonicMinor: null,
      color: '#06b6d4' // Deep Sky Blue
    }
  ];

  // Musical Intervals definition
  const INTERVALS = [
    { name: 'Tónica (Unísono)', short: 'P1', semitones: 0, circleSteps: 0, desc: 'Misma nota fundamental.' },
    { name: 'Segunda Menor', short: 'm2', semitones: 1, circleSteps: 5, desc: '1 semitono (Fricción tensa, suspenso).' },
    { name: 'Segunda Mayor', short: 'M2', semitones: 2, circleSteps: 2, desc: '2 semitonos (Tono entero, paso escalar).' },
    { name: 'Tercera Menor', short: 'm3', semitones: 3, circleSteps: 9, desc: '3 semitonos (Carácter melancólico/triste).' },
    { name: 'Tercera Mayor', short: 'M3', semitones: 4, circleSteps: 4, desc: '4 semitonos (Carácter brillante/alegre).' },
    { name: 'Cuarta Justa', short: 'P4', semitones: 5, circleSteps: 11, desc: '5 semitonos (Subdominante, 1 paso antihorario).' },
    { name: 'Tritono / 5ta Dism.', short: 'TT/d5', semitones: 6, circleSteps: 6, desc: '6 semitonos (Polo opuesto en el círculo, máxima tensión).' },
    { name: 'Quinta Justa', short: 'P5', semitones: 7, circleSteps: 1, desc: '7 semitonos (Dominante, 1 paso horario).' },
    { name: 'Sexta Menor', short: 'm6', semitones: 8, circleSteps: 8, desc: '8 semitonos (Sonido emotivo/dramático).' },
    { name: 'Sexta Mayor', short: 'M6', semitones: 9, circleSteps: 3, desc: '9 semitonos (Cálido, relativo menor).' },
    { name: 'Séptima Menor', short: 'm7', semitones: 10, circleSteps: 10, desc: '10 semitonos (Dominante 7ma, blues/funk).' },
    { name: 'Séptima Mayor', short: 'M7', semitones: 11, circleSteps: 5, desc: '11 semitonos (Sensible, sonido etéreo jazz).' },
    { name: 'Octava Justa', short: 'P8', semitones: 12, circleSteps: 0, desc: '12 semitonos (Consonancia perfecta).' }
  ];

  // Scale Definitions (Offsets in semitones from root)
  const SCALES = {
    major: {
      name: 'Mayor (Jónico)',
      intervals: [0, 2, 4, 5, 7, 9, 11],
      degrees: ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'],
      chordTypes: ['maj', 'min', 'min', 'maj', 'maj', 'min', 'dim'],
      seventhChordTypes: ['maj7', 'm7', 'm7', 'maj7', '7', 'm7', 'm7b5'],
      description: 'La base tonal de la música occidental. Sonido brillante, optimista y resuelto.'
    },
    natural_minor: {
      name: 'Menor Natural (Eólico)',
      intervals: [0, 2, 3, 5, 7, 8, 10],
      degrees: ['i', 'ii°', '♭III', 'iv', 'v', '♭VI', '♭VII'],
      chordTypes: ['min', 'dim', 'maj', 'min', 'min', 'maj', 'maj'],
      seventhChordTypes: ['m7', 'm7b5', 'maj7', 'm7', 'm7', 'maj7', '7'],
      description: 'Melancólica y emotiva. Comparte armadura con su relativo mayor.'
    },
    harmonic_minor: {
      name: 'Menor Armónica',
      intervals: [0, 2, 3, 5, 7, 8, 11],
      degrees: ['i', 'ii°', '♭III+', 'iv', 'V', '♭VI', 'vii°'],
      chordTypes: ['min', 'dim', 'aug', 'min', 'maj', 'maj', 'dim'],
      seventhChordTypes: ['mMaj7', 'm7b5', 'maj7#5', 'm7', '7', 'maj7', 'dim7'],
      description: 'Con 7ma mayor para crear dominante fuerte (V7). Tinte exótico y clásico.'
    },
    dorian: {
      name: 'Dórico',
      intervals: [0, 2, 3, 5, 7, 9, 10],
      degrees: ['i', 'ii', '♭III', 'IV', 'v', 'vi°', '♭VII'],
      chordTypes: ['min', 'min', 'maj', 'maj', 'min', 'dim', 'maj'],
      seventhChordTypes: ['m7', 'm7', 'maj7', '7', 'm7', 'm7b5', 'maj7'],
      description: 'Modo menor con 6ta mayor. Sonido jazzístico, funk y cinematográfico (ej: Pink Floyd, Santana).'
    },
    phrygian: {
      name: 'Frigio',
      intervals: [0, 1, 3, 5, 7, 8, 10],
      degrees: ['i', '♭II', '♭III', 'iv', 'v°', '♭VI', '♭vii'],
      chordTypes: ['min', 'maj', 'maj', 'min', 'dim', 'maj', 'min'],
      seventhChordTypes: ['m7', 'maj7', '7', 'm7', 'm7b5', 'maj7', 'm7'],
      description: 'Modo menor con 2da menor. Sonido flamenco, español, misterioso y oscuro.'
    },
    lydian: {
      name: 'Lidio',
      intervals: [0, 2, 4, 6, 7, 9, 11],
      degrees: ['I', 'II', 'iii', '#iv°', 'V', 'vi', 'vii'],
      chordTypes: ['maj', 'maj', 'min', 'dim', 'maj', 'min', 'min'],
      seventhChordTypes: ['maj7#11', '7', 'm7', 'm7b5', 'maj7', 'm7', 'm7'],
      description: 'Modo mayor con 4ta aumentada. Mágico, etéreo, sci-fi (ej: Star Wars, Los Simpsons).'
    },
    mixolydian: {
      name: 'Mixolidio',
      intervals: [0, 2, 4, 5, 7, 9, 10],
      degrees: ['I', 'ii', 'iii°', 'IV', 'v', 'vi', '♭VII'],
      chordTypes: ['maj', 'min', 'dim', 'maj', 'min', 'min', 'maj'],
      seventhChordTypes: ['7', 'm7', 'm7b5', 'maj7', 'm7', 'm7', 'maj7'],
      description: 'Modo mayor con 7ma menor. El rey del Rock, Blues y Jam Bands.'
    },
    pentatonic_major: {
      name: 'Pentatónica Mayor',
      intervals: [0, 2, 4, 7, 9],
      degrees: ['1', '2', '3', '5', '6'],
      chordTypes: ['maj', 'sus2', 'maj', 'sus4', 'min'],
      seventhChordTypes: ['maj', 'sus2', 'maj', 'sus4', 'min'],
      description: '5 notas esenciales sin semitonos disonantes. Dulce, folklórica y universal.'
    },
    pentatonic_minor: {
      name: 'Pentatónica Menor / Blues',
      intervals: [0, 3, 5, 6, 7, 10],
      degrees: ['1', '♭3', '4', '♭5', '5', '♭7'],
      chordTypes: ['min', 'maj', 'min', 'dim', 'min', 'maj'],
      seventhChordTypes: ['m7', 'maj7', '7', 'dim', 'm7', '7'],
      description: 'La columna vertebral del Blues, Rock y Solos legendarios de guitarra.'
    }
  };

  // Chord Formula database with semitone intervals from root
  const CHORD_FORMULAS = {
    maj: { name: 'Mayor', symbol: '', intervals: [0, 4, 7], quality: 'major' },
    min: { name: 'Menor', symbol: 'm', intervals: [0, 3, 7], quality: 'minor' },
    dim: { name: 'Disminuido', symbol: '°', intervals: [0, 3, 6], quality: 'diminished' },
    aug: { name: 'Aumentado', symbol: '+', intervals: [0, 4, 8], quality: 'augmented' },
    '7': { name: 'Dominante 7ma', symbol: '7', intervals: [0, 4, 7, 10], quality: 'dominant' },
    maj7: { name: 'Mayor 7ma', symbol: 'maj7', intervals: [0, 4, 7, 11], quality: 'major7' },
    m7: { name: 'Menor 7ma', symbol: 'm7', intervals: [0, 3, 7, 10], quality: 'minor7' },
    m7b5: { name: 'Semidisminuido', symbol: 'ø7', intervals: [0, 3, 6, 10], quality: 'half-dim' },
    dim7: { name: 'Disminuido 7ma', symbol: '°7', intervals: [0, 3, 6, 9], quality: 'diminished' },
    sus2: { name: 'Suspendido 2', symbol: 'sus2', intervals: [0, 2, 7], quality: 'suspended' },
    sus4: { name: 'Suspendido 4', symbol: 'sus4', intervals: [0, 5, 7], quality: 'suspended' },
    add9: { name: 'Mayor add9', symbol: 'add9', intervals: [0, 4, 7, 14], quality: 'extended' },
    '9': { name: 'Dominante 9na', symbol: '9', intervals: [0, 4, 7, 10, 14], quality: 'dominant' },
    m9: { name: 'Menor 9na', symbol: 'm9', intervals: [0, 3, 7, 10, 14], quality: 'minor' },
    maj9: { name: 'Mayor 9na', symbol: 'maj9', intervals: [0, 4, 7, 11, 14], quality: 'major' },
    '11': { name: 'Dominante 11na', symbol: '11', intervals: [0, 4, 7, 10, 14, 17], quality: 'extended' },
    '13': { name: 'Dominante 13na', symbol: '13', intervals: [0, 4, 7, 10, 14, 21], quality: 'extended' },
    mMaj7: { name: 'Menor Mayor 7ma', symbol: 'mMaj7', intervals: [0, 3, 7, 11], quality: 'minor-major' },
    'maj7#5': { name: 'Mayor 7 Aumentado', symbol: 'maj7#5', intervals: [0, 4, 8, 11], quality: 'augmented' },
    'maj7#11': { name: 'Lidio Maj7#11', symbol: 'maj7#11', intervals: [0, 4, 7, 11, 18], quality: 'extended' }
  };

  // Curated Famous Style Progressions
  const STYLE_PROGRESSIONS = [
    {
      id: 'pop_axis',
      category: 'Pop & Éxitos',
      name: 'La Progresión de los 4 Acordes Pop',
      degrees: ['I', 'V', 'vi', 'IV'],
      pattern: [
        { degree: 'I', offset: 0, type: 'maj', label: 'Tónica' },
        { degree: 'V', offset: 7, type: 'maj', label: 'Dominante' },
        { degree: 'vi', offset: 9, type: 'min', label: 'Relativa Menor' },
        { degree: 'IV', offset: 5, type: 'maj', label: 'Subdominante' }
      ],
      bpm: 110,
      description: 'Utilizada en cientos de hits mundiales (Let It Be, Don\'t Stop Believin\', Someone Like You).',
      tags: ['Pop', 'Comercial', 'Himno']
    },
    {
      id: 'pop_doowop',
      category: 'Pop & Éxitos',
      name: 'Cadencia Doo-Wop Clásica (50s)',
      degrees: ['I', 'vi', 'IV', 'V'],
      pattern: [
        { degree: 'I', offset: 0, type: 'maj', label: 'Tónica' },
        { degree: 'vi', offset: 9, type: 'min', label: 'Relativa Menor' },
        { degree: 'IV', offset: 5, type: 'maj', label: 'Subdominante' },
        { degree: 'V', offset: 7, type: 'maj', label: 'Dominante' }
      ],
      bpm: 96,
      description: 'El sonido nostálgico de los años 50 y baladas atemporales (Stand By Me, Unchained Melody).',
      tags: ['Nostalgia', 'Balada', '50s']
    },
    {
      id: 'pop_sensitive',
      category: 'Pop & Éxitos',
      name: 'Progresión Emotiva / Épica',
      degrees: ['vi', 'IV', 'I', 'V'],
      pattern: [
        { degree: 'vi', offset: 9, type: 'min', label: 'Tónica Menor' },
        { degree: 'IV', offset: 5, type: 'maj', label: 'Subdominante' },
        { degree: 'I', offset: 0, type: 'maj', label: 'Tónica Mayor' },
        { degree: 'V', offset: 7, type: 'maj', label: 'Dominante' }
      ],
      bpm: 116,
      description: 'Comienza en la menor para dar dramatismo antes de abrirse hacia el brillo mayor (Numb, Faded, Complicated).',
      tags: ['Emotivo', 'Moderno', 'EDM']
    },
    {
      id: 'jazz_iiv_i',
      category: 'Jazz & Bossa',
      name: 'ii - V - I Mayor Estándar',
      degrees: ['ii7', 'V7', 'Imaj7', 'Imaj7'],
      pattern: [
        { degree: 'ii7', offset: 2, type: 'm7', label: 'Subdominante ii' },
        { degree: 'V7', offset: 7, type: '7', label: 'Dominante V' },
        { degree: 'Imaj7', offset: 0, type: 'maj7', label: 'Resolución I' },
        { degree: 'Imaj7', offset: 0, type: 'maj7', label: 'Reposo' }
      ],
      bpm: 120,
      description: 'La columna vertebral armónica de la historia del Jazz (Autumn Leaves, All The Things You Are).',
      tags: ['Jazz', 'Swing', 'Esencial']
    },
    {
      id: 'jazz_minor_turnaround',
      category: 'Jazz & Bossa',
      name: 'iiø7 - V7(♭9) - i (ii-V Menor)',
      degrees: ['iiø7', 'V7', 'i7', 'i7'],
      pattern: [
        { degree: 'iiø7', offset: 2, type: 'm7b5', label: 'Semidisminuido' },
        { degree: 'V7', offset: 7, type: '7', label: 'Dominante Tensa' },
        { degree: 'i7', offset: 9, type: 'm7', label: 'Resolución Menor' },
        { degree: 'i7', offset: 9, type: 'm7', label: 'Reposo Menor' }
      ],
      bpm: 104,
      description: 'Tensión profunda y sofisticada en contexto menor (Blue Bossa, Caravan).',
      tags: ['Jazz', 'Bossa', 'Sofisticado']
    },
    {
      id: 'jazz_tritone',
      category: 'Jazz & Bossa',
      name: 'Sustitución Tritonal (ii7 - ♭II7 - Imaj7)',
      degrees: ['ii7', '♭II7', 'Imaj7', 'Imaj7'],
      pattern: [
        { degree: 'ii7', offset: 2, type: 'm7', label: 'Segundo Grado' },
        { degree: '♭II7', offset: 1, type: '7', label: 'Sustituto Tritonal' },
        { degree: 'Imaj7', offset: 0, type: 'maj7', label: 'Tónica Mayor' },
        { degree: 'Imaj7', offset: 0, type: 'maj7', label: 'Reposo' }
      ],
      bpm: 110,
      description: 'Movimiento de bajo cromático descendente (Re -> Reb -> Do), sonido muy elegante de Bebop.',
      tags: ['Bebop', 'Cromático', 'Avanzado']
    },
    {
      id: 'blues_standard',
      category: 'Blues & Rock',
      name: '12-Bar Blues Clásico',
      degrees: ['I7', 'IV7', 'I7', 'V7', 'IV7', 'I7'],
      pattern: [
        { degree: 'I7', offset: 0, type: '7', label: 'Tónica 7' },
        { degree: 'IV7', offset: 5, type: '7', label: 'Subdominante 7' },
        { degree: 'I7', offset: 0, type: '7', label: 'Tónica 7' },
        { degree: 'V7', offset: 7, type: '7', label: 'Dominante' },
        { degree: 'IV7', offset: 5, type: '7', label: 'Subdominante' },
        { degree: 'I7', offset: 0, type: '7', label: 'Turnaround' }
      ],
      bpm: 100,
      description: 'El ADN de la música moderna: Blues de Chicago, Rock \'n\' Roll de los 50s y Funk.',
      tags: ['Blues', 'Shuffle', 'Groove']
    },
    {
      id: 'rock_power',
      category: 'Blues & Rock',
      name: 'Rock Clásico con Subtónica (I - ♭VII - IV)',
      degrees: ['I', '♭VII', 'IV', 'I'],
      pattern: [
        { degree: 'I', offset: 0, type: 'maj', label: 'Tónica' },
        { degree: '♭VII', offset: 10, type: 'maj', label: 'Subtónica Mixolidia' },
        { degree: 'IV', offset: 5, type: 'maj', label: 'Subdominante' },
        { degree: 'I', offset: 0, type: 'maj', label: 'Resolución' }
      ],
      bpm: 128,
      description: 'Sonido himno de estadio, clásico de Led Zeppelin, AC/DC, Guns N\' Roses y Lynyrd Skynyrd.',
      tags: ['Hard Rock', 'Energía', 'Estadio']
    },
    {
      id: 'flamenco_andalusian',
      category: 'Flamenco & Latino',
      name: 'Cadencia Andaluza (i - ♭VII - ♭VI - V)',
      degrees: ['i', '♭VII', '♭VI', 'V'],
      pattern: [
        { degree: 'i', offset: 9, type: 'min', label: 'Tónica Menor' },
        { degree: '♭VII', offset: 7, type: 'maj', label: 'Subtónica' },
        { degree: '♭VI', offset: 5, type: 'maj', label: 'Sexta Menor' },
        { degree: 'V', offset: 4, type: 'maj', label: 'Dominante Frigio' }
      ],
      bpm: 112,
      description: 'El alma de la música española y flamenca. Paso descendente por tonos y semitono final.',
      tags: ['Flamenco', 'Español', 'Pasión']
    },
    {
      id: 'bossa_clásica',
      category: 'Flamenco & Latino',
      name: 'Bossa Nova Ipanema (Imaj7 - II7 - ii7 - V7)',
      degrees: ['Imaj7', 'II7', 'ii7', 'V7'],
      pattern: [
        { degree: 'Imaj7', offset: 0, type: 'maj7', label: 'Tónica Suave' },
        { degree: 'II7', offset: 2, type: '7', label: 'Dominante Secundaria' },
        { degree: 'ii7', offset: 2, type: 'm7', label: 'Segundo Grado' },
        { degree: 'V7', offset: 7, type: '7', label: 'Dominante' }
      ],
      bpm: 125,
      description: 'Armonía carioca sofisticada con dominante secundaria (Garota de Ipanema, Wave).',
      tags: ['Bossa Nova', 'Brasil', 'Suave']
    },
    {
      id: 'neosoul_lofi',
      category: 'Neo-Soul & R&B',
      name: 'Neo-Soul Chill (ii9 - V13 - Imaj9)',
      degrees: ['ii9', 'V13', 'Imaj9', 'vi9'],
      pattern: [
        { degree: 'ii9', offset: 2, type: 'm9', label: 'Menor 9na Cálida' },
        { degree: 'V13', offset: 7, type: '13', label: 'Dominante Extendida' },
        { degree: 'Imaj9', offset: 0, type: 'maj9', label: 'Mayor 9na Aterciopelada' },
        { degree: 'vi9', offset: 9, type: 'm9', label: 'Relativa Menor 9na' }
      ],
      bpm: 82,
      description: 'Acordes extendidos con atmósfera relajada y moderna (D\'Angelo, Erykah Badu, Tom Misch).',
      tags: ['Neo-Soul', 'Lo-Fi', 'Groove Lento']
    },
    {
      id: 'cinematic_hero',
      category: 'Cine & Épico',
      name: 'Viaje del Héroe Cinematográfico',
      degrees: ['I', '♭VI', '♭III', '♭VII'],
      pattern: [
        { degree: 'I', offset: 0, type: 'maj', label: 'Tónica Triunfante' },
        { degree: '♭VI', offset: 8, type: 'maj', label: 'Intercambio Modal' },
        { degree: '♭III', offset: 3, type: 'maj', label: 'Mediante Cromática' },
        { degree: '♭VII', offset: 10, type: 'maj', label: 'Subtónica Heroica' }
      ],
      bpm: 90,
      description: 'Sonido grandioso de bandas sonoras de Hollywood (Hans Zimmer, John Williams, Marvel).',
      tags: ['Cine', 'Épico', 'Banda Sonora']
    }
  ];

  // Helper Functions
  function getPitchClass(noteName) {
    if (!noteName) return 0;
    const clean = noteName.replace(/m|maj7|m7|7|dim|aug|9|11|13|b5|\+|°|ø7/g, '');
    let idx = NOTE_NAMES.indexOf(clean);
    if (idx === -1) {
      idx = NOTE_NAMES_FLAT.indexOf(clean);
    }
    return idx >= 0 ? idx : 0;
  }

  function getNoteName(pitch, preferFlats = false) {
    const normalized = ((pitch % 12) + 12) % 12;
    return preferFlats ? NOTE_NAMES_FLAT[normalized] : NOTE_NAMES[normalized];
  }

  function getKeyByIndex(index) {
    const norm = ((index % 12) + 12) % 12;
    return CIRCLE_KEYS[norm];
  }

  function getKeyByMajor(majorName) {
    return CIRCLE_KEYS.find(k => k.major === majorName || k.enharmonicMajor === majorName) || CIRCLE_KEYS[0];
  }

  function getKeyByMinor(minorName) {
    return CIRCLE_KEYS.find(k => k.minor === minorName || k.enharmonicMinor === minorName) || CIRCLE_KEYS[0];
  }

  // Get notes for a specific scale rooted at key
  function getScaleNotes(rootPitch, scaleKey = 'major', preferFlats = false) {
    const scaleDef = SCALES[scaleKey] || SCALES.major;
    return scaleDef.intervals.map(interval => {
      const notePitch = (rootPitch + interval) % 12;
      return {
        pitch: notePitch,
        name: getNoteName(notePitch, preferFlats),
        interval: interval
      };
    });
  }

  // Get diatonic chords in Roman numerals for a selected key
  function getDiatonicChords(keyIndex, isMinor = false) {
    const key = getKeyByIndex(keyIndex);
    const rootPitch = isMinor ? key.minorPitch : key.majorPitch;
    const preferFlats = key.flats > 0;
    const scaleKey = isMinor ? 'natural_minor' : 'major';
    const scaleDef = SCALES[scaleKey];

    return scaleDef.intervals.map((semitones, idx) => {
      const chordRootPitch = (rootPitch + semitones) % 12;
      const chordRootName = getNoteName(chordRootPitch, preferFlats);
      const triadType = scaleDef.chordTypes[idx];
      const seventhType = scaleDef.seventhChordTypes[idx];
      const romanDegree = scaleDef.degrees[idx];
      
      const formula = CHORD_FORMULAS[triadType] || CHORD_FORMULAS.maj;
      const formula7th = CHORD_FORMULAS[seventhType] || CHORD_FORMULAS['7'];

      const triadNotes = formula.intervals.map(i => (chordRootPitch + i) % 12);
      const seventhNotes = formula7th.intervals.map(i => (chordRootPitch + i) % 12);

      // Find if this chord matches a circle key
      const matchingKey = CIRCLE_KEYS.find(k => 
        (triadType === 'maj' && k.majorPitch === chordRootPitch) ||
        (triadType === 'min' && k.minorPitch === chordRootPitch)
      );

      return {
        degree: romanDegree,
        rootPitch: chordRootPitch,
        rootName: chordRootName,
        triadName: chordRootName + formula.symbol,
        seventhName: chordRootName + formula7th.symbol,
        triadType: triadType,
        seventhType: seventhType,
        triadNotes: triadNotes,
        seventhNotes: seventhNotes,
        circleKeyIndex: matchingKey ? matchingKey.id : null,
        isTonic: idx === 0,
        isDominant: idx === (isMinor ? 4 : 4),
        isSubdominant: idx === (isMinor ? 3 : 3)
      };
    });
  }

  // Compute notes for any chord by root name and formula
  function getChordNotes(rootPitch, chordType = 'maj', octave = 4) {
    const formula = CHORD_FORMULAS[chordType] || CHORD_FORMULAS.maj;
    return formula.intervals.map(semitones => {
      const totalSemitones = rootPitch + semitones;
      const notePitch = totalSemitones % 12;
      const noteOctave = octave + Math.floor((rootPitch + semitones) / 12);
      return {
        pitch: notePitch,
        octave: noteOctave,
        name: getNoteName(notePitch),
        midi: totalSemitones + (octave * 12) + 12
      };
    });
  }

  // Transpose a style progression to a given target key
  function getProgressionInKey(progressionId, keyIndex, isMinor = false) {
    const prog = STYLE_PROGRESSIONS.find(p => p.id === progressionId) || STYLE_PROGRESSIONS[0];
    const key = getKeyByIndex(keyIndex);
    const basePitch = isMinor ? key.minorPitch : key.majorPitch;
    const preferFlats = key.flats > 0;

    const transposedChords = prog.pattern.map((step) => {
      const chordRootPitch = (basePitch + step.offset) % 12;
      const chordRootName = getNoteName(chordRootPitch, preferFlats);
      const formula = CHORD_FORMULAS[step.type] || CHORD_FORMULAS.maj;
      const chordFullName = chordRootName + formula.symbol;
      const notes = formula.intervals.map(i => (chordRootPitch + i) % 12);

      return {
        degree: step.degree,
        label: step.label,
        rootPitch: chordRootPitch,
        rootName: chordRootName,
        chordName: chordFullName,
        chordType: step.type,
        notes: notes
      };
    });

    return {
      ...prog,
      keyName: isMinor ? key.minor : key.major,
      chords: transposedChords
    };
  }

  // Generate a creative random progression with configurable parameters
  function generateRandomProgression(options = {}) {
    const {
      keyIndex = Math.floor(Math.random() * 12),
      isMinor = Math.random() > 0.6,
      complexity = 'diatonic', // 'diatonic', 'extended', 'modal_spice'
      length = 4, // 4 or 8 chords
      bpm = Math.floor(Math.random() * 40) + 85
    } = options;

    const key = getKeyByIndex(keyIndex);
    const basePitch = isMinor ? key.minorPitch : key.majorPitch;
    const preferFlats = key.flats > 0;

    // Common chord movement probabilities based on harmonic function
    const diatonic = getDiatonicChords(keyIndex, isMinor);
    const chosenSteps = [];

    // First chord usually Tonic
    chosenSteps.push(diatonic[0]);

    for (let i = 1; i < length; i++) {
      let candidate;
      const rand = Math.random();

      if (i === length - 1 && rand > 0.3) {
        // Last chord resolves or creates turnaround
        candidate = diatonic[4]; // Dominant V
      } else if (complexity === 'modal_spice' && rand > 0.65) {
        // Borrowed chord (e.g. bVI, bVII, iv in major or IV, bII in minor)
        const modalOffsets = isMinor 
          ? [{ offset: 5, type: 'maj', deg: 'IV (Dórico)' }, { offset: 1, type: 'maj', deg: '♭II (Frigio / Neapolitano)' }]
          : [{ offset: 8, type: 'maj', deg: '♭VI (Intercambio Menor)' }, { offset: 10, type: 'maj', deg: '♭VII (Mixolidio)' }, { offset: 5, type: 'min', deg: 'iv (Menor Subdominante)' }];
        
        const modalChoice = modalOffsets[Math.floor(Math.random() * modalOffsets.length)];
        const modalRootPitch = (basePitch + modalChoice.offset) % 12;
        const modalRootName = getNoteName(modalRootPitch, preferFlats);
        const formula = CHORD_FORMULAS[modalChoice.type];

        candidate = {
          degree: modalChoice.deg,
          rootPitch: modalRootPitch,
          rootName: modalRootName,
          triadName: modalRootName + formula.symbol,
          seventhName: modalRootName + (modalChoice.type === 'maj' ? 'maj7' : 'm7'),
          triadType: modalChoice.type,
          seventhType: modalChoice.type === 'maj' ? 'maj7' : 'm7',
          triadNotes: formula.intervals.map(int => (modalRootPitch + int) % 12),
          seventhNotes: formula.intervals.map(int => (modalRootPitch + int) % 12),
          isSpice: true
        };
      } else {
        // Pick diatonic chord with weighted preferences
        const weights = isMinor ? [0, 2, 3, 4, 5, 6] : [1, 2, 3, 4, 5];
        const pickedIdx = weights[Math.floor(Math.random() * weights.length)];
        candidate = diatonic[pickedIdx];
      }

      chosenSteps.push(candidate);
    }

    const formattedChords = chosenSteps.map(step => {
      const use7th = complexity === 'extended' || (complexity === 'modal_spice' && Math.random() > 0.5);
      return {
        degree: step.degree,
        rootPitch: step.rootPitch,
        rootName: step.rootName,
        chordName: use7th ? step.seventhName : step.triadName,
        chordType: use7th ? step.seventhType : step.triadType,
        notes: use7th ? step.seventhNotes : step.triadNotes,
        isSpice: !!step.isSpice
      };
    });

    return {
      name: `Inspiración Generada en ${isMinor ? key.minor : key.major}`,
      keyName: isMinor ? key.minor : key.major,
      keyIndex: keyIndex,
      isMinor: isMinor,
      bpm: bpm,
      complexity: complexity,
      chords: formattedChords
    };
  }

  // Question generator for Practice/Quiz Mode
  function generateQuizQuestion(type = 'random') {
    const questionTypes = ['relative_minor', 'fifth_above', 'fourth_above', 'accidentals_count', 'interval_identify'];
    const selectedType = type === 'random' ? questionTypes[Math.floor(Math.random() * questionTypes.length)] : type;

    const randomKeyIndex = Math.floor(Math.random() * 12);
    const key = getKeyByIndex(randomKeyIndex);

    switch (selectedType) {
      case 'relative_minor': {
        const correct = key.minor;
        const distractorIndices = [(randomKeyIndex + 1) % 12, (randomKeyIndex + 11) % 12, (randomKeyIndex + 5) % 12];
        const options = [correct, ...distractorIndices.map(i => getKeyByIndex(i).minor)].sort(() => Math.random() - 0.5);
        return {
          type: 'relative_minor',
          prompt: `¿Cuál es la tonalidad relativa menor de ${key.major} Mayor?`,
          correctAnswer: correct,
          options: options,
          explanation: `La relativa menor de ${key.major} Mayor es ${key.minor}, ubicada en el mismo cuadrante del círculo (6to grado de la escala mayor).`
        };
      }

      case 'fifth_above': {
        const fifthKey = getKeyByIndex((randomKeyIndex + 1) % 12);
        const correct = fifthKey.major;
        const options = [
          correct,
          getKeyByIndex((randomKeyIndex + 11) % 12).major,
          getKeyByIndex((randomKeyIndex + 6) % 12).major,
          getKeyByIndex((randomKeyIndex + 2) % 12).major
        ].sort(() => Math.random() - 0.5);
        return {
          type: 'fifth_above',
          prompt: `¿Qué tonalidad está a una Quinta Justa ascendente (1 paso horario) de ${key.major}?`,
          correctAnswer: correct,
          options: options,
          explanation: `Avanzar en sentido horario en el Círculo de Quintas equivale a subir una 5ta Justa. De ${key.major} pasamos a ${correct}.`
        };
      }

      case 'fourth_above': {
        const fourthKey = getKeyByIndex((randomKeyIndex + 11) % 12);
        const correct = fourthKey.major;
        const options = [
          correct,
          getKeyByIndex((randomKeyIndex + 1) % 12).major,
          getKeyByIndex((randomKeyIndex + 7) % 12).major,
          getKeyByIndex((randomKeyIndex + 5) % 12).major
        ].sort(() => Math.random() - 0.5);
        return {
          type: 'fourth_above',
          prompt: `¿Qué tonalidad está a una Cuarta Justa ascendente (1 paso antihorario / Círculo de Cuartas) de ${key.major}?`,
          correctAnswer: correct,
          options: options,
          explanation: `Avanzar en sentido antihorario en el círculo representa subir una 4ta Justa (o bajar una 5ta). De ${key.major} pasamos a ${correct}.`
        };
      }

      case 'accidentals_count': {
        const accDesc = key.sharps > 0 ? `${key.sharps} sostenido(s)` : key.flats > 0 ? `${key.flats} bemol(es)` : '0 alteraciones (natural)';
        const correct = accDesc;
        const options = [
          correct,
          `${(key.sharps || key.flats) + 1} sostenido(s)`,
          `${(key.sharps || key.flats) + 2} bemol(es)`,
          key.sharps > 0 ? `${key.sharps} bemol(es)` : '0 alteraciones (natural)'
        ].filter((val, idx, self) => self.indexOf(val) === idx);

        while (options.length < 4) {
          options.push(`${Math.floor(Math.random() * 5) + 1} alteración(es)`);
        }

        return {
          type: 'accidentals_count',
          prompt: `¿Cuántas alteraciones (# o ♭) tiene la armadura de clave de ${key.major} Mayor?`,
          correctAnswer: correct,
          options: options.sort(() => Math.random() - 0.5),
          explanation: `La armadura de ${key.major} Mayor tiene ${key.keySignatureText}.`
        };
      }

      case 'interval_identify':
      default: {
        const randomInterval = INTERVALS[Math.floor(Math.random() * (INTERVALS.length - 1)) + 1];
        const targetPitch = (key.majorPitch + randomInterval.semitones) % 12;
        const targetNote = getNoteName(targetPitch, key.flats > 0);
        const correct = targetNote;
        
        const options = [
          correct,
          getNoteName((targetPitch + 1) % 12, key.flats > 0),
          getNoteName((targetPitch + 11) % 12, key.flats > 0),
          getNoteName((targetPitch + 6) % 12, key.flats > 0)
        ].sort(() => Math.random() - 0.5);

        return {
          type: 'interval_identify',
          prompt: `¿Cuál es el intervalo de ${randomInterval.name} (${randomInterval.short}, ${randomInterval.semitones} semitonos) a partir de la nota ${key.major}?`,
          correctAnswer: correct,
          options: options,
          explanation: `A partir de ${key.major}, sumando ${randomInterval.semitones} semitonos llegamos a ${correct}.`
        };
      }
    }
  }

  return {
    CIRCLE_KEYS,
    INTERVALS,
    SCALES,
    CHORD_FORMULAS,
    STYLE_PROGRESSIONS,
    NOTE_NAMES,
    NOTE_NAMES_FLAT,
    getPitchClass,
    getNoteName,
    getKeyByIndex,
    getKeyByMajor,
    getKeyByMinor,
    getScaleNotes,
    getDiatonicChords,
    getChordNotes,
    getProgressionInKey,
    generateRandomProgression,
    generateQuizQuestion
  };
})();

if (typeof window !== 'undefined') {
  window.MusicTheory = MusicTheory;
}
