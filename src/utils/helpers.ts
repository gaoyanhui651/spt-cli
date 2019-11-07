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

export function genSize(bytes, i, decimals = 2) {
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
}

export function formatBytes(bytes, decimals = 2) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  if (bytes === 0) {
    return {
      i: 0,
      unit: sizes[0],
      sizeStr: 0 + ' ' + sizes[0],
      size: 0
    };
  }

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = genSize(bytes, i, dm);
  return {
    i,
    unit: sizes[i],
    sizeStr: size + ' ' + sizes[i],
    size
  };
};
