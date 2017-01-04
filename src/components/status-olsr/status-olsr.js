import { module } from 'angular';
import uiRouter from 'angular-ui-router';

export default module('app.components.status-olsr', [uiRouter])
  .config(($stateProvider) => {
    'ngInject';

    $stateProvider.state({
      component: 'statusOlsr',
      name: 'statusOlsr',
      resolve: {
        connection: ['session', session => session.currentConnect.catch(() => false)],
      },
      url: '/status/olsr',
    });
  })
  .component('statusOlsr', {
    controller: class StatusOlsrCtrl {
      constructor($q, router) {
        'ngInject';

        this.$q = $q;
        this.router = router;
        this.refresh();
      }

      refresh() {
        if (this.refreshing) return this.$q.reject(new Error('already refreshing'));
        this.refreshing = true;
        this.error = undefined;
        return this.router.getOlsrLinks().then(
          (data) => {
            this.refreshing = false;
            this.links = data.links;
          },
          (data) => {
            this.refreshing = false;
            this.error = data;
          },
        );
      }
    },
    template: require('./status-olsr.html'),
  });
