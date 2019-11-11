import fs from 'fs';
import { promisify } from 'util';
import Table from 'cli-table3';
import { format } from 'date-fns';
import chalk from 'chalk';
import Readline from 'reverse-read-line';
import { formatBytes, formatSpeed } from './helpers';
import { FILE_NAME, EXCLUDE_COLUMNS } from './constants';

const appendFileAsync = promisify(fs.appendFile);
const truncateAsync = promisify(fs.truncate);

export function pushHistory(data) {
  return appendFileAsync(FILE_NAME, `${new Date()} => ${JSON.stringify(data)}\n`);
  return new Promise((resolve, reject) => {
    // https://nodejs.org/dist/latest-v12.x/docs/api/fs.html#fs_fs_write_fd_buffer_offset_length_position_callback
    // 在 Linux 上，当以追加模式打开文件时，写入无法指定位置。 内核会忽略位置参数，并始终将数据追加到文件的末尾。
    // const buffer = new Buffer(`\n${new Date()} => ${JSON.stringify(data)}`);
    // const fd = fs.openSync(FILE_NAME, 'a+');
    // fs.write(fd, buffer, 0, buffer.length, 0, error => {
    //     if (error) {
    //     reject(error);
    //   } else {
    //     resolve();
    //   }
    // })
  });
}

export async function readHistory(line = 6): Promise<Array<string>> {
  const reader = new Readline(FILE_NAME);
  await reader.open();
  const lines = await reader.readLines(line);
  await reader.close();
  return lines;
}

export function clearHistory() {
  return truncateAsync(FILE_NAME, 0);
}

const columnsMap = [
  {
    key: 'datetime',
    format(data) {
      try {
        const time = format(new Date(data.datetime), 'yyyy-MM-dd HH:mm:ss');
        return time;
      } catch (error) {
        return null;
      }
    },
  },
  {
    key: 'ip address',
    format(data) {
      return chalk.greenBright(data.ip);
    },
  },
  {
    key: 'download',
    format(data, isBytes) {
      return chalk.blueBright(formatSpeed(data.download, isBytes, false));
    },
  },
  {
    key: 'upload',
    format(data, isBytes) {
      return chalk.magentaBright(formatSpeed(data.upload, isBytes, false));
    },
  },
  {
    key: 'ping',
    format(data) {
      return chalk.yellowBright(data.ping + ' ms');
    },
  },
  {
    key: 'traffic cost',
    format(data) {
      const download = formatBytes(data.originalDownload * 8);
      const upload = formatBytes(data.originalUpload * 8);
      const downloadStr = chalk.bold.dim.whiteBright(download.sizeStr);
      const uploadStr = chalk.bold.dim.whiteBright(upload.sizeStr);
      return `${chalk.blueBright('Download')}: ${downloadStr}\n${chalk.magentaBright(
        'Upload',
      )}: ${uploadStr}`;
    },
  },
  {
    key: 'isp',
    format(data) {
      const isp = chalk.cyanBright(data.isp);
      const location = chalk.whiteBright(`Lat: ${data.lat} Lon: ${data.lon}`);
      return ' '.repeat(Math.round((location.length - isp.length) / 2)) + isp + '\n' + location;
    },
  },
  {
    key: 'server location',
    format(data) {
      return `${data.serverLocation}\n DIS: ${chalk.red(`${data.distance} Km`)}`;
    },
  },
];

export function formatTable(data, isBytes = false, isVerbose) {
  return getColumns(isVerbose)
    .map(({ format }) => format(data, isBytes))
    .filter(v => v !== null);
}

function getColumns(isVerbose) {
  const selectColumns = isVerbose
    ? columnsMap
    : columnsMap.filter(col => !EXCLUDE_COLUMNS.includes(col.key));
  return selectColumns;
}

export function showHistory(
  dataList,
  { isHasTime = false, isBytes = false, isVerbose = true } = {},
) {
  const head = getColumns(isVerbose).map(({ key }) => key);
  if (!isHasTime) {
    head.shift();
  }
  const table = new Table({
    head,
    colAligns: ['center'],
    rowAligns: ['center'],
    style: {
      head: ['gray'],
      border: ['cyanBright'],
    },
  }) as Table.HorizontalTable;
  dataList.forEach(datum => {
    const data = formatTable(datum, isBytes, isVerbose);
    table.push(data);
  });
  console.log(table.toString());
}
