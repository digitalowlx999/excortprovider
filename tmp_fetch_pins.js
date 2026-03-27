import https from 'https';

const searchTerms = [
  'beautiful+women+portrait',
  'hot+female+model+instagram',
  'sexy+bikini+model',
  'beautiful+brunette+model',
  'blonde+beautiful+model',
  'fitness+women+model'
];

async function fetchPins(term) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'www.pinterest.com',
      path: `/search/pins/?q=${term}`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    };

    https.get(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        // Find URLs like https://i.pinimg.com/736x/...
        const regex = /https:\/\/i\.pinimg\.com\/736x\/[a-zA-Z0-9_\-]+\/[a-zA-Z0-9_\-]+\/[a-zA-Z0-9_\-]+\.jpg/g;
        // The actual structure is usually https://i.pinimg.com/736x/xx/xx/xx/xxxxxxxxxxxx.jpg
        const simpleRegex = /https:\/\/i\.pinimg\.com\/736x\/[a-f0-9\/]+\.jpg/g;
        
        let matches = data.match(simpleRegex) || [];
        resolve([...new Set(matches)]);
      });
    }).on('error', err => reject(err));
  });
}

async function main() {
  let allUrls = new Set();
  for (const term of searchTerms) {
    try {
      const urls = await fetchPins(term);
      urls.forEach(url => allUrls.add(url));
      console.log(`Found ${urls.length} urls for ${term}`);
    } catch (e) {
      console.error(e);
    }
  }
  
  const finalUrls = Array.from(allUrls);
  console.log(`\n\n=== TOTAL UNIQUE URLS: ${finalUrls.length} ===\n`);
  console.log(JSON.stringify(finalUrls.slice(0, 90), null, 2));
}

main();
