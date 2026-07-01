function isChordLine(line) {
  const trimmed = line.trim();
  if (!trimmed) return false;
  const words = trimmed.split(/[\s/|-]+/).filter(w => w.length > 0 && !w.includes('//'));
  if (words.length === 0) return false;
  
  const chordRegex = /^[A-G][b#]?(?:m|maj|dim|aug|sus|add|[0-9])*(?:\([^)]+\))?(?:\/[A-G][b#]?)?$/;
  let chordCount = 0;
  for (const w of words) {
    if (chordRegex.test(w)) chordCount++;
  }
  return chordCount / words.length >= 0.5;
}

// Helper to snap an index to the start of the current word
function snapToWordStart(text, index) {
  if (index >= text.length) return text.length;
  // If we're already on a space, no need to snap
  if (text[index] === ' ') return index;
  // If we're on a non-space, go backwards until we hit a space or start of string
  let newIdx = index;
  while (newIdx > 0 && text[newIdx - 1] !== ' ') {
    newIdx--;
  }
  return newIdx;
}

function convertPlainTextToInline(lyrics) {
  const lines = lyrics.split('\n');
  const result = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (isChordLine(line)) {
      const chords = [];
      const regex = /([A-G][b#]?(?:m|maj|dim|aug|sus|add|[0-9])*(?:\([^)]+\))?(?:\/[A-G][b#]?)?)/g;
      let match;
      while ((match = regex.exec(line)) !== null) {
        chords.push({ chord: match[1], index: match.index });
      }
      
      const nextLine = (i + 1 < lines.length && !isChordLine(lines[i + 1])) ? lines[i + 1] : "";
      
      if (nextLine.trim() !== "") {
        let mergedLine = nextLine;
        // Extend line if needed
        const maxChordIdx = chords.length > 0 ? chords[chords.length - 1].index : 0;
        if (mergedLine.length < maxChordIdx) {
          mergedLine = mergedLine.padEnd(maxChordIdx, ' ');
        }
        
        // Track offset added by previous inserted chords so we can insert left-to-right or right-to-left
        // Right-to-left is easier to avoid index shifting.
        // We need to snap chords, but if multiple chords snap to the SAME word start, they need to be kept in order.
        
        // Snap all chord indices first based on the ORIGINAL mergedLine text.
        const snappedChords = chords.map(c => {
           return { chord: c.chord, index: snapToWordStart(mergedLine, c.index) };
        });
        
        // Group chords that snapped to the same index
        const groupedChords = {};
        for (const c of snappedChords) {
           if (!groupedChords[c.index]) groupedChords[c.index] = [];
           groupedChords[c.index].push(c.chord);
        }
        
        // Insert right-to-left based on grouped indices
        const indices = Object.keys(groupedChords).map(Number).sort((a,b) => b - a);
        for (const idx of indices) {
           const chordString = groupedChords[idx].map(c => `[${c}]`).join('');
           mergedLine = mergedLine.slice(0, idx) + chordString + mergedLine.slice(idx);
        }
        
        result.push(mergedLine);
        i++; 
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

const lyrics = `G                        G9
  Te veré llegar en una nube`;
console.log(convertPlainTextToInline(lyrics));
