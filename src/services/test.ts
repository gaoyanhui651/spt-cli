import * as speedTest from 'speedtest-net';
import * as roundTo from 'round-to';
import stat from './stat';
import logger from '../utils/logger';

export default function test(maxTime = 3000) {
  const st = speedTest({ maxTime });
  st.once('testserver', server => {
    const ping = roundTo(server.bestPing, 2);
    stat.status = 'ping';
    stat.updateStat('ping', ping);
    // logger.start(`ping ${ping}`);
  });

  st.on('downloadspeed', speed => {
    const download = roundTo(speed, 3);
    stat.status = 'upload';
    stat.updateStat('download', download);
    // logger.info(`downloadspeed - => ${download}`)
  });

  st.on('downloadspeedprogress', speed => {
    const download = roundTo(speed, 3);
    stat.status = 'download';
    // logger.info(`downloadspeedprogress - => ${download}`);
    stat.updateStat('download', download);
  });

  st.on('uploadspeed', speed => {
    const upload = roundTo(speed, 3);
    // stat.status = 'info';
    stat.updateStat('upload', upload);
  });
  st.on('uploadspeedprogress', speed => {
    const upload = roundTo(speed, 3);
    stat.status = 'upload';
    stat.updateStat('upload', upload);
  });

  st.on('done', () => {
    // logger.done('done');
  });

  st.on('data', data => {
    stat.updateStat('info', data);
  });


  st.on('error', error => {
    if (error.code === 'ENOTFOUND') {
      logger.error('Please check your internet connection');
    } else {
      logger.error(error.message);
    }
    process.exit(1);
  });
}

