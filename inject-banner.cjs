const fs = require('fs');

// 1. Get Banner HTML & CSS
const indexHtml = fs.readFileSync('index.html', 'utf8');
const indexCss = fs.readFileSync('src/styles/index.css', 'utf8');

const bannerHtmlMatch = indexHtml.match(/<div class="banner-section">[\s\S]*?<\/div>\s*<!-- ===== 波浪分隔线 ===== -->\s*<div class="wave-divider">[\s\S]*?<\/div>/);
const bannerHtml = bannerHtmlMatch ? bannerHtmlMatch[0] : '';
const fixedBannerHtml = bannerHtml.replace(/<a href="javascript:void\(0\)" onclick="goBack\(\)" class="banner-close">×<\/a>/, '<a href="index.html" class="banner-close"><i class="fa-solid fa-arrow-left"></i></a>').replace(/<a href="javascript:void\(0\)" onclick="openRulesModal\(\)" class="banner-rules">规则<\/a>/, '');

const bannerCssMatch = indexCss.match(/\/\* Banner \*\/[\s\S]*?(?=\/\* 累计金额 \*\/)/);
const bannerCss = bannerCssMatch ? bannerCssMatch[0] : '';

// 2. Inject into pk-result.html
let pkHtml = fs.readFileSync('pk-result.html', 'utf8');
pkHtml = pkHtml.replace(/<!-- Header -->\s*<div class="header">[\s\S]*?<\/div>/, '<!-- Header -->\n        ' + fixedBannerHtml);
fs.writeFileSync('pk-result.html', pkHtml);

let pkCss = fs.readFileSync('src/styles/pk-result.css', 'utf8');
if (!pkCss.includes('.banner-section')) {
    pkCss += '\n\n' + bannerCss;
    fs.writeFileSync('src/styles/pk-result.css', pkCss);
}

// 3. Inject into scan-process-pk.html
let scanHtml = fs.readFileSync('scan-process-pk.html', 'utf8');
const flashBtnHtml = '<div class="flash-btn" id="flashBtn" onclick="toggleFlash()"><i class="fa-solid fa-bolt"></i></div>';
scanHtml = scanHtml.replace(/<!-- Header -->\s*<div class="header">[\s\S]*?<\/div>/, '<!-- Header -->\n        ' + fixedBannerHtml);
scanHtml = scanHtml.replace(/<div class="control-bar">/, '<div class="control-bar">\n            ' + flashBtnHtml);
fs.writeFileSync('scan-process-pk.html', scanHtml);

let scanCss = fs.readFileSync('src/styles/scan-process-pk.css', 'utf8');
if (!scanCss.includes('.banner-section')) {
    scanCss += '\n\n' + bannerCss;
    fs.writeFileSync('src/styles/scan-process-pk.css', scanCss);
}

console.log('Banner injected successfully.');
