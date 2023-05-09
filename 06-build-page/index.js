const path = require('path');
const { createWriteStream } = require('fs');
const { rm, mkdir, readFile, readdir, copyFile } = require('node:fs/promises');
const charset = 'utf-8';
const dirName = path.join(__dirname, 'project-dist');
const pathToHtml = path.join(dirName, 'index.html');
const pathToCss = path.join(dirName, 'style.css');
const pathToStyles = path.join(__dirname, 'styles');
const pathToComponents = path.join(__dirname, 'components');
const template = path.join(__dirname, 'template.html');
const inputDir = path.join(__dirname, 'assets');
const outputDir = path.join(dirName, 'assets');

async function getHtml() {
  try {
    const html = createWriteStream(pathToHtml, charset);
    const templateContent = await readFile(template, charset);
    let templateContentStr = templateContent.toString();
    let regexp = /{{(.*?)}}/g;
    let componentsArray = templateContentStr.match(regexp);
    for (let i = 0; i < componentsArray.length; i++) {
      let componentName = componentsArray[i].match(/{{(.*?)}}/)[1];
      const component = path.join(pathToComponents, componentName + '.html');
      const content = await readFile(component, charset);
      templateContentStr = templateContentStr.replace(componentsArray[i], content.toString());
    }
    html.write(templateContentStr);
  } catch (err) {
    console.log(err);
  }
}

async function getCss() {
  try {
    const bundle = createWriteStream(pathToCss, charset);
    const files = await readdir(pathToStyles, { withFileTypes: true });
    const styles = files.filter(file => path.extname(file.name) === '.css');
    for (let file of styles) {
      const fileContent = await readFile(path.join(pathToStyles, file.name), charset);
      bundle.write(fileContent + '\n');
    }
  } catch (err) {
    console.log(err);
  }
}

async function getCopyFile(src, dest) {
  try {
    await copyFile(src, dest);
  } catch (err) {
    console.log(err);
  }
}

async function getCopyDir(inputDir, outputDir) {
  try {
    await rm(outputDir, { recursive: true, force: true });
    await mkdir(outputDir, { recursive: true });
    const filesToCopy = await readdir(inputDir, {withFileTypes: true});
    for (let elem of filesToCopy) {
      if (elem.isDirectory()) {
        await mkdir(path.join(outputDir, elem.name));
        getCopyDir(path.join(inputDir, elem.name), path.join(outputDir, elem.name));
      };
      if (!elem.isDirectory()) {
        getCopyFile(path.join(inputDir, elem.name), path.join(outputDir, elem.name));
      }
    }
  } catch (err) {
    console.log(err);
  }
}

async function getBundle() {
  try {
    await rm(dirName, { recursive: true, force: true });
    await mkdir(dirName, { recursive: true });

    getHtml();
    getCss();
    getCopyDir(inputDir, outputDir);

  } catch (err) {
    console.log(err);
  }
}

getBundle();