import { copy, module } from 'angular';
import uiRouter from 'angular-ui-router';

export default module('app.components.status-olsr', [uiRouter])
  .config($stateProvider => {
    'ngInject';
    $stateProvider.state({
      component: 'statusOlsr',
      name: 'statusOlsr',
      resolve: {
        connection: ['$q', 'session', ($q, session) => {
          return $q(resolve => session.currentConnect.then(resolve, resolve));
        }],
      },
      url: '/status/olsr',
    });
  })
  .component('statusOlsr', {
    controller: class StatusOlsrCtrl {
      constructor(router) {
        'ngInject';
        this.router = router
        this.refresh();
      }

      refresh() {
        if (this.refreshing) return;
        this.refreshing = true;
        this.error = undefined;
        return this.router.getOlsrLinks().then(
          data => {
            this.refreshing = false;
            this.links = data.links;
          },
          data => {
            this.refreshing = false;
            this.error = data;
          }
        );
      }
    },
    template: require('./status-olsr.html'),
  });
