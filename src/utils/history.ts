import fs from 'fs';
import Table from 'cli-table3';
import { format } from 'date-fns'
import chalk from 'chalk';
import { formatBytes, formatSpeed } from './helpers';

const fileName = '.temp_test_record.log';

export function pushHistory(data) {
  return new Promise((resolve, reject) => {
    // const buffer = new Buffer(`\n${new Date()} => ${JSON.stringify(data)}`);
    // const fd = fs.openSync(fileName, 'a+');
    // fs.write(fd, buffer, 0, buffer.length, 0, error => {
    //     if (error) {
    //     reject(error);
    //   } else {
    //     resolve();
    //   }
    // })
    fs.appendFile(fileName, `\n${new Date()} => ${JSON.stringify(data)}`, error => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    })
  })
}

const keyMap = [{
  key: 'datetime',
  format(data) {
    try {
      const time = format(data.datetime, 'YYYY-MM-dd HH:MM:SS');
      return time;
    } catch (error) {
      return null;
    }
  }
}, {
  key: 'ip address',
    format(data) { return chalk.greenBright(data.ip) }
}, {
  key: 'download',
    format(data, isBytes) { return chalk.blueBright(formatSpeed(data.download, isBytes, false))  }
}, {
  key: 'upload',
    format(data, isBytes) { return chalk.magentaBright(formatSpeed(data.upload, isBytes, false)) }
}, {
  key: 'ping',
  format(data) { return chalk.yellowBright(data.ping + ' ms') }
}, {
  key: 'traffic cost',
  format(data) {
    const download = formatBytes(data.originalDownload * 8);
    const upload = formatBytes(data.originalUpload * 8);
    const downloadStr = chalk.bold.dim.whiteBright(download.sizeStr);
    const uploadStr = chalk.bold.dim.whiteBright(upload.sizeStr);
    return `${chalk.blueBright("Download")}: ${downloadStr}\n${chalk.magentaBright("Upload")}: ${uploadStr}`
  }
}, {
  key: 'isp',
  format(data) { 
    const isp = chalk.cyanBright(data.isp)
    const location = chalk.whiteBright(`Lat: ${ data.lat } Lon: ${ data.lon }`);
    return ' '.repeat(Math.round((location.length - isp.length) / 2)) + isp + '\n' + location;
  }
}, {
  key: 'server location',
  format(data) { return `${data.serverLocation}\n DIS: ${chalk.red(`${data.distance} Km`)}` }
}]


function formatTable(data, isBytes = false) {
  return keyMap.map(({ format }) => format(data, isBytes)).filter(v => v !== null);
}

export function showHistory(dataList, {
  isHasTime = false,
  isBytes = false
} = {}) {
  const head = keyMap.map(({ key }) => key);
  if (!isHasTime) {
    head.shift();
  }
  const table = new Table({
    head,
    colAligns: ['center'],
    rowAligns: ['center'],
    style: {
      head: [ 'gray' ],
      border: ['cyanBright'],
    }
  }) as Table.HorizontalTable;
  dataList.forEach(datum => {
    table.push(formatTable(datum, isBytes));
  });
  console.log(table.toString());
}