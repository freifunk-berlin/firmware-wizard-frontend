import { module } from 'angular';

export default module('app.components.connect-modal', [])
  .component('connectModal', {
    bindings: {
      resolve: '<',
      close: '&',
      dismiss: '&',
    },
    controller: class ConnectModalCtrl {
      constructor(session) {
        'ngInject';
        this.session = session;
      }
    },
    template: require('./connect-modal.html'),
  });
