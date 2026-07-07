const fs = require('fs');
const https = require('https');

function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve({ url, status: res.statusCode });
    }).on('error', () => resolve({ url, status: 500 }));
  });
}

async function main() {
  const files = [
    'app/storefront/page.tsx',
    'scripts/seed-real-groceries.ts'
  ];

  const urls = new Set();
  
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const matches = content.match(/https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9-]+[^"'\s]*/g);
    if (matches) {
      matches.forEach(m => urls.add(m));
    }
  }

  console.log(`Found ${urls.size} distinct URLs. Checking...`);
  const broken = [];
  
  const urlArray = Array.from(urls);
  for (let i = 0; i < urlArray.length; i++) {
    const url = urlArray[i];
    const result = await checkUrl(url);
    if (result.status === 404) {
      console.log(`❌ 404: ${url}`);
      broken.push(url);
    } else if (result.status === 200) {
      // console.log(`✅ 200: ${url}`);
    } else {
      console.log(`⚠️ ${result.status}: ${url}`);
    }
  }
  
  console.log(`\nFound ${broken.length} broken URLs.`);
}

main().catch(console.error);
