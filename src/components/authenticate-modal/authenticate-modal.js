import { module } from 'angular';

export default module('app.components.authenticate-modal', [])
  .component('authenticateModal', {
    bindings: {
      close: '&',
      dismiss: '&',
    },
    controller: class AuthenticateModalCtrl {
      constructor(session) {
        'ngInject';

        this.session = session;
      }

      submit() {
        this.authenticating = true;
        this.error = undefined;
        this.session.authenticate('root', this.password).then(
          () => {
            this.authenticating = false;
            this.close();
          },
          (data) => {
            this.authenticating = false;
            this.error = data;
          },
        );
      }
    },
    template: require('./authenticate-modal.html'),
  });
