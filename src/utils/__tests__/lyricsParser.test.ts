import { parseLyricsToWords, isChordLine, transposePlainText, convertPlainTextToInline } from '../lyricsParser';

describe('parseLyricsToWords', () => {
  it('parses simple lyrics without chords', () => {
    const result = parseLyricsToWords('Mi vida entera');
    expect(result[0]).toHaveLength(3);
    expect(result[0][0].text).toBe('Mi ');
    expect(result[0][1].text).toBe('vida ');
    expect(result[0][2].text).toBe('entera');
  });

  it('parses lyrics with inline chords', () => {
    const result = parseLyricsToWords('[C] Mi [G] vida');
    expect(result[0].length).toBeGreaterThanOrEqual(3);
    expect(result[0][0].chord).toBe('C');
    const chordSegments = result[0].filter(s => s.chord);
    expect(chordSegments).toHaveLength(2);
    expect(chordSegments[1].chord).toBe('G');
  });

  it('handles multiple lines', () => {
    const result = parseLyricsToWords('Linea uno\nLinea dos');
    expect(result).toHaveLength(2);
  });
});

describe('isChordLine', () => {
  it('detects a line of chords', () => {
    expect(isChordLine('C G Am F')).toBe(true);
    expect(isChordLine('G D Em C')).toBe(true);
  });

  it('rejects a line of lyrics', () => {
    expect(isChordLine('Mi vida entera le alaba')).toBe(false);
    expect(isChordLine('Alabad a Dios con alegria')).toBe(false);
  });

  it('returns false for empty lines', () => {
    expect(isChordLine('')).toBe(false);
    expect(isChordLine('   ')).toBe(false);
  });

  it('detects complex chords', () => {
    expect(isChordLine('Cmaj7 Gsus4 D#m Bb/F')).toBe(true);
  });
});

describe('transposePlainText', () => {
  it('transposes chord lines and leaves lyrics unchanged', () => {
    const input = 'C G\nMi vida entera';
    const result = transposePlainText(input, 2, true);
    expect(result).toBe('D A\nMi vida entera');
  });

  it('hides chord lines when showChords is false', () => {
    const input = 'C G\nMi vida entera';
    const result = transposePlainText(input, 0, false);
    expect(result).toBe('Mi vida entera');
  });

  it('returns same text when steps is 0 and chords visible', () => {
    const input = 'C G\nMi vida entera';
    expect(transposePlainText(input, 0, true)).toBe(input);
  });
});

describe('convertPlainTextToInline', () => {
  it('merges chord line with lyrics line', () => {
    const input = 'C        G\nMi vida entera';
    const result = convertPlainTextToInline(input);
    expect(result).toContain('[C]');
    expect(result).toContain('[G]');
  });

  it('handles lines with only chords and no following lyrics', () => {
    const result = convertPlainTextToInline('G D\n');
    expect(result).toContain('[G]');
  });
});
