const path = require('path');
const folderPath = path.join(__dirname, 'secret-folder');
const { readdir} = require('fs/promises');
const { stat } = require('fs/promises');
const option = { withFileTypes: true };

async function getFiles(folderPath, option) {
  try {
    const files = await readdir(folderPath, option);
    files.filter(file => !file.isDirectory()).forEach(file => getResult(file.name));
  } catch (err) {
    console.log(err);
  }
};

async function getResult (fileName) {
  const filePath = path.join(folderPath, fileName);
  const fileStats = await stat(filePath);
  const fileSize = `${fileStats.size / 1024}kb`;
  console.log(fileName, '-', path.extname(fileName), '-', fileSize);
}

getFiles(folderPath, option);