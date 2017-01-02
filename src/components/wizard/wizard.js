import { module } from 'angular';
import uiRouter from 'angular-ui-router';

export default module('app.components.wizard', [uiRouter])
  .config($stateProvider => {
    'ngInject';
    $stateProvider.state({
      name: 'wizard',
      component: 'wizard',
      url: '/wizard',
    });
  })
  .component('wizard', {
    controller: class WizardCtrl {
      constructor(online) {
        'ngInject';
        this.online = online;
      }
    },
    template: require('./wizard.html'),
  });
