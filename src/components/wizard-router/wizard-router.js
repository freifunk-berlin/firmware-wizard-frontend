import { module } from 'angular';
import { crypt } from 'nano-md5';

export default module('app.components.wizard-router', [])
  .component('wizardRouter', {
    bindings: {
      router: '<',
      onRouterUpdate: '&',
    },
    controller: class WizardRouterCtrl {
      constructor($scope, session) {
        'ngInject';
        this.session = session;
        $scope.$watchGroup(
          [
            '$ctrl.name',
            '$ctrl.newPasswordHash',
            '$ctrl.sshkeysEnabled',
            '$ctrl.sshkeys',
          ],
          this.updateRouterOutput.bind(this)
        );
        $scope.$watchGroup(
          ['$ctrl.password', '$ctrl.passwordVerify'],
          this.updatePasswordHash.bind(this)
        );
      }

      updatePasswordHash() {
        if (this.password !== this.passwordVerify) {
          this.newPasswordHash = undefined;
          return;
        }
        if (!this.password) {
          this.newPasswordHash = this.router && this.router.passwordHash;
          return;
        }
        this.newPasswordHash = crypt(this.password);
      }

      updateRouterOutput() {
        const router = {
          name: this.name,
          passwordHash: this.newPasswordHash,
          sshkeys: this.sshkeysEnabled ? this.sshkeys : undefined,
        };
        this.onRouterUpdate({router});
      }
    },
    template: require('./wizard-router.html'),
  });
