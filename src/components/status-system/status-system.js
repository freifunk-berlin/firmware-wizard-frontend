import { module } from 'angular';
import uiRouter from '@uirouter/angularjs';

require('./status-system.less');

export default module('app.components.status-system', [uiRouter])
  .config(($stateProvider) => {
    'ngInject';

    $stateProvider.state({
      component: 'statusSystem',
      name: 'statusSystem',
      resolve: {
        connection: ['session', session => session.currentConnect.catch(() => false)],
      },
      url: '/status/system',
    });
  })
  .component('statusSystem', {
    controller: class StatusSystemCtrl {
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
        return this.$q.all([this.router.getSystemBoard(), this.router.getSystemInfo()]).then(
          (data) => {
            this.refreshing = false;
            this.board = data[0];
            this.info = data[1];
          },
          (data) => {
            this.refreshing = false;
            this.error = data;
          },
        );
      }
    },
    template: require('./status-system.html'),
  });
