export interface ChordDiagramData {
  name: string;
  frets?: number[];
  fingers?: number[];
  baseFret?: number;
  barres?: { fret: number; stringFrom: number; stringTo: number }[];
  pianoNotes: number[];
}

const NOTE_TO_NUM: Record<string, number> = {
  C: 0, 'C#': 1, Db: 1,
  D: 2, 'D#': 3, Eb: 3,
  E: 4, Fb: 4,
  F: 5, 'F#': 6, Gb: 6,
  G: 7, 'G#': 8, Ab: 8,
  A: 9, 'A#': 10, Bb: 10,
  B: 11, Cb: 11,
};

const CHORD_INTERVALS: Record<string, number[]> = {
  '': [0, 4, 7],
  m: [0, 3, 7],
  '7': [0, 4, 7, 10],
  maj7: [0, 4, 7, 11],
  m7: [0, 3, 7, 10],
  sus4: [0, 5, 7],
  dim: [0, 3, 6],
  aug: [0, 4, 8],
  dim7: [0, 3, 6, 9],
  m7b5: [0, 3, 6, 10],
  '6': [0, 4, 7, 9],
  m6: [0, 3, 7, 9],
  '9': [0, 4, 7, 10, 14],
  sus2: [0, 2, 7],
};

function generatePianoNotes(root: string, type: string): number[] {
  const rootNum = NOTE_TO_NUM[root];
  if (rootNum === undefined) return [];
  const intervals = CHORD_INTERVALS[type];
  if (!intervals) return [];
  return intervals.map(i => (rootNum + i) % 12);
}

