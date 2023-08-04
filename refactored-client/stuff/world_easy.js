const fs = require('fs');

const regexPattern = /(?:^|\s)this\.([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*function/g;

const sourceCode = fs.readFileSync('../src/graphics/draw.js', 'utf8');

const matches = [...sourceCode.matchAll(regexPattern)];

const functionNamesSet = new Set();
matches.forEach(match => functionNamesSet.add(match[1]));

const uniqueFunctionNames = Array.from(functionNamesSet);

const importStatement = uniqueFunctionNames.length > 0
  ? `import { ${uniqueFunctionNames.join(', ')} } from './flat';`
  : '';

fs.writeFileSync('world_imports.js', importStatement, 'utf8');

console.log('Import statements generated');
