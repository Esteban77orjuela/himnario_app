import * as cheerio from 'cheerio';
const html = `<pre>G&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;G9
&nbsp;&nbsp;Te ver&#233; llegar en una nube</pre>`;
const $ = cheerio.load(html);
const fromHtml = $('pre').html().replace(/<[^>]*>/g, '');
const fromText = $('pre').text();

console.log("From HTML length:", fromHtml.length);
console.log("From HTML text:", fromHtml);
console.log("From Text length:", fromText.length);
console.log("From Text text:", fromText);
