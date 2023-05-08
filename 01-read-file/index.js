const { createReadStream } = require('fs');
const path = require('path');
const pathToReadFile = path.join(__dirname, 'text.txt')
const stream = createReadStream(pathToReadFile, 'utf8');
const { stdout } = process;

stream.on('data', data => stdout.write(data));