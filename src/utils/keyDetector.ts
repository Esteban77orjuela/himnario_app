const CHORD_REGEX = /\[([A-G][#b]?(?:m|maj|dim|aug|sus[24]|add\d+)?(?:\/[A-G][#b]?)?)\]/g;
const PLAIN_CHORD_RE = /\b([A-G][#b]?(?:m|maj|dim|aug|sus[24]|add\d+)?)\b/g;
const ROOT_REGEX = /^[A-G][#b]?/;

export function detectKey(lyrics: string): string {
  const chords: string[] = [];

  // Buscar acordes en formato [C]
  let match: RegExpExecArray | null;
  while ((match = CHORD_REGEX.exec(lyrics)) !== null) {
    chords.push(match[1]);
  }

  // También detectar acordes en texto plano (formato LaCuerda sin convertir)
  if (chords.length === 0) {
    const lines = lyrics.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || /^(intro|coro|verso|puente|final):/i.test(trimmed)) continue;
      const tokens = trimmed.split(/\s+/);
      if (tokens.length >= 1 && tokens.length <= 10) {
        const allChords = tokens.every(t => /^[A-G][#b]?(?:m|maj|dim|aug|sus[24]|add\d+)?$/.test(t));
        if (allChords) {
          for (const t of tokens) {
            if (!chords.includes(t)) chords.push(t);
          }
        }
      }
    }
  }

  if (chords.length === 0) return 'C';

  const lastChord = chords[chords.length - 1];
  const isMinor = /^[A-G][#b]?m(?!aj)/.test(lastChord);
  const root = lastChord.match(ROOT_REGEX)?.[0] || 'C';

  if (isMinor) return `${root}m`;

  return root;
}
