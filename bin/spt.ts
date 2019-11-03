#!/usr/bin/env node

import * as semver from 'semver';
import * as commander from 'commander';
import * as notifier from 'update-notifier';
import * as pkg from '../package.json';
import lolcat from '../src/utils/lolcat';
import logger from '../src/utils/logger';
import { Chart } from '../src/services/chart.js';
import favicon from '../favicon';

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
  .description('测试抓取 速度')
  .action(async () => {
    try {
      new Chart().init();
    } catch (e) {
      e && logger.error(e.message || e.stack);
    }
  })



commander.parse(process.argv);

function notCmd(cmd: string) {
  logger.error(`no <${cmd}> command given!`);
  process.exit(1);
}