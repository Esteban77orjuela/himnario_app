/**
 * Batch import — Scrapea canciones cristianas de LaCuerda y genera src/data/christianSongs.ts
 *
 * Uso: node scripts/batch-import.mjs
 *
 * Requiere Node 18+ (fetch nativo).
 * Agrega delays entre requests para evitar bloqueo.
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT = resolve(__dirname, '..', 'src', 'data', 'christianSongs.ts');

// ── Lista curada de artistas cristianos en LaCuerda ──
const ARTISTS = [
  'Abel Zavala', 'Alex Campos', 'Andrés Corson',
  'Barak', 'Bethel Music',
  'Chris Tomlin', 'Coalo Zamorano',
  'Danilo Montero', 'David Scarpeta',
  'Elevation Worship', 'En Espíritu y Verdad', 'Evan Craft',
  'Generación 12',
  'Hillsong', 'Hillsong United', 'Hillsong Worship',
  'Ingrid Rosario',
  'Jesús Adrián Romero', 'Juan Carlos Alvarado', 'Julissa',
  'Kike Pavón',
  'Lilly Goodman',
  'Majo y Dan', 'Marcela Gandara', 'Marco Barrientos', 'Marcos Witt',
  'Maverick City Music', 'Miel San Marcos',
  'Passion', 'Paul Wilbur',
  'Rojo',
  'Samuel Hernández', 'Sovereign Grace Music', 'Su Presencia',
  'Tercer Cielo',
];

function slugify(name) {
  return name
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quitar tildes
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}

function extractH1(html) {
  const m = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (!m) return '';
  return m[1].replace(/<[^>]+>/g, '').trim();
}

function extractTitleTag(html) {
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return m ? m[1].trim() : '';
}

function extractArtistAndTitle(html, url, knownArtist) {
  let title = 'Canción Importada';
  let artist = knownArtist || '';

  // <title> formato: "ALABA: Acordes y Letra para Guitarra, Piano y Ukulele (Evan Craft)"
  const titleTag = extractTitleTag(html);
  if (titleTag) {
    const parenM = titleTag.match(/\(([^)]+)\)/);
    if (parenM && !artist) artist = parenM[1].trim();
    const colonM = titleTag.match(/^([^:]+?):\s*Acordes/i);
    if (colonM) title = colonM[1].trim();
    else title = titleTag.split(' - ').map(s => s.trim()).filter(s => !/lacuerda/i.test(s))[0] || title;
  }

  // <h1> formato: "Alaba Evan Craft" (título + artista sin separador) o "TITULO, ARTISTA: Acordes"
  const h1 = extractH1(html);
  if (h1) {
    const cc = h1.match(/^(.+?),\s*(.+?):\s*Acordes/i);
    if (cc) {
      if (!artist) artist = cc[2].trim();
      title = cc[1].trim();
    } else {
      // Quitar el artista conocido del H1 para obtener el título
      // Usar comparación normalizada para manejar acentos (ej: "Hernandez" vs "Hernández")
      const norm = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (artist && norm(h1).includes(norm(artist))) {
        const escaped = artist.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        title = h1.replace(new RegExp(escaped, 'i'), '').trim();
      } else {
        title = h1;
      }
    }
  }

  if (!artist) {
    const um = url.match(/lacuerda\.net\/([^/]+)/i);
    if (um) artist = um[1].replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).trim();
  }

  title = title.charAt(0).toUpperCase() + title.slice(1);
  return { title, artist };
}

function convertToInline(rawLyrics) {
  // Convierte formato LaCuerda (acordes en líneas separadas) a inline [ACORDE]texto
  // Usa posición horizontal de cada acorde para alinearlo con la sílaba correcta
  const lines = rawLyrics.split('\n');
  const result = [];
  const chordTokenRe = /^[A-G][#b]?(?:maj|m|dim|aug|sus[24]|add\d+)?[0-9]*(?:\/[A-G][#b]?(?:maj|m|dim|aug|sus[24]|add\d+)?[0-9]*)?$/;
  const chordPosRe = /[A-G][#b]?(?:maj|m|dim|aug|sus[24]|add\d+)?[0-9]*(?:\/[A-G][#b]?(?:maj|m|dim|aug|sus[24]|add\d+)?[0-9]*)?/g;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) { result.push(''); continue; }
    
    // Detectar si esta línea es solo acordes (todos los tokens son acordes)
    const tokens = line.trim().split(/\s+/).filter(t => t.length > 0);
    const isChordLine = tokens.length >= 1 && tokens.length <= 12 &&
      tokens.every(t => chordTokenRe.test(t));
    
    if (isChordLine && i + 1 < lines.length) {
      const nextLine = lines[i + 1];
      if (nextLine.trim()) {
        // Encontrar acordes con su posición horizontal
        const chords = [];
        let m;
        while ((m = chordPosRe.exec(line)) !== null) {
          chords.push({ chord: m[0], pos: m.index });
        }
        
        // Para cada acorde, encontrar la palabra en la letra que contiene su posición
        const insertions = chords.map(c => {
          let target = c.pos;
          if (target >= nextLine.length) target = nextLine.length;
          else {
            // Si está en un espacio, avanzar al inicio de la siguiente palabra
            while (target < nextLine.length && nextLine[target] === ' ') {
              target++;
            }
          }
          // Buscar el inicio de la palabra que contiene esta posición
          let wordStart = target;
          if (wordStart > nextLine.length) wordStart = nextLine.length;
          else {
            while (wordStart > 0 && nextLine[wordStart - 1] !== ' ') {
              wordStart--;
            }
          }
          return { chord: c.chord, pos: wordStart };
        });
        
        // Construir salida insertando [Acorde] antes de cada palabra destino
        let output = '';
        let lastPos = 0;
        for (const ins of insertions) {
          if (ins.pos < lastPos) continue;
          output += nextLine.slice(lastPos, ins.pos);
          output += `[${ins.chord}]`;
          lastPos = ins.pos;
        }
        output += nextLine.slice(lastPos);
        
        result.push(output);
        i++;
        continue;
      }
    }
    // No es línea de acordes o no hay siguiente línea
    if (isChordLine) {
      const chords = [];
      let m;
      while ((m = chordPosRe.exec(line)) !== null) chords.push(m[0]);
      result.push(chords.map(c => `[${c}]`).join(' '));
    } else {
      result.push(line);
    }
  }
  return result.join('\n');
}

function isTABContent(text) {
  // Detect guitar TAB: lines starting with string name + fret dashes/numbers
  const lines = text.split('\n').filter(l => l.trim());
  const tabLines = lines.filter(l => /^[EADGBe]\s*[-0-9hpb/\\]+/.test(l.trim()));
  return tabLines.length >= 4;
}

function scorePreBlock(text) {
  const lines = text.split('\n').filter(l => l.trim());
  if (lines.length === 0) return -Infinity;
  const chordRe = /^[A-G][#b]?(?:maj|m|dim|aug|sus[24]|add\d+)?[0-9]*(?:\/[A-G][#b]?(?:maj|m|dim|aug|sus[24]|add\d+)?[0-9]*)?$/;
  let chordLines = 0, textLines = 0, tabLines = 0;
  for (const line of lines) {
    if (/^[EADGBe]\s*[-0-9hpb/\\]+/.test(line.trim())) {
      tabLines++;
    } else {
      const tokens = line.trim().split(/\s+/);
      chordLines += tokens.length >= 1 && tokens.length <= 12 && tokens.every(t => chordRe.test(t)) ? 1 : 0;
      textLines += chordLines; // will be overwritten if not chord
    }
  }
  textLines = lines.length - chordLines - tabLines;
  let score = chordLines + textLines + lines.length;
  if (tabLines >= 4) score -= 1000;
  if (chordLines >= 3 && textLines >= 3) score += 50; // alternating format
  return score;
}

function extractLyrics(html) {
  const preBlocks = html.match(/<pre[^>]*>([\s\S]*?)<\/pre>/gi);
  if (!preBlocks || preBlocks.length === 0) return '';
  let bestBlock = '', bestScore = -Infinity;
  for (const pre of preBlocks) {
    let block = pre.replace(/<\/?pre[^>]*>/gi, '');
    block = block.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '').trim();
    const score = scorePreBlock(block);
    if (score > bestScore) { bestScore = score; bestBlock = block; }
  }
  const markers = [/Este fichero es trabajo propio[\s\S]*/i, /Acordes utilizados:?[\s\S]*/i, /Acordes:[\s\S]*/i, /Saludos a [\s\S]*/i];
  for (const m of markers) bestBlock = bestBlock.replace(m, '');
  return bestBlock.trim();
}

