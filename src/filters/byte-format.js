import { module } from 'angular';

export default module('app.filters.byte-format', [])
    .filter('byteFormat', () => (bytes, precision) => {
      if (bytes === undefined) return '-';
      if (bytes === 0) return '0 MB';
      if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
      let myPrecision = precision;
      const units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'];
      const number = Math.floor(Math.log(bytes) / Math.log(1024));
      if (typeof myPrecision === 'undefined') myPrecision = 1;
      // eslint-disable-next-line no-restricted-properties
      return `${(bytes / (Math.pow(1024, Math.floor(number)))).toFixed(myPrecision)} ${units[number]}`;
    });
