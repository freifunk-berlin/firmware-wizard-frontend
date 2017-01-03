import { module } from 'angular';

export default module('app.components.wizard-router', [])
  .component('wizardRouter', {
    bindings: {
      router: '<',
      onRouterUpdate: '&',
    },
    controller: class WizardRouterCtrl {
      constructor($scope) {
        'ngInject';
      }
    },
    template: require('./wizard-router.html'),
  });
