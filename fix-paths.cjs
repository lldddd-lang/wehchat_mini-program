const fs = require('fs');
const path = require('path');

const files = [
    'index.html',
    'hongbao-invite.html',
    'hongbao-rain.html',
    'hongbao-result.html',
    'hongbao-rules.html',
    'pk-result.html',
    'scan-process-pk.html'
];

files.forEach(file => {
    const fullPath = path.join('/Users/saic/Desktop/吃回本-发布版/hongbao-refactored', file);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        content = content.replace(/(href|src)="\/(src\/|images\/)/g, '$1="./$2');
        fs.writeFileSync(fullPath, content);
        console.log('Fixed', file);
    }
});
