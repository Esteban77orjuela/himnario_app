export interface ChordDiagramData {
  name: string;
  frets: number[]; // Guitarra
  fingers: number[]; // Guitarra
  baseFret: number; // Guitarra
  barres?: { fret: number; stringFrom: number; stringTo: number }[]; // Guitarra
  pianoNotes: number[]; // Notas para piano (0=Do, 1=Do#, 2=Re, ..., 11=Si)
}

// Diagramas de acordes básicos (Mayores y Menores naturales)
export const chordDiagrams: Record<string, ChordDiagramData> = {
  // Do Mayor (C)
  C: {
    name: 'C',
    frets: [-1, 3, 2, 0, 1, 0],
    fingers: [0, 3, 2, 0, 1, 0],
    baseFret: 1,
    pianoNotes: [0, 4, 7], // C, E, G
  },
  Cm: {
    name: 'Cm',
    frets: [-1, 3, 5, 5, 4, 3],
    fingers: [0, 1, 3, 4, 2, 1],
    baseFret: 3,
    barres: [{ fret: 3, stringFrom: 1, stringTo: 5 }],
    pianoNotes: [0, 3, 7], // C, Eb, G
  },
  // Re Mayor (D)
  D: {
    name: 'D',
    frets: [-1, -1, 0, 2, 3, 2],
    fingers: [0, 0, 0, 1, 3, 2],
    baseFret: 1,
    pianoNotes: [2, 6, 9], // D, F#, A
  },
  Dm: {
    name: 'Dm',
    frets: [-1, -1, 0, 2, 3, 1],
    fingers: [0, 0, 0, 2, 3, 1],
    baseFret: 1,
    pianoNotes: [2, 5, 9], // D, F, A
  },
  // Mi Mayor (E)
  E: {
    name: 'E',
    frets: [0, 2, 2, 1, 0, 0],
    fingers: [0, 2, 3, 1, 0, 0],
    baseFret: 1,
    pianoNotes: [4, 8, 11], // E, G#, B
  },
  Em: {
    name: 'Em',
    frets: [0, 2, 2, 0, 0, 0],
    fingers: [0, 2, 3, 0, 0, 0],
    baseFret: 1,
    pianoNotes: [4, 7, 11], // E, G, B
  },
  // Fa Mayor (F)
  F: {
    name: 'F',
    frets: [1, 3, 3, 2, 1, 1],
    fingers: [1, 3, 4, 2, 1, 1],
    baseFret: 1,
    barres: [{ fret: 1, stringFrom: 0, stringTo: 5 }],
    pianoNotes: [5, 9, 12], // F, A, C
  },
  Fm: {
    name: 'Fm',
    frets: [1, 3, 3, 1, 1, 1],
    fingers: [1, 3, 4, 1, 1, 1],
    baseFret: 1,
    barres: [{ fret: 1, stringFrom: 0, stringTo: 5 }],
    pianoNotes: [5, 8, 12], // F, Ab, C
  },
  // Sol Mayor (G)
  G: {
    name: 'G',
    frets: [3, 2, 0, 0, 0, 3],
    fingers: [2, 1, 0, 0, 0, 3],
    baseFret: 1,
    pianoNotes: [7, 11, 14], // G, B, D
  },
  Gm: {
    name: 'Gm',
    frets: [3, 5, 5, 3, 3, 3],
    fingers: [1, 3, 4, 1, 1, 1],
    baseFret: 3,
    barres: [{ fret: 3, stringFrom: 0, stringTo: 5 }],
    pianoNotes: [7, 10, 14], // G, Bb, D
  },
  // La Mayor (A)
  A: {
    name: 'A',
    frets: [-1, 0, 2, 2, 2, 0],
    fingers: [0, 0, 1, 2, 3, 0],
    baseFret: 1,
    pianoNotes: [9, 13, 16], // A, C#, E
  },
  Am: {
    name: 'Am',
    frets: [-1, 0, 2, 2, 1, 0],
    fingers: [0, 0, 2, 3, 1, 0],
    baseFret: 1,
    pianoNotes: [9, 12, 16], // A, C, E
  },
  // Si Mayor (B)
  B: {
    name: 'B',
    frets: [-1, 2, 4, 4, 4, 2],
    fingers: [0, 1, 2, 3, 4, 1],
    baseFret: 2,
    barres: [{ fret: 2, stringFrom: 1, stringTo: 5 }],
    pianoNotes: [11, 15, 18], // B, D#, F#
  },
  Bm: {
    name: 'Bm',
    frets: [-1, 2, 4, 4, 3, 2],
    fingers: [0, 1, 3, 4, 2, 1],
    baseFret: 2,
    barres: [{ fret: 2, stringFrom: 1, stringTo: 5 }],
    pianoNotes: [11, 14, 18], // B, D, F#
  },
  
  // Sostenidos / Bemoles principales
  'F#': {
    name: 'F#',
    frets: [2, 4, 4, 3, 2, 2],
    fingers: [1, 3, 4, 2, 1, 1],
    baseFret: 2,
    barres: [{ fret: 2, stringFrom: 0, stringTo: 5 }],
    pianoNotes: [6, 10, 13], // F#, A#, C#
  },
  'F#m': {
    name: 'F#m',
    frets: [2, 4, 4, 2, 2, 2],
    fingers: [1, 3, 4, 1, 1, 1],
    baseFret: 2,
    barres: [{ fret: 2, stringFrom: 0, stringTo: 5 }],
    pianoNotes: [6, 9, 13], // F#, A, C#
  },
  'C#m': {
    name: 'C#m',
    frets: [-1, 4, 6, 6, 5, 4],
    fingers: [0, 1, 3, 4, 2, 1],
    baseFret: 4,
    barres: [{ fret: 4, stringFrom: 1, stringTo: 5 }],
    pianoNotes: [1, 4, 8], // C#, E, G#
  },
};

// Función auxiliar para obtener datos limpios del acorde (elimina variaciones raras temporalmente)
export function getChordDiagram(chordRaw: string): ChordDiagramData | null {
  // Limpiar sufijos complejos para esta versión (ej: Cmaj7 -> C)
  // En el futuro podemos añadir todos.
  const basicChord = chordRaw.replace(/[0-9]|maj|sus|dim|aug/g, '');
  return chordDiagrams[basicChord] || null;
}
