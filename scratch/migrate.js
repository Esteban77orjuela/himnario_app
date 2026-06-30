const fs = require('fs');

const himnosData = require('../NuevoHimnario/src/data/himnos.json');

/**
 * Converts the brace format {G   C   D} to bracket format [G]   [C]   [D]
 * preserving spaces between chords for alignment.
 */
function convertBraceLinesToBrackets(rawLyrics) {
  if (!rawLyrics) return '';
  const lines = rawLyrics.split('\n');
  return lines.map(line => {
    // Match a line that is wrapped in braces (possibly with leading spaces): {  G   C   }
    const match = line.match(/^(\s*)\{([^}]*)\}(\s*)$/);
    if (match) {
      const leading = match[1];
      const content = match[2];
      const trailing = match[3];
      // Replace each non-space token (chord) with [chord]
      const converted = content.replace(/(\S+)/g, '[$1]');
      return leading + converted + trailing;
    }
    return line;
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
  lyrics: convertBraceLinesToBrackets(song.himno || ''),
  musicalKey: (song.nota || '').trim(),
}));

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

// Print some stats
const cats = {};
christianSongs.forEach(s => { cats[s.category] = (cats[s.category] || 0) + 1; });
console.log(`✅ Migrated ${christianSongs.length} songs`);
console.log('Categories:', cats);
