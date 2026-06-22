import { transposeChord, transposeLine } from '../chordTransposer';

describe('transposeChord', () => {
  it('transposes English notes up by 2 semitones', () => {
    expect(transposeChord('C', 2)).toBe('D');
    expect(transposeChord('G', 2)).toBe('A');
    expect(transposeChord('A', 2)).toBe('B');
  });

  it('transposes English notes down by 2 semitones', () => {
    expect(transposeChord('D', -2)).toBe('C');
    expect(transposeChord('A', -2)).toBe('G');
    expect(transposeChord('B', -2)).toBe('A');
  });

  it('transposes Spanish notes up by 2 semitones', () => {
    expect(transposeChord('Do', 2)).toBe('Re');
    expect(transposeChord('Sol', 2)).toBe('La');
    expect(transposeChord('La', 2)).toBe('Si');
  });

  it('transposes Spanish notes down by 2 semitones', () => {
    expect(transposeChord('Re', -2)).toBe('Do');
    expect(transposeChord('La', -2)).toBe('Sol');
    expect(transposeChord('Si', -2)).toBe('La');
  });

  it('handles sharps correctly', () => {
    expect(transposeChord('C#', 2)).toBe('D#');
    expect(transposeChord('F#', -1)).toBe('F');
    expect(transposeChord('G#', 1)).toBe('A');
  });

  it('wraps around the octave', () => {
    expect(transposeChord('B', 1)).toBe('C');
    expect(transposeChord('C', -1)).toBe('B');
    expect(transposeChord('Si', 1)).toBe('Do');
    expect(transposeChord('Do', -1)).toBe('Si');
  });

  it('preserves chord suffixes', () => {
    expect(transposeChord('Am', 2)).toBe('Bm');
    expect(transposeChord('G7', 2)).toBe('A7');
    expect(transposeChord('Cmaj7', 2)).toBe('Dmaj7');
    expect(transposeChord('Dsus4', 2)).toBe('Esus4');
  });

  it('converts flats to sharps and transposes', () => {
    expect(transposeChord('Bb', 2)).toBe('C');
    expect(transposeChord('Eb', 2)).toBe('F');
    expect(transposeChord('Db', 2)).toBe('D#');
  });

  it('returns unchanged for non-chord strings', () => {
    expect(transposeChord('Hello', 2)).toBe('Hello');
    expect(transposeChord('123', 2)).toBe('123');
    expect(transposeChord('', 2)).toBe('');
  });
});

describe('transposeLine', () => {
  it('transposes chords in brackets but leaves lyrics intact', () => {
    const result = transposeLine('[C] Mi vida entera [G] le alaba', 2);
    expect(result).toBe('[D] Mi vida entera [A] le alaba');
  });

  it('returns same line when steps is 0', () => {
    const line = '[C] Mi vida entera';
    expect(transposeLine(line, 0)).toBe(line);
  });

  it('transposes chord-only lines', () => {
    const result = transposeLine('C G Am F', 2);
    expect(result).toBe('D A Bm G');
  });

  it('handles mixed content with plain words', () => {
    const result = transposeLine('G D Em C', -2);
    expect(result).toBe('F C Dm A#');
  });
});
