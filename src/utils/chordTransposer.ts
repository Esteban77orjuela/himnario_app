// src/utils/chordTransposer.ts

// Soporte dual: Inglés (A, B, C) y Latino (La, Si, Do)
const NOTES_EN = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const NOTES_ES = ['Do', 'Do#', 'Re', 'Re#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'La', 'La#', 'Si'];

const FLAT_TO_SHARP_EN: Record<string, string> = {
  'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#',
};
const FLAT_TO_SHARP_ES: Record<string, string> = {
  'Reb': 'Do#', 'Mib': 'Re#', 'Solb': 'Fa#', 'Lab': 'Sol#', 'Sib': 'La#',
};

// Regex mejorada para detectar ambos idiomas
const CHORD_REGEX = /^([CDEFGAB]|Do|Re|Mi|Fa|Sol|La|Si)(#|b)?(.*)$/i;

export const transposeChord = (chord: string, steps: number): string => {
  const match = chord.match(CHORD_REGEX);
  
  if (!match) return chord; 

  let root = match[1];
  const acc = match[2] || '';
  const suffix = match[3] || '';

  // Determinar si es inglés o español
  const isEnglish = /^[CDEFGAB]$/i.test(root);
  
  if (isEnglish) {
    root = root.toUpperCase();
  } else {
    root = root.charAt(0).toUpperCase() + root.slice(1).toLowerCase();
  }

  const fullRoot = root + acc;
  let normalizedRoot = fullRoot;

  if (isEnglish && FLAT_TO_SHARP_EN[fullRoot]) {
    normalizedRoot = FLAT_TO_SHARP_EN[fullRoot];
  } else if (!isEnglish && FLAT_TO_SHARP_ES[fullRoot]) {
    normalizedRoot = FLAT_TO_SHARP_ES[fullRoot];
  }

  const NOTES = isEnglish ? NOTES_EN : NOTES_ES;
  const currentIndex = NOTES.indexOf(normalizedRoot);
  
  if (currentIndex === -1) return chord;

  const newIndex = (currentIndex + steps + 120) % 12;
  return NOTES[newIndex] + suffix;
};

/**
 * Procesa una línea de texto completa, transponiendo únicamente los acordes detectados.
 * Ideal para procesar la letra extraída del Web Scraper línea por línea.
 */
export const transposeLine = (line: string, steps: number): string => {
  if (steps === 0) return line;

  // Separa la línea por espacios, pero manteniendo los espacios intactos para no desalinear los acordes
  const tokens = line.split(/(\s+)/);
  
  return tokens.map(token => {
    if (!token.trim()) return token; // Ignorar espacios en blanco
    
    // Soporte avanzado: Si el acorde viene envuelto en corchetes "[Dom]" (Formato muy usado en LaCuerda)
    const bracketMatch = token.match(/^\[(.*)\]$/);
    if (bracketMatch) {
      const transposed = transposeChord(bracketMatch[1], steps);
      return `[${transposed}]`;
    }

    // Si es un acorde suelto (Ej: en una línea que solo tiene acordes)
    return transposeChord(token, steps);
  }).join('');
};
