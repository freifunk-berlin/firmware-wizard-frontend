import { isObject, module } from 'angular';

export default module('app.filters.byte-format', [])
    .filter('byteFormat', () => (bytes, precision) => {
        if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
        if (bytes === 0) return '0 MB';
        if (typeof precision === 'undefined') precision = 1;
        var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
            number = Math.floor(Math.log(bytes) / Math.log(1024));
        return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
});