const fs = require('fs');
const himnosData = require('../NuevoHimnario/src/data/himnos.json');

/**
 * Cleans ALL HTML tags and converts brace-format chords to bracket-format.
 * Handles ALL detected patterns including inline braces within text lines.
 */
function cleanAndConvertLyrics(rawLyrics) {
  if (!rawLyrics) return '';
  
  let lines = rawLyrics.split('\n');
  
  return lines.map(line => {
    // Step 1: Remove ALL HTML tags
    let cleaned = line.replace(/<\/?[a-zA-Z][^>]*>/g, '');
    
    // Step 2: Convert ALL {chord content} occurrences anywhere in the line
    // This handles both full chord lines and inline like "Intro: {Am F C G}"
    cleaned = cleaned.replace(/\{([^}]*)\}/g, (_match, content) => {
      // Replace each non-space token with [token]
      // But skip tokens that are clearly not chords (like pipes, dashes alone, parens, x2, etc.)
      return content.replace(/(\S+)/g, (token) => {
        // Skip pure punctuation/notation: |, -, //, (2x), etc.
        if (/^[|\-/()\d]+x?\)?$/.test(token)) return token;
        if (token === '//' || token === '|') return token;
        return `[${token}]`;
      });
    });
    
    return cleaned;
  }).join('\n');
}

/**
 * Normalize category name
 */
function normalizeCategory(cat) {
  if (!cat) return 'General';
  const c = cat.trim().toLowerCase();
  if (c.includes('adoracion') || c.includes('adoración')) return 'Adoración';
  if (c.includes('alabanza')) return 'Alabanza';
  if (c.includes('himno')) return 'Himnos';
  return cat.trim();
}

const christianSongs = himnosData.map(song => ({
  id: song.id.toString(),
  number: song.id,
  title: (song.titulo || '').trim(),
  artist: (song.autor || 'Desconocido').trim(),
  category: normalizeCategory(song.categoria || song.tipo),
  lyrics: cleanAndConvertLyrics(song.himno || ''),
  musicalKey: (song.nota || '').trim(),
}));

// VERIFICATION: Check every single song for leftover problems
let htmlProblems = 0;
let braceProblems = 0;
christianSongs.forEach(song => {
  const lines = song.lyrics.split('\n');
  lines.forEach((line, i) => {
    if (/<[a-zA-Z]/.test(line)) {
      htmlProblems++;
      console.log(`  HTML in #${song.id} "${song.title}" line ${i}: ${line.substring(0, 80)}`);
    }
    if (/\{[^}]+\}/.test(line)) {
      braceProblems++;
      console.log(`  BRACE in #${song.id} "${song.title}" line ${i}: ${line.substring(0, 80)}`);
    }
  });
});

console.log(`\nVerification: ${htmlProblems} HTML issues, ${braceProblems} brace issues`);

if (htmlProblems === 0 && braceProblems === 0) {
  console.log(`✅ ALL 638 songs are perfectly clean!`);
}

// Write the file
const fileContent = `// Importado automáticamente desde NuevoHimnario/src/data/himnos.json
export interface ChristianSong {
  id: string;
  number: number;
  title: string;
  artist: string;
  category: string;
  lyrics: string;
  musicalKey: string;
}

export const christianSongs: ChristianSong[] = ${JSON.stringify(christianSongs, null, 2)};
`;

fs.writeFileSync('./src/data/christianSongs.ts', fileContent, 'utf-8');

const cats = {};
christianSongs.forEach(s => { cats[s.category] = (cats[s.category] || 0) + 1; });
console.log(`Migrated ${christianSongs.length} songs`);
console.log('Categories:', cats);
