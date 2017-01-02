import { module } from 'angular';

require('./navbar.less');

export default module('app.components.navbar', []).component('navbar', {
  template: require('./navbar.html'),
});
