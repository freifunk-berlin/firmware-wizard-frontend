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
        this.url = this.session.connection && this.session.connection.apiUrl;
      }

      submit() {
        this.connecting = true;
        this.error = undefined;
        this.session.connect(this.url).then(
          () => {
            this.connecting = false;
            this.close();
          },
          (data) => {
            this.connecting = false;
            this.error = data;
          },
        );
      }
    },
    template: require('./connect-modal.html'),
  });
