const CHORD_REGEX = /^(?:[A-G]|Do|Re|Mi|Fa|Sol|La|Si)[b#]?(?:m|maj|dim|aug|sus|add|[0-9])*(?:\([^)]+\))?(?:\/(?:[A-G]|Do|Re|Mi|Fa|Sol|La|Si)[b#]?)?$/;

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
        if (currentText.length > 0) {
          segments.push({ text: currentText, chord: currentChord });
          currentText = '';
          currentChord = undefined;
        }

        let content = '';
        i++;
        while (i < line.length && line[i] !== ']') {
          content += line[i];
          i++;
        }

        if (CHORD_REGEX.test(content.trim())) {
          currentChord = content;
        } else {
          currentText += '[' + content + ']';
        }
      } else {
        currentText += char;

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

export function isChordLine(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return false;

  const words = trimmed.split(/[\s/|-]+/).filter(w => w.length > 0 && !w.includes('//'));
  if (words.length === 0) return false;

  let chordCount = 0;

  for (const w of words) {
    if (CHORD_REGEX.test(w)) chordCount++;
  }

  return chordCount / words.length >= 0.5;
}

// Convierte formato LaCuerda (acordes en línea superior) a formato nativo (acordes inline [C])
export function convertPlainTextToInline(lyrics: string): string {
  const lines = lyrics.split('\n');
  const result: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (isChordLine(line)) {
      const chords: {chord: string, index: number}[] = [];
      const regex = /([A-G][b#]?(?:m|maj|dim|aug|sus|add|[0-9])*(?:\([^)]+\))?(?:\/[A-G][b#]?)?)/g;
      let match;
      while ((match = regex.exec(line)) !== null) {
        chords.push({ chord: match[1], index: match.index });
      }
      
      const nextLine = (i + 1 < lines.length && !isChordLine(lines[i + 1])) ? lines[i + 1] : "";
      
      if (nextLine.trim() !== "") {
        let mergedLine = nextLine;
        const maxChordIdx = chords.length > 0 ? chords[chords.length - 1].index : 0;
        if (mergedLine.length < maxChordIdx) {
          mergedLine = mergedLine.padEnd(maxChordIdx, ' ');
        }
        
        for (let j = chords.length - 1; j >= 0; j--) {
          const { chord, index } = chords[j];
          mergedLine = mergedLine.slice(0, index) + `[${chord}]` + mergedLine.slice(index);
        }
        result.push(mergedLine);
        i++; // Skip next line since we merged it
      } else {
        let mergedLine = "";
        let lastIdx = 0;
        for (const { chord, index } of chords) {
          mergedLine += " ".repeat(Math.max(0, index - lastIdx)) + `[${chord}]`;
          lastIdx = index + chord.length;
        }
        result.push(mergedLine);
      }
    } else {
      result.push(line);
    }
  }
  return result.join('\n');
}
