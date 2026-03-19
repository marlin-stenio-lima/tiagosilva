const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let original = content;
        content = content.replace(/#d4af37/gi, '#3b82f6');
        content = content.replace(/#f3e5ab/gi, '#8b5cf6');
        content = content.replace(/212,\s*175,\s*55/g, '59, 130, 246');
        content = content.replace(/rgba\(212, 175, 55/g, 'rgba(59, 130, 246');
        content = content.replace(/rgba\(212,175,55/g, 'rgba(59,130,246');
        if (content !== original) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('Updated: ' + filePath);
        }
    } catch (e) {
        console.error("Error processing " + filePath, e);
    }
}

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.css') || fullPath.endsWith('.jsx')) {
            replaceInFile(fullPath);
        }
    }
}

const srcPath = path.join(__dirname, 'src');
console.log('Processing directory: ' + srcPath);
processDirectory(srcPath);
console.log('Replacement complete.');
