import Ora from 'ora';
import { clearHistory, readHistory, showHistory } from '../utils/history';
import logger from '../utils/logger';

export default async function list(line = 3, { clear = false, bytes = false, verbose = false }) {
  const isClear = Boolean(clear);
  const isBytes = Boolean(bytes);
  const isVerbose = Boolean(verbose);
  if (isClear) {
    await clearHistory();
    logger.done('清除网络测速记录成功');
  } else {
    const spinner = Ora({
      prefixText: 'get speed record',
    });
    spinner.start();
    const lines = await readHistory(line);
    const dataList = lines.reverse().map(datum => {
      const [datetime, data] = datum.split('=>');
      if (data) {
        const composeData = Object.assign({}, { datetime }, JSON.parse(data));
        return composeData;
      }
    });
    spinner.succeed();
    showHistory(dataList.filter(Boolean), { isHasTime: true, isBytes, isVerbose });
  }
}
