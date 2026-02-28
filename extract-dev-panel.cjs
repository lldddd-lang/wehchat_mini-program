const fs = require('fs');

const html = fs.readFileSync('/Users/saic/Desktop/归档 2_年夜_20260209_最新版本/hongbao-claim.html', 'utf8');

const devBtnCss = html.match(/\.dev-btn\s*\{[\s\S]*?\}\s*\.dev-btn-danger\s*\{[\s\S]*?\}\s*\.dev-chip\s*\{[\s\S]*?\}/);
if (devBtnCss) {
    fs.appendFileSync('./src/styles/index.css', '\n\n/* Dev Panel Styles */\n' + devBtnCss[0] + '\n');
    console.log('Appended Dev Panel CSS');
}

const jsMatch = html.match(/function\s+toggleDevPanel\(\)\s*\{[\s\S]*?function\s+devResetAll\(\)\s*\{[\s\S]*?\}/);
if (jsMatch) {
    const bindJs = `
// Dev Panel Functions
window.toggleDevPanel = toggleDevPanel;
window.setDraws = setDraws;
window.devShowPrize = devShowPrize;
window.devResetCheckin = devResetCheckin;
window.devResetAll = devResetAll;
`;
    fs.appendFileSync('./src/app/main.js', '\n\n' + bindJs + jsMatch[0] + '\n');
    console.log('Appended Dev Panel JS');
}
