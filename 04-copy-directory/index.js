const path = require('path');
const dirName = 'files';
const inputDir = path.join(__dirname, dirName);
const outputDir = `${inputDir}-copy`;
const { rm, mkdir, readdir, copyFile } = require('node:fs/promises');

async function getCopyOfDir() {
  try {
    await rm(outputDir, { recursive: true, force: true });
    await mkdir(outputDir, { recursive: true });
    const filesToCopy = await readdir(inputDir);
    for (let file of filesToCopy) {
      await copyFile(path.join(inputDir, file), path.join(outputDir, file));
    }
  } catch (err) {
    console.log(err);
  }
}

getCopyOfDir();