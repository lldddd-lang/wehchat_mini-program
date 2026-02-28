const fs = require('fs');
const path = require('path');

const sourceFile = path.resolve('../hongbao-claim.html');
const destHtml = path.resolve('./index.html');
const destCss = path.resolve('./src/styles/index.css');
const destJs = path.resolve('./src/app/main.js');

let htmlContent = fs.readFileSync(sourceFile, 'utf-8');

// Extract CSS
const styleRegex = /<style>([\s\S]*?)<\/style>/i;
const styleMatch = htmlContent.match(styleRegex);
if (styleMatch) {
    fs.writeFileSync(destCss, styleMatch[1].trim());
    htmlContent = htmlContent.replace(styleRegex, '<link rel="stylesheet" href="/src/styles/index.css">');
    console.log('Extracted CSS');
}

// Extract JS
const scriptRegex = /<script>([\s\S]*?)<\/script>/i;
const scriptMatch = htmlContent.match(scriptRegex);
if (scriptMatch) {
    fs.writeFileSync(destJs, scriptMatch[1].trim());
    htmlContent = htmlContent.replace(scriptRegex, '<script type="module" src="/src/app/main.js"></script>');
    console.log('Extracted JS');
}

// Write the cleaned HTML
fs.writeFileSync(destHtml, htmlContent);
console.log('Cleaned HTML written');
