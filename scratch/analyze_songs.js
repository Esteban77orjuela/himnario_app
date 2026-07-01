// Script to analyze ALL songs and find problematic formats
const data = require('../NuevoHimnario/src/data/himnos.json');

let problemSongs = [];
let formatPatterns = {};

data.forEach((song, idx) => {
  if (!song.himno) return;
  
  const lines = song.himno.split('\n');
  let hasProblems = false;
  let issues = [];
  
  lines.forEach((line, lineIdx) => {
    // Check for <B> tags
    if (line.includes('<B>') || line.includes('</B>') || line.includes('<b>') || line.includes('</b>')) {
      hasProblems = true;
      issues.push(`Line ${lineIdx}: HTML <B> tags: ${line.substring(0, 80)}`);
      
      // Track patterns
      const pattern = line.replace(/[A-G][b#]?(?:m|maj|dim|aug|sus|add|[0-9])*/g, 'X').substring(0, 60);
      formatPatterns[pattern] = (formatPatterns[pattern] || 0) + 1;
    }
    
    // Check for other HTML tags
    if (/<[a-zA-Z][^>]*>/.test(line) && !line.includes('<B>') && !line.includes('</B>') && !line.includes('<b>') && !line.includes('</b>')) {
      hasProblems = true;
      issues.push(`Line ${lineIdx}: Other HTML: ${line.substring(0, 80)}`);
    }
    
    // Check for {chords} that have extra stuff
    if (/\{[^}]*</.test(line) || />[^{]*\}/.test(line)) {
      hasProblems = true;
      issues.push(`Line ${lineIdx}: Mixed braces/HTML: ${line.substring(0, 80)}`);
    }
  });
  
  if (hasProblems) {
    problemSongs.push({
      id: song.id,
      title: song.titulo,
      issues,
    });
  }
});

console.log(`\n=== ANALYSIS RESULTS ===`);
console.log(`Total songs: ${data.length}`);
console.log(`Songs with problems: ${problemSongs.length}`);
console.log(`\n=== FORMAT PATTERNS ===`);
Object.entries(formatPatterns)
  .sort((a, b) => b[1] - a[1])
  .forEach(([pattern, count]) => {
    console.log(`  [${count}x] ${pattern}`);
  });

console.log(`\n=== PROBLEM SONGS (first 10 details) ===`);
problemSongs.slice(0, 10).forEach(s => {
  console.log(`\n  Song #${s.id}: ${s.title}`);
  s.issues.slice(0, 5).forEach(i => console.log(`    ${i}`));
  if (s.issues.length > 5) console.log(`    ... and ${s.issues.length - 5} more issues`);
});

// Also check: songs where NO line matches brace pattern
let noChordsSongs = [];
data.forEach(song => {
  if (!song.himno) return;
  const lines = song.himno.split('\n');
  const hasBraces = lines.some(l => /^\s*\{[^}]+\}\s*$/.test(l));
  const hasBraceBTags = lines.some(l => /<[Bb]>\{[^}]+\}<\/[Bb]>/.test(l) || /<[Bb]>\s*\{[^}]+\}\s*<\/[Bb]>/.test(l));
  if (!hasBraces && !hasBraceBTags) {
    noChordsSongs.push({ id: song.id, title: song.titulo, sample: lines.slice(0, 4).join(' | ') });
  }
});

console.log(`\n=== SONGS WITH NO DETECTABLE CHORD LINES: ${noChordsSongs.length} ===`);
noChordsSongs.slice(0, 10).forEach(s => {
  console.log(`  #${s.id}: ${s.title} -> ${s.sample.substring(0, 100)}`);
});
