import { module } from 'angular';
import uiRouter from '@uirouter/angularjs';

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
        return this.$q.all([this.router.getOlsrNeighbors(), this.router.getOlsrLinks()]).then(
          (data) => {
            this.refreshing = false;
            this.neighbors = data[0].neighbors;
            this.links = data[1].links;
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
