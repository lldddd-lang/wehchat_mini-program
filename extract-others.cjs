const fs = require('fs');
const path = require('path');

const files = [
    'pk-result.html',
    'scan-process-pk.html'
];

for (const file of files) {
    const sourcePath = path.resolve('../', file);
    if (!fs.existsSync(sourcePath)) {
        console.log("Not found:", sourcePath);
        continue;
    }

    let htmlContent = fs.readFileSync(sourcePath, 'utf-8');
    const baseName = path.parse(file).name;
    const destHtml = path.resolve('./', file);
    const destCss = path.resolve('./src/styles/', `${baseName}.css`);
    const destJs = path.resolve('./src/app/', `${baseName}.js`);

    // Extract CSS
    const styleRegex = /<style>([\s\S]*?)<\/style>/ig;
    let cssMatch;
    let cssContent = '';
    let linkAdded = false;

    while ((cssMatch = styleRegex.exec(htmlContent)) !== null) {
        cssContent += '\n' + cssMatch[1].trim();
    }
    if (cssContent) {
        fs.writeFileSync(destCss, cssContent);
        htmlContent = htmlContent.replace(/<style>[\s\S]*?<\/style>/ig, function (match, offset, string) {
            if (!linkAdded) {
                linkAdded = true;
                return `<link rel="stylesheet" href="/src/styles/${baseName}.css">`;
            }
            return '';
        });
        console.log(`Extracted CSS for ${file}`);
    }

    // Extract JS
    const scriptRegex = /<script>([\s\S]*?)<\/script>/ig;
    let jsMatch;
    let jsContent = '';
    let scriptAdded = false;

    while ((jsMatch = scriptRegex.exec(htmlContent)) !== null) {
        jsContent += '\n' + jsMatch[1].trim();
    }
    if (jsContent) {
        fs.writeFileSync(destJs, jsContent);
        htmlContent = htmlContent.replace(/<script>[\s\S]*?<\/script>/ig, function (match) {
            if (!scriptAdded) {
                scriptAdded = true;
                return `<script type="module" src="/src/app/${baseName}.js"></script>`;
            }
            return '';
        });
        console.log(`Extracted JS for ${file}`);
    }

    // Write the cleaned HTML
    fs.writeFileSync(destHtml, htmlContent);
    console.log(`Cleaned HTML written for ${file}`);
}
