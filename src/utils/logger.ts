
import chalk from 'chalk';

class Logger {
  start(str: string){
    console.log(
      format(chalk.bgGreen.black('[🚀START]: '),
        `/-------------------- ${str} --------------------/\n`)
    );
  }
  done(str: string) {
    console.log(
      '\n',
      format(chalk.bgGreen.black('[✅DONE]: '),
        `/-------------------- ${str} --------------------/\n`)
    );
  };
  step(str: string) {
    console.log(
      '\n',
      format(chalk.bgWhiteBright.black('[⛳STEP]: '),
        chalk.blue(str))
    );
  };
  info(str: string) {
    console.log(
      '\n',
      format(chalk.bgWhiteBright.black('[🔖INFO]: '),
        str)
    );
  };
  error(str: string) {
    console.log(
      '\n',
      format(chalk.bgWhiteBright.black('[⛔️ERROR]: '),
        chalk.red(str))
    );
  };
  warn(str: string) {
    console.log(
      '\n',
      format(chalk.bgWhiteBright.black('[⚠️WARN]: '),
        chalk.yellow(str))
    );
  };
  success(str: string) {
    console.log(
      format(chalk.bgGreen.black('[👏success]: '),
        chalk.green(str))
    );
  };
  verbose(str: string){
    console.log(str);
  };

}

function format(label = '🐛: ', msg = '') {
  return msg.split('\n').map((line, i) => {
    return i === 0
      ? `${label} ${line}`
      : line.padStart(chalk.reset(label).length);
  }).join('\n');
}

export default new Logger();
