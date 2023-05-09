const { readdir} = require('fs/promises');
const { stat } = require('fs/promises');
const option = { withFileTypes: true };
const path = require('path');
const pathToFolder = path.join(__dirname, 'secret-folder');

async function getResult (fileName) {
  const pathToFile = path.join(pathToFolder, fileName);
  const fileStat = await stat(pathToFile);
  const fileSize = `${fileStat.size / 1024}kb`;
  console.log(fileName, '-', path.extname(fileName), '-', fileSize);
}

async function getFiles(pathToFolder, option) {
  try {
    const files = await readdir(pathToFolder, option);
    files.filter(file => !file.isDirectory()).forEach(file => getResult(file.name));
  } catch (err) {
    console.log(err);
  }
}

getFiles(pathToFolder, option);