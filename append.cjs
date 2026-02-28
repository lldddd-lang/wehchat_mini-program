const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const styleMatch = html.match(/<style>\s*\.dev-btn[\s\S]*?<\/style>/);
if (styleMatch) {
    fs.appendFileSync('src/styles/index.css', '\n/* Dev Panel Styles */\n' + styleMatch[0].replace(/<\/?style>/g, ''));
    html = html.replace(styleMatch[0], '');
}

const scriptMatch = html.match(/<script>\s*function toggleDevPanel[\s\S]*?<\/script>/);
if (scriptMatch) {
    fs.appendFileSync('src/app/main.js', '\n/* Dev Panel Functions */\nwindow.toggleDevPanel = toggleDevPanel;\nwindow.setDraws = setDraws;\nwindow.devShowPrize = devShowPrize;\nwindow.devResetCheckin = devResetCheckin;\nwindow.devResetAll = devResetAll;\n' + scriptMatch[0].replace(/<\/?script>/g, ''));
    html = html.replace(scriptMatch[0], '');
}

fs.writeFileSync('index.html', html);
