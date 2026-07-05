const https = require('https');
const fs = require('fs');
const path = require('path');

const download = (url, dest) => new Promise((resolve, reject) => {
  https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36' } }, res => {
    if ([301, 302].includes(res.statusCode)) return download(res.headers.location, dest).then(resolve).catch(reject);
    if (res.statusCode !== 200) return reject(new Error('Status ' + res.statusCode));
    const file = fs.createWriteStream(dest);
    res.pipe(file);
    file.on('finish', () => resolve(dest));
  }).on('error', reject);
});

async function run() {
  try { await download('https://upload.wikimedia.org/wikipedia/commons/7/76/K%26N%27s_logo_%282024%29.png', path.join('public/brands', 'kns.png')); console.log('kns ok'); } catch(e) { console.error('kns', e.message); }
  try { await download('https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Nestle_logo.svg/512px-Nestle_logo.svg.png', path.join('public/brands', 'nestle.png')); console.log('nestle ok'); } catch(e) { console.error('nestle', e.message); }
  try { await download('https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Dawn_Foods_logo_2016.svg/500px-Dawn_Foods_logo_2016.svg.png', path.join('public/brands', 'dawn.png')); console.log('dawn ok'); } catch(e) { console.error('dawn', e.message); }
  try { await download('https://upload.wikimedia.org/wikipedia/en/thumb/8/87/National_Foods_logo.png/250px-National_Foods_logo.png', path.join('public/brands', 'national.png')); console.log('national ok'); } catch(e) { console.error('national', e.message); }
}
run();
