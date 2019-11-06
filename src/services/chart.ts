import { screen, Widgets } from 'blessed';
import { line } from 'blessed-contrib';
// import stat from './stat';
import test from './test';

function randomColor(): any {
  return [Math.random() * 255, Math.random() * 255, Math.random() * 255];
}

export class Chart {
  screen: Widgets.Screen;
  line: ReturnType<typeof line>;
  count = 0;
  constructor(props?) {
    // stat.on('update', this.updateData.bind(this));
    this.screen = screen({
      // output: process.stdout,
    });
    this.line = line({
      width: '80%',
      height: '50%',
      top: '2%',
      left: '2%',
      xPadding: 5,
      label: 'Mbps/s',
      wholeNumbersOnly: false,
      // abbreviate: true,
      style: { 
        line: randomColor(), 
        text: randomColor(), 
        baseline: randomColor()
      },
    });
    this.screen.append(this.line);
  }
  genData(list = [], category, color = 'blue', ) {
    const data = [...list];
    return [{
      title: category,
      x: data,
      y: data,
      style: {
        line: color,
      }
    }];
  }
  updateData(e, statObj, status) {
    const data = this.genData(statObj[status] || [], status);
    this.line.setData(data);
    this.screen.render();
  }
  init() {
    this.screen.append(this.line); //must append before setting data
    // this.screen.render();
    test();
  }
}