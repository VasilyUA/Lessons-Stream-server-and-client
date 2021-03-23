const fs = require('fs');

module.exports = (directory) => fs.readdirSync(directory);
