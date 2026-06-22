import { extractUniqueChords } from '../extractChords';
import { parseLyricsToWords } from '../lyricsParser';

describe('extractUniqueChords', () => {
  it('extracts unique chords from parsed lines', () => {
    const parsed = parseLyricsToWords('[G]Señor [C]mio [D]Dios\n[Am]Gloria [Em]a ti');
    const chords = extractUniqueChords(parsed, 0);
    expect(chords).toEqual(['C', 'D', 'Em', 'G', 'Am']);
  });

  it('returns chords in musical order', () => {
    const parsed = parseLyricsToWords('[D]test [A]test [C]test [G]test');
    const chords = extractUniqueChords(parsed, 0);
    expect(chords).toEqual(['C', 'D', 'G', 'A']);
  });

  it('applies transposition', () => {
    const parsed = parseLyricsToWords('[C]test [G]test');
    const chords = extractUniqueChords(parsed, 2);
    expect(chords).toEqual(['D', 'A']);
  });

  it('returns empty array for no chords', () => {
    const parsed = parseLyricsToWords('Letra sin acordes');
    const chords = extractUniqueChords(parsed, 0);
    expect(chords).toEqual([]);
  });

  it('handles Spanish note names', () => {
    const parsed = parseLyricsToWords('[Do]test [Sol]test');
    const chords = extractUniqueChords(parsed, 0);
    expect(chords).toEqual(['Do', 'Sol']);
  });

  it('wraps around octave on transpose', () => {
    const parsed = parseLyricsToWords('[B]test');
    const chords = extractUniqueChords(parsed, 1);
    expect(chords).toEqual(['C']);
  });
});
