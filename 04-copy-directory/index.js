const { rm, mkdir, readdir, copyFile } = require('node:fs/promises');
const path = require('path');
const folderName = 'files';
const sourceFolder = path.join(__dirname, folderName);
const targetFolder = `${sourceFolder}-copy`;

async function getCopy() {
  try {
    await rm(targetFolder, { recursive: true, force: true });
    await mkdir(targetFolder, { recursive: true });
    const files = await readdir(sourceFolder);
    for (let file of files) {
      await copyFile(path.join(sourceFolder, file), path.join(targetFolder, file));
    }
  } catch (err) {
    console.log(err);
  }
}

getCopy();