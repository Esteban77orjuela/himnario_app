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
    const rootA = a.match(/^[A-G][#b]?|Do|Re|Mi|Fa|Sol|La|Si/)?.[0] || a;
    const rootB = b.match(/^[A-G][#b]?|Do|Re|Mi|Fa|Sol|La|Si/)?.[0] || b;
    const ia = order.indexOf(rootA);
    const ib = order.indexOf(rootB);
    if (ia !== -1 && ib !== -1) return ia - ib;
    return a.localeCompare(b);
  });
}
