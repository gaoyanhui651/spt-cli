#!/usr/bin/env node

import semver from 'semver';
import commander from 'commander';
import notifier from 'update-notifier';
import pkg from '../package.json';
import lolcat from '../src/utils/lolcat';
import logger from '../src/utils/logger';
import test from '../src/services/test';
import genIps from '../src/services/get-ip.js';
import favicon from '../favicon';
import chalk from 'chalk';

const requiredVersion = pkg.engines.node;
const version = pkg.version;

if (!semver.satisfies(process.version, requiredVersion)) {
  logger.error(
    `You are using Node ${process.version}, but this version of spd ` +
    `requires Node ${requiredVersion}.\nPlease upgrade your Node version.`
  );
  process.exit(1);
}
// 检查提示更新
notifier({ pkg }).notify({ defer: true });

commander.version(`
  v${version}
  ${lolcat(favicon)}
`)
  .usage('<command> [options]')
  // .allowUnknownOption()
  .arguments('<cmd> [option...]')
  .action(notCmd);


commander
  .command('test')
  .description('test network speet')
  .action(async () => {
    try {
      await test();
    } catch (e) {
      errorHandle(e);
    }
  })

commander
  .command('ip [host]')
  .description('get ip address the local or input host public or internal')
  .option('-t --type [type]', 'select network type', /^(all|public|internal)$/, 'all')
  .action(async (host, cmdObj) => {
    try {
      await genIps(host, cmdObj)
    } catch (e) {
      errorHandle(e);
    }
  })
  .on('--help', function() {
    console.log();
    console.log('Examples:');
    console.log();
    console.log(chalk.gray('    # 获取本机的公网和局域网ip'));
    console.log('    $ spt ip');
    console.log();
    console.log(chalk.gray('    # 只获取本机的公网地址'));
    console.log('    $ spt ip -t public');
    console.log();
    console.log(chalk.gray('    # 获取指定网址的公网地址'));
    console.log('    $ spt ip baidu.com');
    console.log();
  })

commander.parse(process.argv);
if (!process.argv.slice(2).length) {
  commander.help();
}

process.on('SIGINT', function () {
  logger.warn('spt dialog kill by user!');
  process.exit()
});

function notCmd(cmd: string) {
  logger.error(`no <${cmd}> command given!`);
  process.exit(1);
}

function errorHandle(e?: Error) {
  e && logger.error(e.message || e.stack);
  process.exit(1);
}