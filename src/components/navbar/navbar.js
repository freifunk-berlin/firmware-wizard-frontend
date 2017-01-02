import { module } from 'angular';

require('./navbar.less');

export default module('app.components.navbar', []).component('navbar', {
  controller: class NavbarCtrl {
    constructor() {
      this.collapsed = true;
    }
  },
  template: require('./navbar.html'),
});
