import dns from 'dns';
import { promisify } from 'util';
import publicIp from 'public-ip';
import internalIp from 'internal-ip';
import chalk from 'chalk';
import Ora from 'ora';
import Table from 'cli-table3';

import { getHost, getGeoByIp } from '../utils/helpers';
import { COLORS } from '../utils/constants';

const resolve4Async = promisify(dns.resolve4);

type tableInstance = Table.GenericTable<Table.Cell[]>;

export async function getPublicIp<T extends tableInstance>(table?: T) {
  const ip = await publicIp.v4();
  const geo = getGeoByIp(ip);
  if (table instanceof Table) {
    table.push(['public-ip4', chalk.bold.greenBright(ip), geo.location]);
  }
  return { ip, geo };
}

export async function getInternalIp<T extends tableInstance>(table?: T) {
  const ip = await internalIp.v4();
  if (table instanceof Table) {
    table.push(['internal-ip4', chalk.italic.yellowBright(ip), '--']);
  }
  return { ip };
}
export type ipType = 'public' | 'internal' | 'all';
export type optionType = {
  type: ipType;
};
export default async function genIps(host: string, { type = 'all' }: optionType) {
  const spinner = Ora({
    prefixText: 'get ips',
  });
  spinner.start();
  const isInputHost = host !== undefined;
  let head = ['ip type', 'ip address', 'location'];
  if (isInputHost) {
    head[0] = 'host';
  }
  const table = new Table({
    head,
    colAligns: ['center'],
    rowAligns: ['center'],
    style: {
      head: ['cyan'],
      border: ['cyanBright'],
    },
  }) as Table.HorizontalTable;

  if (isInputHost) {
    const hostname = getHost(host);
    const addresses = await resolve4Async(hostname);
    addresses.forEach((address, i) => {
      const geo = getGeoByIp(address);
      const ip = chalk.italic[COLORS[i]](address);
      if (i === 0) {
        table.push([
          { rowSpan: addresses.length, content: chalk.magentaBright(hostname), vAlign: 'center' },
          ip,
          geo.location,
        ]);
      } else {
        table.push([ip, geo.location]);
      }
    });
    spinner.succeed();
    console.log(table.toString());
    return addresses;
  }
  // 过去本机 address
  const promises = [];
  if (type === 'public') {
    promises.push(getPublicIp(table));
  } else if (type == 'internal') {
    promises.push(getInternalIp(table));
  } else {
    Array.prototype.push.call(promises, getPublicIp(table), getInternalIp(table));
  }
  const ips = await Promise.all(promises);
  spinner.succeed();
  console.log(table.toString());
  return ips;
}
