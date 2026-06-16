export interface WordSegment {
  text: string;
  chord?: string;
  isSpace?: boolean;
}

export function parseLyricsToWords(lyrics: string): WordSegment[][] {
  const lines = lyrics.split('\n');

  return lines.map(line => {
    const segments: WordSegment[] = [];
    let currentChord: string | undefined = undefined;
    let currentText = '';

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '[') {
        // Push accumulated text before the chord
        if (currentText.length > 0) {
          segments.push({ text: currentText, chord: currentChord });
          currentText = '';
          currentChord = undefined;
        }

        // Extract chord
        let chord = '';
        i++;
        while (i < line.length && line[i] !== ']') {
          chord += line[i];
          i++;
        }
        currentChord = chord;
      } else {
        currentText += char;

        // Break by space to allow wrapping
        if (char === ' ') {
          segments.push({ text: currentText, chord: currentChord });
          currentText = '';
          currentChord = undefined;
        }
      }
    }

    if (currentText.length > 0 || currentChord) {
      segments.push({ text: currentText, chord: currentChord });
    }

    return segments;
  });
}

// NUEVA FUNCIÓN: Transpositor súper rápido para canciones importadas de LaCuerda.
// Evita crear miles de componentes React y solo transpone las líneas que detecta como acordes.
import { transposeChord } from './chordTransposer';

export function transposePlainText(lyrics: string, steps: number, showChords: boolean): string {
  if (!showChords) {
    // Si no quiere ver acordes, intentamos ocultar las líneas que son puramente acordes
    return lyrics.split('\n').filter(line => !isChordLine(line)).join('\n');
  }

  if (steps === 0) return lyrics;

  const lines = lyrics.split('\n');
  return lines.map(line => {
    if (isChordLine(line)) {
      // En lugar de usar Regex con \b (que falla con el símbolo #), dividimos por espacios.
      // Usamos /(\s+)/ para mantener los espacios intactos al hacer join().
      const chordRegexExact = /^[A-G][b#]?(?:m|maj|dim|aug|sus|add|[0-9])*$/;

      return line.split(/(\s+)/).map(chunk => {
        if (chordRegexExact.test(chunk)) {
          return transposeChord(chunk, steps);
        }
        return chunk;
      }).join('');
    }
    return line;
  }).join('\n');
}

// Algoritmo para detectar si una línea es de "Solo Acordes" (Formato LaCuerda)
function isChordLine(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return false;

  // Dividimos la línea en palabras (ignorando símbolos como / o | o -)
  const words = trimmed.split(/[\s/|-]+/).filter(w => w.length > 0 && !w.includes('//'));
  if (words.length === 0) return false;

  // Expresión regular matemática para un acorde perfecto
  const chordRegex = /^[A-G][b#]?(?:m|maj|dim|aug|sus|add|[0-9])*$/;
  let chordCount = 0;

  for (const w of words) {
    if (chordRegex.test(w)) chordCount++;
  }

  // Si más del 60% de las palabras parecen acordes, confirmamos que es una línea de acordes
  return chordCount / words.length >= 0.6;
}
