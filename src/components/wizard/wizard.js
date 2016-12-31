import { module } from 'angular';

export default module('app.components.wizard', []).component('wizard', {
  controller: class WizardCtrl {
    constructor(online) {
      'ngInject';
      this.online = online;
    }
  },
  template: require('./wizard.html'),
});
