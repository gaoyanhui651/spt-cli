import geoip from 'geoip-lite';

export async function delay(ms: number = 1000) {
  return new Promise(r => setTimeout(r, ms));
}

export function getHost(url: string) {
  const reg = /^(?:https?\:\/\/|\/\/)?([\w\.]+).*/;
  return url.replace(reg, '$1');
}

export function getGeoByIp(ip4: string) {
  const geo = geoip.lookup(ip4);
  const location = geo ? `${geo.country}-${geo.city || geo.region}` : '--';
  return Object.assign({}, geo, { location });
}
