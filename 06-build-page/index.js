const { createWriteStream } = require('fs');
const { rm, mkdir, readFile, readdir, copyFile } = require('node:fs/promises');
const path = require('path');
const pathToFolder = path.join(__dirname, 'project-dist');
const pathToBundleHtml = path.join(pathToFolder, 'index.html');
const pathToComponents = path.join(__dirname, 'components');
const pathToTemplate = path.join(__dirname, 'template.html');
const pathToBundleCss = path.join(pathToFolder, 'style.css');
const pathToStyles = path.join(__dirname, 'styles');
const sourceFolder = path.join(__dirname, 'assets');
const targetFolder = path.join(pathToFolder, 'assets');
const charset = 'utf-8';

async function getBundleHtml() {
  try {
    const bundleHtml = createWriteStream(pathToBundleHtml, charset);
    const templateContent = await readFile(pathToTemplate, charset);
    let bundleHtmlContent = templateContent.toString();
    const regexp = '{{(.*?)}}';
    const regexpLocal = new RegExp(`${regexp}`);
    const regexpGlobal = new RegExp(`${regexp}`, 'g');
    const componentNamesArray = bundleHtmlContent.match(regexpGlobal);
    for (let i = 0; i < componentNamesArray.length; i++) {
      const componentName = componentNamesArray[i].match(regexpLocal)[1];
      const pathToComponent = path.join(pathToComponents, componentName + '.html');
      const componentСontent = await readFile(pathToComponent, charset);
      bundleHtmlContent = bundleHtmlContent.replace(componentNamesArray[i], componentСontent.toString());
    }
    bundleHtml.write(bundleHtmlContent);
  } catch (err) {
    console.log(err);
  }
}

async function getBundleCss() {
  try {
    const bundleCss = createWriteStream(pathToBundleCss, charset);
    const files = await readdir(pathToStyles, { withFileTypes: true });
    const cssFiles = files.filter(file => path.extname(file.name) === '.css');
    for (let file of cssFiles) {
      const fileContent = await readFile(path.join(pathToStyles, file.name), charset);
      bundleCss.write(fileContent + '\n');
    }
  } catch (err) {
    console.log(err);
  }
}

async function getCopyDir(sourceFolder, targetFolder) {
  try {
    await rm(targetFolder, { recursive: true, force: true });
    await mkdir(targetFolder, { recursive: true });
    const sourceFiles = await readdir(sourceFolder, {withFileTypes: true});
    for (let file of sourceFiles) {
      if (file.isDirectory()) {
        await mkdir(path.join(targetFolder, file.name));
        getCopyDir(path.join(sourceFolder, file.name), path.join(targetFolder, file.name));
      }
      if (file.isFile()) {
        await copyFile(path.join(sourceFolder, file.name), path.join(targetFolder, file.name));
      }
    }
  } catch (err) {
    console.log(err);
  }
}

async function getBundle() {
  try {
    await rm(pathToFolder, { recursive: true, force: true });
    await mkdir(pathToFolder, { recursive: true });

    getBundleHtml();
    getBundleCss();
    getCopyDir(sourceFolder, targetFolder);

  } catch (err) {
    console.log(err);
  }
}

getBundle();