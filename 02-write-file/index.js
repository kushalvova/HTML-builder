const { stdout } = process;
const path = require('path');
const pathToNewFile = path.join(__dirname, 'text.txt');
const { createWriteStream } = require('fs');
const outputFile = createWriteStream(pathToNewFile, 'utf-8');

const readline = require('node:readline');
const {
    stdin: input,
    stdout: output,
} = require('node:process');

const rl = readline.createInterface({ input, output });

function exitTheProgram() {
  stdout.write('Да прибудет с тобой сила!');
  rl.close();
}

stdout.write('Приветствую тебя, мой друг. Ты можешь ввести любой текст ниже:\n');

rl.on('SIGINT', () => exitTheProgram());
rl.on('line', line => {
  if (line.toString().toLowerCase() === 'exit') exitTheProgram();
  else outputFile.write(line + '\n');
});