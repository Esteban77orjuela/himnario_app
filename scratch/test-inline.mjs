import { readFileSync, writeFileSync } from 'fs';

function isChordLine(line) {
  const trimmed = line.trim();
  if (!trimmed) return false;

  const words = trimmed.split(/[\s/|-]+/).filter(w => w.length > 0 && !w.includes('//'));
  if (words.length === 0) return false;

  const chordRegex = /^[A-G][b#]?(?:m|maj|dim|aug|sus|add|[0-9])*(?:\/[A-G][b#]?)?$/;
  let chordCount = 0;

  for (const w of words) {
    if (chordRegex.test(w)) chordCount++;
  }

  return chordCount / words.length >= 0.5; // lowered threshold to 0.5 for cifraclub
}

function convertPlainTextToInline(lyrics) {
  const lines = lyrics.split('\n');
  const result = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (isChordLine(line)) {
      const chords = [];
      const regex = /([A-G][b#]?(?:m|maj|dim|aug|sus|add|[0-9])*(?:\/[A-G][b#]?)?)/g;
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

const txt = readFileSync('./renuevame_parsed.txt', 'utf8');
const inline = convertPlainTextToInline(txt);
writeFileSync('./renuevame_inline.txt', inline);
console.log('Done');
