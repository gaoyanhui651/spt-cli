export type IStatKey = 'ping' | 'download'| 'upload' | 'info';

const statKeys = ['ping', 'download', 'upload', 'info']

class Stat {
  stat = {
    ping: new Set<number>(),
    download: new Set<number>(),
    upload: new Set<number>(),
    info: {},
  }
  eventMap = new Map();
  status: 'pending' | IStatKey = 'pending';

  updateStat(key: IStatKey, value: number | object) {
    if (statKeys.findIndex(k => k === key) > statKeys.findIndex(k => this.status === k)) {
      return;
    }
    const set = this.stat[key];
    if (set instanceof Set) {
      set.add(value as number);
    } else {
      Object.assign(set, value);
    }
    this.eventMap.forEach((callList, e) => {
      callList.forEach(callback => {
        callback(e, this.stat, this.status)
      });
    })
  }
  on(event, callback) {
    this.eventMap.has(event) || this.eventMap.set(event, []);
    this.eventMap.get(event).push(callback);
    return this;
  }

  off(event) {
    this.eventMap.delete(event);
    return this;
  }
}

export default new Stat();