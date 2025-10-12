const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const file = path.resolve(__dirname, '..', 'public', 'favicon.ico');
if (!fs.existsSync(file)) {
  console.error('favicon.ico not found');
  process.exit(1);
}

const buf = fs.readFileSync(file);
const hash = crypto.createHash('md5').update(buf).digest('hex').slice(0, 8);
console.log(hash);
