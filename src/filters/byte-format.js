import { module } from 'angular';

export default module('app.filters.byte-format', [])
    .filter('byteFormat', () => (bytes, precision) => {
      let myPrecision = precision;
      const units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'];
      const number = Math.floor(Math.log(bytes) / Math.log(1024));
      if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
      if (bytes === 0) return '0 MB';
      if (typeof myPrecision === 'undefined') myPrecision = 1;
      // eslint-disable-next-line no-restricted-properties
      return `${(bytes / (Math.pow(1024, Math.floor(number)))).toFixed(myPrecision)} ${units[number]}`;
    });
