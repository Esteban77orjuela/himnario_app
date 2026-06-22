import { WordSegment } from './lyricsParser';
import { transposeChord } from './chordTransposer';

export function extractUniqueChords(
  parsedLines: WordSegment[][],
  transposeSteps: number
): string[] {
  const chordSet = new Set<string>();

  for (const line of parsedLines) {
    for (const segment of line) {
      if (segment.chord) {
        const transposed = transposeChord(segment.chord, transposeSteps);
        chordSet.add(transposed);
      }
    }
  }

  return Array.from(chordSet).sort((a, b) => {
    const order = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
                   'Do', 'Do#', 'Re', 'Re#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'La', 'La#', 'Si'];
    const ia = order.indexOf(a);
    const ib = order.indexOf(b);
    if (ia !== -1 && ib !== -1) return ia - ib;
    return a.localeCompare(b);
  });
}
