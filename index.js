import { join, dirname } from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { setupMaster, fork } from 'cluster';
import { watchFile, unwatchFile } from 'fs';
import cfonts from 'cfonts';
import { createInterface } from 'readline';
import yargs from 'yargs';
import express from 'express'; // Import express directly
import chalk from 'chalk';
import path from 'path';
import os from 'os';
import { promises as fsPromises } from 'fs';

// https://stackoverflow.com/a/50052194
const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url); // Update to createRequire

const { name, author } = require(join(__dirname, './package.json'));
const { say } = cfonts;
const rl = createInterface(process.stdin, process.stdout);

say('Gata\nBot\nMD', {
  font: 'chrome',
  align: 'center',
  gradient: ['red', 'magenta']
});

say(`Por GataDios`, {
  font: 'console',
  align: 'center',
  gradient: ['red', 'magenta']
});

let isRunning = false;

async function start(file) {
  if (isRunning) return;
  isRunning = true;
  const currentFilePath = new URL(import.meta.url).pathname;
  let args = [join(__dirname, file), ...process.argv.slice(2)];
  say([process.argv[0], ...args].join(' '), {
    font: 'console',
    align: 'center',
    gradient: ['red', 'magenta']
  });
  
  setupMaster({ exec: args[0], args: args.slice(1) });
  let p = fork();
  
  p.on('message', data => {
    switch (data) {
      case 'reset':
        p.process.kill();
        isRunning = false;
        start.apply(this, arguments);
        break;
      case 'uptime':
        p.send(process.uptime());
        break;
    }
  });

  p.on('exit', (_, code) => {
    isRunning = false;
    console.error('⚠️ ERROR ⚠️ >> ', code);
    start('main.js'); // Not sure about this line, adjust as needed

    if (code === 0) return;

    watchFile(args[0], () => {
      unwatchFile(args[0]);
      start(file);
    });
  });

  const ramInGB = os.totalmem() / (1024 * 1024 * 1024);
  const freeRamInGB = os.freemem() / (1024 * 1024 * 1024);
  const packageJsonPath = path.join(path.dirname(currentFilePath), './package.json');

  try {
    const packageJsonData = await fsPromises.readFile(packageJsonPath, 'utf-8');
    const packageJsonObj = JSON.parse(packageJsonData);
    const currentTime = new Date().toLocaleString();

    console.log(chalk.yellow(`╭─────────────────────────────────────┬─────────────────────────────╮`));
    console.log(chalk.yellow(`┊ OS:${os.type()}, ${os.release()} - ${os.arch()}`));
    console.log(chalk.yellow(`┊ 💾 Total RAM: ${ramInGB.toFixed(2)} GB`));
    console.log(chalk.yellow(`┊ 💽 Free RAM: ${freeRamInGB.toFixed(2)} GB`));
    console.log(chalk.yellow(`╭─────────────────────────────────────┬─────────────────────────────╮`));
    console.log(chalk.yellow(`┊ 💾 Version:${packageJsonObj.version}`));
    console.log(chalk.yellow(`┊ 💾 Descripción:${packageJsonObj.description}`));
    console.log(chalk.yellow(`┊ 💾 Autor:${packageJsonObj.author.name} (@gata_dios)`));
    console.log(chalk.yellow(`┊ 💾 Colaboradores:`));
    console.log(chalk.yellow(`┊    • elrebelde21 (Mario ofc)`));
    console.log(chalk.yellow(`┊    • KatashiFukushima (Katashi)`));
    console.log(chalk.yellow(`┊ 💾 Hora Actual:${currentTime}`));
    console.log(chalk.yellow(`╰─────────────────────────────────────┬─────────────────────────────╮`));
    setInterval(() => {}, 1000);
  } catch (err) {
    console.error(chalk.red(`❌ No se pudo leer el archivo package.json: ${err}`));
  }

  let opts = yargs(process.argv.slice(2)).exitProcess(false).parse();
  if (!opts['test']) {
    if (!rl.listenerCount()) {
      rl.on('line', line => {
        p.emit('message', line.trim());
      });
    }
  }
}

start('main.js');
