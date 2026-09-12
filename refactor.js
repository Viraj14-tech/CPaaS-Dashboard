const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(dirPath);
  });
}

function refactorCallers() {
  const stores = ['campaignsStore', 'clientsStore', 'usersStore', 'wabaStore'];
  
  walk('./src', filePath => {
    if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) return;
    if (filePath.includes(path.join('src', 'lib', 'store'))) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    stores.forEach(store => {
      // Find patterns like campaignsStore.method(
      // We want to replace it with (await campaignsStore.method(
      // But only if not already awaited.
      
      const regex = new RegExp(`(?<!await\\s+)(${store}\\.[a-zA-Z0-9_]+\\()`, 'g');
      content = content.replace(regex, 'await $1');
    });

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  });
}

refactorCallers();
