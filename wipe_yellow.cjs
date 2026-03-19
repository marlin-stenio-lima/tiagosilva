const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

function findAndReplace(dir) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findAndReplace(filePath);
    } else if (filePath.endsWith('.css') || filePath.endsWith('.jsx')) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      const originalContent = content;
      content = content.replace(/#d4af37/gi, '#3b82f6');
      content = content.replace(/rgba\(212,\s*175,\s*55/gi, 'rgba(59, 130, 246');
      content = content.replace(/#f3e5ab/gi, '#8b5cf6');
      content = content.replace(/#fbbf24/gi, '#8b5cf6');
      content = content.replace(/#b8860b/gi, '#6d28d9');
      content = content.replace(/PREMIUM MEMBER/g, 'PRO EDITION');
      
      if (originalContent !== content) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Cleansed: ${filePath}`);
      }
    }
  });
}

findAndReplace(directoryPath);
console.log('Script concluded.');
