import * as cheerio from 'cheerio';
import { readFileSync, writeFileSync } from 'fs';

const html = readFileSync('./renuevame.html', 'utf8');
const $ = cheerio.load(html);

const preHtml = $('pre').html();

if (!preHtml) {
  console.log("No se encontró <pre>");
  process.exit(1);
}

const lines = preHtml.split('\n');
let result = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  if (line.includes('<b>')) {
    let plainText = '';
    let chords = []; 
    
    let inTag = false;
    let currentTag = '';
    let currentChord = '';
    let inChord = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      
      if (char === '<') {
        inTag = true;
        currentTag = '';
        continue;
      }
      
      if (char === '>') {
        inTag = false;
        if (currentTag === 'b') {
          inChord = true;
          currentChord = '';
        } else if (currentTag === '/b') {
          inChord = false;
          chords.push({ index: plainText.length, chord: currentChord });
        }
        continue;
      }
      
      if (inTag) {
        currentTag += char;
      } else {
        if (inChord) {
          currentChord += char;
        } else {
          plainText += char;
        }
      }
    }
    
    let nextLine = (i + 1 < lines.length && !lines[i + 1].includes('<b>')) ? lines[i + 1] : "";
    nextLine = nextLine.replace(/<[^>]*>/g, '');
    
    if (nextLine.trim() !== "") {
      let mergedLine = nextLine;
      const maxChordIdx = chords.length > 0 ? chords[chords.length - 1].index : 0;
      if (mergedLine.length < maxChordIdx) {
        mergedLine = mergedLine.padEnd(maxChordIdx, ' ');
      }
      
      for (let k = chords.length - 1; k >= 0; k--) {
        const { chord, index } = chords[k];
        mergedLine = mergedLine.slice(0, index) + `[${chord}]` + mergedLine.slice(index);
      }
      result.push(mergedLine);
      i++; 
    } else {
      let mergedLine = "";
      let lastIdx = 0;
      for (const { chord, index } of chords) {
        mergedLine += " ".repeat(Math.max(0, index - lastIdx)) + `[${chord}]`;
        lastIdx = index; 
      }
      result.push(mergedLine);
    }
    
  } else {
    result.push(line.replace(/<[^>]*>/g, ''));
  }
}

writeFileSync('./renuevame_parsed.txt', result.join('\n'));
console.log("Completado. Revisa renuevame_parsed.txt");