function parseChord(chordRaw: string): { root: string; type: string } | null {
  const match = chordRaw.match(/^([A-G](?:#|b)?)(.*)$/i);
  if (!match) return null;
  const root = match[1].charAt(0).toUpperCase() + match[1].slice(1);
  let type = match[2];
  const typeMap: Record<string, string> = {
    m7b5: 'm7b5', dim7: 'dim7', m7: 'm7', maj7: 'maj7', maj: 'maj7',
    m6: 'm6', m9: 'm7', m11: 'm7',
    sus4: 'sus4', sus: 'sus4', sus2: 'sus2',
    dim: 'dim', aug: 'aug',
    m: 'm', min: 'm',
    M7: 'maj7',
    '7': '7', '6': '6', '9': '7',
  };
  type = typeMap[type] ?? '';
  return { root, type };
}

export function getChordDiagram(chordRaw: string): ChordDiagramData | null {
  const exact = chordDiagrams[chordRaw];
  if (exact) return exact;

  const parsed = parseChord(chordRaw);
  if (!parsed) return null;

  const pianoNotes = generatePianoNotes(parsed.root, parsed.type);
  if (pianoNotes.length === 0) return null;

  return {
    name: chordRaw,
    pianoNotes,
  };
}

export const chordDiagrams: Record<string, ChordDiagramData> = {
  C: { name: 'C', frets: [-1, 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0], baseFret: 1, pianoNotes: [0, 4, 7] },
  Cm: { name: 'Cm', frets: [-1, 3, 5, 5, 4, 3], fingers: [0, 1, 3, 4, 2, 1], baseFret: 3, barres: [{ fret: 3, stringFrom: 1, stringTo: 5 }], pianoNotes: [0, 3, 7] },
  C7: { name: 'C7', frets: [-1, 3, 2, 3, 1, 0], fingers: [0, 2, 1, 3, 1, 0], baseFret: 1, pianoNotes: [0, 4, 7, 10] },
  Cmaj7: { name: 'Cmaj7', frets: [-1, 3, 2, 0, 0, 0], fingers: [0, 2, 1, 0, 0, 0], baseFret: 1, pianoNotes: [0, 4, 7, 11] },
  Cm7: { name: 'Cm7', frets: [-1, 3, 5, 3, 4, 3], fingers: [0, 1, 3, 1, 2, 1], baseFret: 3, barres: [{ fret: 3, stringFrom: 1, stringTo: 5 }], pianoNotes: [0, 3, 7, 10] },

  'C#': { name: 'C#', frets: [-1, 4, 6, 6, 5, 4], fingers: [0, 1, 3, 4, 2, 1], baseFret: 4, barres: [{ fret: 4, stringFrom: 1, stringTo: 5 }], pianoNotes: [1, 5, 8] },
  'C#m': { name: 'C#m', frets: [-1, 4, 6, 6, 5, 4], fingers: [0, 1, 3, 4, 2, 1], baseFret: 4, barres: [{ fret: 4, stringFrom: 1, stringTo: 5 }], pianoNotes: [1, 4, 8] },
  'C#7': { name: 'C#7', frets: [-1, 4, 6, 4, 5, 4], fingers: [0, 1, 3, 1, 2, 1], baseFret: 4, barres: [{ fret: 4, stringFrom: 1, stringTo: 5 }], pianoNotes: [1, 5, 8, 11] },
  Db: { name: 'Db', frets: [-1, 4, 6, 6, 5, 4], fingers: [0, 1, 3, 4, 2, 1], baseFret: 4, barres: [{ fret: 4, stringFrom: 1, stringTo: 5 }], pianoNotes: [1, 5, 8] },

  D: { name: 'D', frets: [-1, -1, 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2], baseFret: 1, pianoNotes: [2, 6, 9] },
  Dm: { name: 'Dm', frets: [-1, -1, 0, 2, 3, 1], fingers: [0, 0, 0, 2, 3, 1], baseFret: 1, pianoNotes: [2, 5, 9] },
  D7: { name: 'D7', frets: [-1, -1, 0, 2, 1, 2], fingers: [0, 0, 0, 2, 1, 3], baseFret: 1, pianoNotes: [2, 6, 9, 0] },
  Dmaj7: { name: 'Dmaj7', frets: [-1, -1, 0, 2, 2, 2], fingers: [0, 0, 0, 1, 2, 3], baseFret: 1, pianoNotes: [2, 6, 9, 1] },
  Dm7: { name: 'Dm7', frets: [-1, -1, 0, 2, 1, 1], fingers: [0, 0, 0, 2, 1, 1], baseFret: 1, pianoNotes: [2, 5, 9, 0] },

  'D#': { name: 'D#', frets: [-1, -1, 3, 5, 5, 4], fingers: [0, 0, 1, 2, 4, 1], baseFret: 3, barres: [{ fret: 3, stringFrom: 2, stringTo: 5 }], pianoNotes: [3, 7, 10] },
  'D#m': { name: 'D#m', frets: [-1, -1, 3, 5, 5, 3], fingers: [0, 0, 1, 3, 4, 1], baseFret: 3, barres: [{ fret: 3, stringFrom: 2, stringTo: 5 }], pianoNotes: [3, 6, 10] },
  Eb: { name: 'Eb', frets: [-1, -1, 3, 5, 5, 4], fingers: [0, 0, 1, 2, 4, 1], baseFret: 3, barres: [{ fret: 3, stringFrom: 2, stringTo: 5 }], pianoNotes: [3, 7, 10] },
  Ebm: { name: 'Ebm', frets: [-1, -1, 3, 5, 5, 3], fingers: [0, 0, 1, 3, 4, 1], baseFret: 3, barres: [{ fret: 3, stringFrom: 2, stringTo: 5 }], pianoNotes: [3, 6, 10] },

  E: { name: 'E', frets: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0], baseFret: 1, pianoNotes: [4, 8, 11] },
  Em: { name: 'Em', frets: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0], baseFret: 1, pianoNotes: [4, 7, 11] },
  E7: { name: 'E7', frets: [0, 2, 0, 1, 0, 0], fingers: [0, 2, 0, 1, 0, 0], baseFret: 1, pianoNotes: [4, 8, 11, 2] },
  Emaj7: { name: 'Emaj7', frets: [0, 2, 1, 1, 0, 0], fingers: [0, 2, 1, 1, 0, 0], baseFret: 1, pianoNotes: [4, 8, 11, 3] },
  Em7: { name: 'Em7', frets: [0, 2, 0, 0, 0, 0], fingers: [0, 2, 0, 0, 0, 0], baseFret: 1, pianoNotes: [4, 7, 11, 2] },

  F: { name: 'F', frets: [1, 3, 3, 2, 1, 1], fingers: [1, 3, 4, 2, 1, 1], baseFret: 1, barres: [{ fret: 1, stringFrom: 0, stringTo: 5 }], pianoNotes: [5, 9, 0] },
  Fm: { name: 'Fm', frets: [1, 3, 3, 1, 1, 1], fingers: [1, 3, 4, 1, 1, 1], baseFret: 1, barres: [{ fret: 1, stringFrom: 0, stringTo: 5 }], pianoNotes: [5, 8, 0] },
  F7: { name: 'F7', frets: [1, 3, 1, 2, 1, 1], fingers: [1, 3, 1, 2, 1, 1], baseFret: 1, barres: [{ fret: 1, stringFrom: 0, stringTo: 5 }], pianoNotes: [5, 9, 0, 3] },
  Fmaj7: { name: 'Fmaj7', frets: [-1, -1, 3, 2, 1, 0], fingers: [0, 0, 3, 2, 1, 0], baseFret: 1, pianoNotes: [5, 9, 0, 4] },

  'F#': { name: 'F#', frets: [2, 4, 4, 3, 2, 2], fingers: [1, 3, 4, 2, 1, 1], baseFret: 2, barres: [{ fret: 2, stringFrom: 0, stringTo: 5 }], pianoNotes: [6, 10, 1] },
  'F#m': { name: 'F#m', frets: [2, 4, 4, 2, 2, 2], fingers: [1, 3, 4, 1, 1, 1], baseFret: 2, barres: [{ fret: 2, stringFrom: 0, stringTo: 5 }], pianoNotes: [6, 9, 1] },
  'F#7': { name: 'F#7', frets: [2, 4, 2, 3, 2, 2], fingers: [1, 3, 1, 2, 1, 1], baseFret: 2, barres: [{ fret: 2, stringFrom: 0, stringTo: 5 }], pianoNotes: [6, 10, 1, 4] },
  Gb: { name: 'Gb', frets: [2, 4, 4, 3, 2, 2], fingers: [1, 3, 4, 2, 1, 1], baseFret: 2, barres: [{ fret: 2, stringFrom: 0, stringTo: 5 }], pianoNotes: [6, 10, 1] },

  G: { name: 'G', frets: [3, 2, 0, 0, 0, 3], fingers: [2, 1, 0, 0, 0, 3], baseFret: 1, pianoNotes: [7, 11, 2] },
  Gm: { name: 'Gm', frets: [3, 5, 5, 3, 3, 3], fingers: [1, 3, 4, 1, 1, 1], baseFret: 3, barres: [{ fret: 3, stringFrom: 0, stringTo: 5 }], pianoNotes: [7, 10, 2] },
  G7: { name: 'G7', frets: [3, 2, 0, 0, 0, 1], fingers: [2, 1, 0, 0, 0, 3], baseFret: 1, pianoNotes: [7, 11, 2, 5] },
  Gmaj7: { name: 'Gmaj7', frets: [3, 2, 0, 0, 0, 2], fingers: [2, 1, 0, 0, 0, 3], baseFret: 1, pianoNotes: [7, 11, 2, 6] },
  Gm7: { name: 'Gm7', frets: [3, 5, 3, 3, 3, 3], fingers: [1, 3, 1, 1, 1, 1], baseFret: 3, barres: [{ fret: 3, stringFrom: 0, stringTo: 5 }], pianoNotes: [7, 10, 2, 5] },

  'G#': { name: 'G#', frets: [4, 6, 6, 5, 4, 4], fingers: [1, 3, 4, 2, 1, 1], baseFret: 4, barres: [{ fret: 4, stringFrom: 0, stringTo: 5 }], pianoNotes: [8, 0, 3] },
  'G#m': { name: 'G#m', frets: [4, 6, 6, 4, 4, 4], fingers: [1, 3, 4, 1, 1, 1], baseFret: 4, barres: [{ fret: 4, stringFrom: 0, stringTo: 5 }], pianoNotes: [8, 11, 3] },
  Ab: { name: 'Ab', frets: [4, 6, 6, 5, 4, 4], fingers: [1, 3, 4, 2, 1, 1], baseFret: 4, barres: [{ fret: 4, stringFrom: 0, stringTo: 5 }], pianoNotes: [8, 0, 3] },
  Abm: { name: 'Abm', frets: [4, 6, 6, 4, 4, 4], fingers: [1, 3, 4, 1, 1, 1], baseFret: 4, barres: [{ fret: 4, stringFrom: 0, stringTo: 5 }], pianoNotes: [8, 11, 3] },

  A: { name: 'A', frets: [-1, 0, 2, 2, 2, 0], fingers: [0, 0, 1, 2, 3, 0], baseFret: 1, pianoNotes: [9, 1, 4] },
  Am: { name: 'Am', frets: [-1, 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0], baseFret: 1, pianoNotes: [9, 0, 4] },
  A7: { name: 'A7', frets: [-1, 0, 2, 0, 2, 0], fingers: [0, 0, 1, 0, 2, 0], baseFret: 1, pianoNotes: [9, 1, 4, 7] },
  Amaj7: { name: 'Amaj7', frets: [-1, 0, 2, 1, 2, 0], fingers: [0, 0, 2, 1, 3, 0], baseFret: 1, pianoNotes: [9, 1, 4, 8] },
  Am7: { name: 'Am7', frets: [-1, 0, 2, 0, 1, 0], fingers: [0, 0, 2, 0, 1, 0], baseFret: 1, pianoNotes: [9, 0, 4, 7] },

  'A#': { name: 'A#', frets: [-1, 1, 3, 3, 3, 1], fingers: [0, 1, 2, 3, 4, 1], baseFret: 1, barres: [{ fret: 1, stringFrom: 1, stringTo: 5 }], pianoNotes: [10, 2, 5] },
  'A#m': { name: 'A#m', frets: [-1, 1, 3, 3, 2, 1], fingers: [0, 1, 3, 4, 2, 1], baseFret: 1, barres: [{ fret: 1, stringFrom: 1, stringTo: 5 }], pianoNotes: [10, 1, 5] },
  Bb: { name: 'Bb', frets: [-1, 1, 3, 3, 3, 1], fingers: [0, 1, 2, 3, 4, 1], baseFret: 1, barres: [{ fret: 1, stringFrom: 1, stringTo: 5 }], pianoNotes: [10, 2, 5] },
  Bbm: { name: 'Bbm', frets: [-1, 1, 3, 3, 2, 1], fingers: [0, 1, 3, 4, 2, 1], baseFret: 1, barres: [{ fret: 1, stringFrom: 1, stringTo: 5 }], pianoNotes: [10, 1, 5] },

  B: { name: 'B', frets: [-1, 2, 4, 4, 4, 2], fingers: [0, 1, 2, 3, 4, 1], baseFret: 2, barres: [{ fret: 2, stringFrom: 1, stringTo: 5 }], pianoNotes: [11, 3, 6] },
  Bm: { name: 'Bm', frets: [-1, 2, 4, 4, 3, 2], fingers: [0, 1, 3, 4, 2, 1], baseFret: 2, barres: [{ fret: 2, stringFrom: 1, stringTo: 5 }], pianoNotes: [11, 2, 6] },
  B7: { name: 'B7', frets: [-1, 2, 1, 2, 0, 2], fingers: [0, 2, 1, 3, 0, 4], baseFret: 1, pianoNotes: [11, 3, 6, 9] },
  Bm7: { name: 'Bm7', frets: [-1, 2, 0, 2, 0, 2], fingers: [0, 1, 0, 2, 0, 3], baseFret: 1, pianoNotes: [11, 2, 6, 9] },
};
