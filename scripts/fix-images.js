const fs = require('fs');

const replacements = {
  // snacks-confectionery -> bakery
  '1582223945937-230303ba6512': '1509440159596-0249088772ff',
  // health-pharmacy -> personal-care
  '1584308666744-24d5e4a0d9b4': '1556228578-0d85b1a4d571',
  // household-essentials -> home-kitchen
  '1584824486509-112e4181f1ce': '1556910103-1c02745aae4d',
  // flowers-gifts -> fresh-produce
  '1563241598-a28f89e414c1': '1610832958506-aa56368176cf',
  // tobacco -> grocery
  '1533604100062-3bf9798544bb': '1542838132-92c53300491e',
  
  // Dawn Milky Bread -> bakery
  '1528750711917-767eb215e982': '1509440159596-0249088772ff',
  // National Tomato Ketchup -> grocery
  '1599599427303-34e2f6fa72d1': '1542838132-92c53300491e',
  // Nestle Fruita Vitals -> beverages
  '1622597467836-f3824f11400e': '1622483767028-3f66f32aef97',
  // Apples (Fuji) -> fresh-produce
  '1560806887-1e4cd0b6fd6c': '1610832958506-aa56368176cf'
};

const files = [
  'app/storefront/page.tsx',
  'scripts/seed-real-groceries.ts'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  for (const [bad, good] of Object.entries(replacements)) {
    if (content.includes(bad)) {
      content = content.replaceAll(bad, good);
      changed = true;
    }
  }
  
  if (changed) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
}
