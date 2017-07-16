import { module } from 'angular';

export default module('app.filters.seconds-to-datetime', [])
    .filter('secondsToDateTime', () => (input) => {
      const d = new Date(0, 0, 0, 0, 0, 0, 0);
      d.setSeconds(input);
      return d;
    });
