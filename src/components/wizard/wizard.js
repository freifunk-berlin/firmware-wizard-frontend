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
        // André: 'ngInject' does not work for some reason,
        //         so let's make it explicit here
        online: ['$q', 'online', ($q, online) => {
          // catch error (we only want to wait for the check to finish)
          return $q(resolve => online.currentProbe.then(resolve, resolve));
        }],
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
