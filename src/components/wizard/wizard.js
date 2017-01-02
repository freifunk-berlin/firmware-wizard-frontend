import { module } from 'angular';
import uiRouter from 'angular-ui-router';

export default module('app.components.wizard', [uiRouter])
  .config($stateProvider => {
    'ngInject';
    $stateProvider.state({
      name: 'wizard',
      component: 'wizard',
      resolve: {
        config: () => Promise.resolve({}),
      },
      url: '/wizard',
    });
  })
  .component('wizard', {
    bindings: {
      config: '<',
    },
    controller: class WizardCtrl {
      constructor(online) {
        'ngInject';
        this.online = online;
      }

      $onInit() {
        console.log(this.config);
      }
    },
    template: require('./wizard.html'),
  });
