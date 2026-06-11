// src/utils/chordTransposer.ts

// Usamos el sistema latino (Do, Re, Mi) ya que es el estándar para himnarios en español.
const NOTES = ['Do', 'Do#', 'Re', 'Re#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'La', 'La#', 'Si'];

// Mapeo técnico: musicalmente un "Re bemol" (Reb) suena igual que un "Do sostenido" (Do#). 
// Normalizamos todo a sostenidos (#) para que el algoritmo matemático sea exacto.
const FLAT_TO_SHARP: Record<string, string> = {
  'Reb': 'Do#',
  'Mib': 'Re#',
  'Solb': 'Fa#',
  'Lab': 'Sol#',
  'Sib': 'La#',
};

// Expresión regular inteligente: Extrae primero la nota base (Do#) y luego el resto (m7, sus4)
const CHORD_REGEX = /^(Do#|Re#|Fa#|Sol#|La#|Reb|Mib|Solb|Lab|Sib|Do|Re|Mi|Fa|Sol|La|Si)(.*)$/i;

/**
 * Transpone un acorde individual por un número de semitonos.
 * @param chord El acorde original (Ej. "Dom7", "Fa#")
 * @param steps Número de semitonos a subir (+1, +2) o bajar (-1, -2)
 * @returns El acorde transpuesto matemáticamente
 */
export const transposeChord = (chord: string, steps: number): string => {
  const match = chord.match(CHORD_REGEX);
  
  if (!match) {
    // Si la palabra no es un acorde musical válido (ej. "Cantar"), se ignora.
    return chord; 
  }

  let root = match[1]; // Ej. "do"
  // Estandarizar sintaxis: Primera letra mayúscula, resto minúscula ("Do")
  root = root.charAt(0).toUpperCase() + root.slice(1).toLowerCase();
  
  const suffix = match[2]; // Ej. "m7" (Menor 7ma)

  // Si el usuario importó una canción con Bemoles (b), la pasamos a Sostenidos (#)
  if (FLAT_TO_SHARP[root]) {
    root = FLAT_TO_SHARP[root];
  }

  const currentIndex = NOTES.indexOf(root);
  if (currentIndex === -1) return chord; // Falla de seguridad

  // LA MAGIA ARQUITECTÓNICA: Aritmética Modular (Base 12)
  // Sumamos 120 (un múltiplo de 12) para evitar el bug clásico de JS con módulos negativos.
  // Ej: Do (0) - 2 pasos (Si bemol) -> (0 - 2 + 120) % 12 = 118 % 12 = 10 ("La#"). ¡Perfecto!
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
