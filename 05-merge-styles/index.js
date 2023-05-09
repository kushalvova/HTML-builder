const { createWriteStream } = require('fs');
const { readdir, readFile } = require('fs/promises');
const path = require('path');
const pathToBundle = path.join(__dirname, 'project-dist', 'bundle.css');
const pathToStyles = path.join(__dirname, 'styles');
const charset = 'utf-8';

async function createBandle() {
  try {
    const bundle = createWriteStream(pathToBundle, charset);
    const files = await readdir(pathToStyles, { withFileTypes: true });
    const styleFiles = files.filter(file => path.extname(file.name) === '.css');
    for (let file of styleFiles) {
      const contents = await readFile(path.join(pathToStyles, file.name), charset);
      bundle.write(contents + '\n');
    }
  } catch (err) {
    console.log(err);
  }
}

createBandle();