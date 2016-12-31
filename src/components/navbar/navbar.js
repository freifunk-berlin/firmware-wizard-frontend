import { module } from 'angular';

export default module('app.components.navbar', []).component('navbar', {
  controller: class NavbarCtrl {
    // $inject = ['$translate']
    constructor($translate) {
      this.test = 'hi';
    }
  },
  template: require('./navbar.html'),
});
