import { copy, module } from 'angular';
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
      constructor($q, downloadFile, online, router) {
        'ngInject';
        this.$q = $q;
        this.downloadFile = downloadFile;
        this.online = online;
        this.router = router;
      }

      $onInit() {
        console.log(this.config);
      }

      download() {
        this.downloadFile.download(
          `config-${this.config.router.name || 'unknown'}.json`,
          JSON.stringify(this.config, undefined, 2),
          'application/json',
          true
        );
      }

      submit() {
        if (!this.session.connection) {
          console.log('bsasd')
          return this.$q.reject(new Error('no connection to router'));
        }
        if (!this.session.authentication) {
          return this.$q.reject(new Error('not authenticated'));
        }

        const newConfig = copy(this.config);
        // due to an ubox bug we have to convert lat and lon to strings
        newConfig.location.lat = newConfig.location.lat && newConfig.location.lat.toString();
        newConfig.location.lng = newConfig.location.lng && newConfig.location.lat.toString();

        this.submitting = true;
        this.error = undefined;
        router.applyConfig(newConfig).then(
          data => {
            this.submitting = false;
            this.applied = true;
          },
          data => {
            this.submitting = false;
            this.error = data;
          }
        );
      }
    },
    template: require('./wizard.html'),
  });
