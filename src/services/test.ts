import speedTest from 'speedtest-net';
import roundTo from 'round-to';
import Listr from 'listr';
import chalk from 'chalk';
import logger from '../utils/logger';
import stat from './stat';
import { pushHistory, showHistory } from '../utils/history';
import { formatSpeed } from '../utils/helpers';

export default async function init({
  time = 3000,
  bytes = false,
  proxy
}) {
  const st = speedTest({ maxTime: time, pingCount: 3, proxy });
  const isBytes = !!bytes;
  st.on('error', error => {
    if (error.code === 'ENOTFOUND') {
      logger.error('Please check your internet connection');
    } else {
      logger.error(error.message);
    }
    process.exit(1);
  });
  let ping = 0;
  const tasks = new Listr([
    {
      title: 'ping',
      async task(ctx, task) {
        return new Promise(resolve => {
          st.once('testserver', server => {
            ping = roundTo(server.bestPing, 0);
            stat.updateStat('ping', ping);
            task.title += chalk.yellowBright('       ' + ping + '  ms');
            ctx.status = 0;
            resolve(ping);
          });
        })
      },
    },
    {
      title: 'download',
      async task(ctx, task) {
        return new Promise(resolve => {
          st.on('downloadspeedprogress', speed => {
            if (ctx.status < 1) {
              const download = roundTo(speed, 2);
              stat.updateStat('download', download);
              task.title = 'download' + chalk.greenBright('   ' + formatSpeed(download, isBytes));
            }
          });
          st.on('downloadspeed', speed => {
            const download = roundTo(speed, 2);
            ctx.status = 1;
            stat.updateStat('download', download);
            task.title = 'download' + chalk.greenBright('   ' + formatSpeed(download, isBytes));
            resolve(download);
          });
        })
      }
    },
    {
      title: 'upload',
      async task(ctx, task) {
        return new Promise(resolve => {
          st.on('uploadspeedprogress', speed => {
            if (ctx.status < 2) {
              const upload = roundTo(speed, 2);
              stat.updateStat('upload', upload);
              task.title = 'upload' + chalk.magentaBright('     ' + formatSpeed(upload, isBytes));  
            }
           });
          st.on('uploadspeed', speed => {
            const upload = roundTo(speed, 2);
            ctx.status = 2;
            stat.updateStat('upload', upload);
            task.title = 'upload' + chalk.magentaBright('     ' + formatSpeed(upload, isBytes));  
            resolve(upload);
          });
        })
      }
    }
  ]);
  const [, formatData] = await Promise.all([
    tasks.run(),
    new Promise((resolve, reject) => {
      st.on('data', async data => {
        const { speeds, client, server } = data;
        const { ip, isp, lat, lon } = client;
        const { distance, location, country } = server;
        const formatData = Object.assign({}, speeds, {
          ping,
          ip,
          isp,
          lat,
          lon,
          distance,
          serverLocation: country + ' ' + location,
        });
        try {
          await pushHistory(formatData);
          resolve(formatData);
        } catch (error) {
          reject(error)
        }
      });
    }),
    new Promise(resolve => {
      st.on('done', dataOverload => {
        resolve(dataOverload)
      });
      st.on('config', url => {
        // console.log('config', url);
      });
    })
  ]);
  console.log('\n');
  showHistory([formatData], { isBytes });
}