function detectKey(lyrics) {
  // Detectar acordes en formato [C] y también texto plano (formato LaCuerda)
  const allChords = [];
  // Buscar acordes en corchetes
  const bracketRe = /\[([A-G][#b]?(?:m|maj|dim|aug|sus[24]|add\d+)?(?:\/[A-G][#b]?)?)\]/g;
  let m;
  while ((m = bracketRe.exec(lyrics)) !== null) allChords.push(m[1]);
  // Buscar acordes en texto plano (líneas que contienen solo acordes)
  const chordTokenRe = /\b([A-G][#b]?(?:m|maj|dim|aug|sus[24]|add\d+)?)\b/g;
  const lines = lyrics.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('Intro:') || trimmed.startsWith('Coro:') || trimmed.startsWith('Verso:') || trimmed.startsWith('Puente:')) continue;
    const tokens = trimmed.split(/\s+/);
    // Si la línea tiene solo 1-8 tokens y todos parecen acordes
    if (tokens.length >= 1 && tokens.length <= 8) {
      const allChordsLike = tokens.every(t => /^[A-G][#b]?(?:m|maj|dim|aug|sus[24]|add\d+)?$/.test(t));
      if (allChordsLike) {
        for (const t of tokens) {
          if (!allChords.includes(t)) allChords.push(t);
        }
      }
    }
  }
  if (allChords.length === 0) return 'C';
  const last = allChords[allChords.length - 1];
  const rootRe = /^[A-G][#b]?/;
  const root = last.match(rootRe)?.[0] || 'C';
  return /^[A-G][#b]?m(?!aj)/.test(last) ? root + 'm' : root;
}

function parseSongLinks(html, artistSlug) {
  const songMap = new Map();
  // Formato actual de LaCuerda: <li onclick='w.location="alaba"'><a href='alaba'>Alaba</a></li>
  const re = /onclick=["']w\.location\s*=\s*["']([^"']+)["']\s*["'][^>]*>\s*<a\s+href=["'][^"']*["'][^>]*>([^<]+)<\/a>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const href = m[1].trim();
    const name = m[2].trim();
    if (!songMap.has(name)) {
      songMap.set(name, `https://acordes.lacuerda.net/${artistSlug}/${href}`);
    }
  }
  // Fallback: links con .shtml
  if (songMap.size === 0) {
    const re2 = /<a\s+href=["']([^"']+\.shtml)["'][^>]*>([^<]+)\s*acordes?\s*<\/a>/gi;
    while ((m = re2.exec(html)) !== null) {
      const href = m[1].trim();
      const name = m[2].trim();
      if (!songMap.has(name)) {
        const slug = href.replace(/\.shtml$/, '');
        songMap.set(name, `https://acordes.lacuerda.net/${artistSlug}/${slug}`);
      }
    }
  }
  return Array.from(songMap.entries()).map(([title, url]) => ({ title, url }));
}

async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml',
          'Accept-Language': 'es-ES,es;q=0.9',
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.text();
    } catch (e) {
      if (i < retries - 1) await new Promise(r => setTimeout(r, 1000 * (i + 1)));
      else throw e;
    }
  }
}

async function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ── MAIN ──
async function main() {
  console.log('🎵 Batch import — Canciones Cristianas de LaCuerda\n');
  const allSongs = [];

  for (let i = 0; i < ARTISTS.length; i++) {
    const artistName = ARTISTS[i];
    const slug = slugify(artistName);
    const artistUrl = `https://acordes.lacuerda.net/${slug}/`;
    
    console.log(`[${i + 1}/${ARTISTS.length}] ${artistName} (${slug})`);

    try {
      const html = await fetchWithRetry(artistUrl);
      const songs = parseSongLinks(html, slug);

      if (songs.length === 0) {
        console.log(`  → Sin canciones encontradas`);
        await delay(1500);
        continue;
      }

      console.log(`  → ${songs.length} canciones encontradas`);

      // Limitar a 20 canciones por artista para no saturar
      const batch = songs.slice(0, 20);

      for (let j = 0; j < batch.length; j++) {
        const song = batch[j];
        const fullUrl = song.url;
        
        try {
          const songHtml = await fetchWithRetry(fullUrl);
          const { title, artist } = extractArtistAndTitle(songHtml, fullUrl, artistName);
          const lyrics = extractLyrics(songHtml);

          if (lyrics) {
            const inlineLyrics = convertToInline(lyrics);
            const key = detectKey(inlineLyrics);
            allSongs.push({
              id: `${slug}-${slugify(song.title)}`,
              number: allSongs.length + 1,
              title,
              artist,
              category: 'Alabanza',
              lyrics: inlineLyrics,
              musicalKey: key,
            });
            console.log(`    ✓ ${title} [${key}]`);
          } else {
            console.log(`    ✗ ${song.title} (sin letra)`);
          }
        } catch (e) {
          console.log(`    ✗ ${song.title} (error: ${e.message})`);
        }

        await delay(150 + Math.random() * 100);
      }
    } catch (e) {
      console.log(`  → Error: ${e.message}`);
    }

    await delay(200 + Math.random() * 300);
  }

  // ── Generar archivo ──
  let output = `// Generado por scripts/batch-import.mjs\n`;
  output += `// Total: ${allSongs.length} canciones\n\n`;
  output += `export interface ChristianSong {\n`;
  output += `  id: string;\n`;
  output += `  number: number;\n`;
  output += `  title: string;\n`;
  output += `  artist: string;\n`;
  output += `  category: string;\n`;
  output += `  lyrics: string;\n`;
  output += `  musicalKey: string;\n`;
  output += `}\n\n`;
  output += `export const christianSongs: ChristianSong[] = [\n`;

  for (const s of allSongs) {
    const escLyrics = s.lyrics
      .replace(/\\/g, '\\\\')
      .replace(/`/g, '\\`')
      .replace(/\${/g, '\\${');
    output += `  {\n`;
    output += `    id: ${JSON.stringify(s.id)},\n`;
    output += `    number: ${s.number},\n`;
    output += `    title: ${JSON.stringify(s.title)},\n`;
    output += `    artist: ${JSON.stringify(s.artist)},\n`;
    output += `    category: ${JSON.stringify(s.category)},\n`;
    output += `    lyrics: \`${escLyrics}\`,\n`;
    output += `    musicalKey: ${JSON.stringify(s.musicalKey)},\n`;
    output += `  },\n`;
  }

  output += `];\n`;

  writeFileSync(OUTPUT, output, 'utf-8');
  console.log(`\n✅ Archivo generado: ${OUTPUT}`);
  console.log(`📊 Total: ${allSongs.length} canciones de ${ARTISTS.length} artistas`);
}

main().catch(console.error);
