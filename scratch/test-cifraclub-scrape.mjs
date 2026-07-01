const fs = require('fs');

async function testScrape() {
  const url = 'https://www.cifraclub.com/marcos-witt/renuevame/';
  const isCifraClub = true;
  
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    }
  });
  
  const html = await response.text();
  
  let rawHtmlBlock = '';
  const preBlocks = html.match(/<pre[^>]*>([\s\S]*?)<\/pre>/gi);
  if (preBlocks && preBlocks.length > 0) {
    const longestPre = preBlocks.reduce((a, b) => a.length > b.length ? a : b, '');
    rawHtmlBlock = longestPre.replace(/<\/?pre[^>]*>/gi, '');
  }
  
  let title = 'Canción Importada';
  let artist = '';
  
  const titleTag = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleTag) {
    const raw = titleTag[1].trim();
    const parts = raw.split(' - ');
    if (parts.length >= 2) {
      title = parts[0].trim();
      artist = parts[1].trim();
    }
  }
  
  if (isCifraClub) {
    rawHtmlBlock = rawHtmlBlock.replace(/&nbsp;/g, ' ');
  }
  
  let rawLyrics = rawHtmlBlock
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&#\d+;/g, match => String.fromCharCode(match.slice(2, -1)))
    .replace(/&[a-z]+;/gi, ' ')
    .trim();
    
  console.log("TITLE:", title);
  console.log("ARTIST:", artist);
  console.log("LYRICS PREVIEW:", rawLyrics.substring(0, 150));
}

testScrape().catch(console.error);
