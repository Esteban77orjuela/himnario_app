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
