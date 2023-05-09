const { createReadStream } = require('fs');
const { stdout } = process;
const path = require('path');
const pathToReadFile = path.join(__dirname, 'text.txt');
const stream = createReadStream(pathToReadFile, 'utf8');

stream.on('data', data => stdout.write(data));