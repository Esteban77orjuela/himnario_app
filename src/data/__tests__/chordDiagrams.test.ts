import { getChordDiagram, chordDiagrams } from '../chordDiagrams';

describe('getChordDiagram', () => {
  it('returns exact match for C major', () => {
    const result = getChordDiagram('C');
    expect(result).toBeDefined();
    expect(result!.pianoNotes).toEqual([0, 4, 7]);
    expect(result!.frets).toBeDefined();
  });

  it('returns exact match for Am', () => {
    const result = getChordDiagram('Am');
    expect(result).toBeDefined();
    expect(result!.pianoNotes).toEqual([9, 0, 4]);
    expect(result!.frets).toBeDefined();
  });

  it('returns auto-generated piano notes for G7 with guitar diagram', () => {
    const result = getChordDiagram('G7');
    expect(result).toBeDefined();
    expect(result!.pianoNotes).toEqual([7, 11, 2, 5]);
    expect(result!.frets).toBeDefined();
  });

  it('returns Dm7 with guitar diagram', () => {
    const result = getChordDiagram('Dm7');
    expect(result).toBeDefined();
    expect(result!.pianoNotes).toEqual([2, 5, 9, 0]);
    expect(result!.frets).toBeDefined();
  });

  it('returns piano-only for sus4 chords', () => {
    const result = getChordDiagram('Gsus4');
    expect(result).toBeDefined();
    expect(result!.pianoNotes).toEqual([7, 0, 2]);
    expect(result!.frets).toBeUndefined();
  });

  it('returns piano-only for aug chords', () => {
    const result = getChordDiagram('Caug');
    expect(result).toBeDefined();
    expect(result!.pianoNotes).toEqual([0, 4, 8]);
    expect(result!.frets).toBeUndefined();
  });

  it('returns null for invalid chord name', () => {
    const result = getChordDiagram('Xyz');
    expect(result).toBeNull();
  });

  it('handles flat roots like Bb', () => {
    const result = getChordDiagram('Bb');
    expect(result).toBeDefined();
    expect(result!.pianoNotes).toEqual([10, 2, 5]);
    expect(result!.frets).toBeDefined();
  });

  it('handles sharp roots like F#m7 (piano only)', () => {
    const result = getChordDiagram('F#m7');
    expect(result).toBeDefined();
    expect(result!.pianoNotes).toEqual([6, 9, 1, 4]);
    expect(result!.frets).toBeUndefined();
  });

  it('handles dim7 chords', () => {
    const result = getChordDiagram('Cdim7');
    expect(result).toBeDefined();
    expect(result!.pianoNotes).toEqual([0, 3, 6, 9]);
  });

  it('handles m7b5 chords', () => {
    const result = getChordDiagram('Bm7b5');
    expect(result).toBeDefined();
    expect(result!.pianoNotes).toEqual([11, 2, 5, 9]);
  });
});

describe('chordDiagrams dictionary', () => {
  it('contains all natural major chords', () => {
    const majors = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    for (const m of majors) {
      expect(chordDiagrams[m]).toBeDefined();
      expect(chordDiagrams[m].frets).toBeDefined();
    }
  });

  it('contains all natural minor chords', () => {
    const minors = ['Cm', 'Dm', 'Em', 'Fm', 'Gm', 'Am', 'Bm'];
    for (const m of minors) {
      expect(chordDiagrams[m]).toBeDefined();
      expect(chordDiagrams[m].frets).toBeDefined();
    }
  });

  it('contains G7, C7, D7, A7, E7, B7, F7', () => {
    const sevenths = ['G7', 'C7', 'D7', 'A7', 'E7', 'B7', 'F7'];
    for (const s of sevenths) {
      expect(chordDiagrams[s]).toBeDefined();
      expect(chordDiagrams[s].frets).toBeDefined();
    }
  });
});
