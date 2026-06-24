import fs from 'fs';
const c = fs.readFileSync('src/data/christianSongs.ts', 'utf8');
const m = c.match(/title: "[^"]*Samuel[^"]*"/g);
if (m) console.log('FOUND:', m.join('\n'));
else console.log('No Samuel in titles - OK');
