const fs = require('fs');
const path = require('path');

function replaceInDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      replaceInDirectory(filePath);
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      let content = fs.readFileSync(filePath, 'utf-8');
      
      let updated = content
        .replace(/Sawt Al-Hind News/g, 'Sauthalhind')
        .replace(/Sawt Al-Hind/g, 'Sauthalhind');
        
      if (content !== updated) {
        fs.writeFileSync(filePath, updated, 'utf-8');
        console.log('Updated', filePath);
      }
    }
  }
}

replaceInDirectory(path.join(__dirname, 'src'));
console.log('Done');
