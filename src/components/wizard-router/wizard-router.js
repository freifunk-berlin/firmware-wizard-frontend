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
        $scope.$watchCollection('$ctrl.router', this.updateFromInput.bind(this));
        $scope.$watchGroup(
          [
            '$ctrl.name',
            '$ctrl.passwordHash',
            '$ctrl.sshkeysEnabled',
            '$ctrl.sshkeys',
          ],
          this.updateRouterOutput.bind(this)
        );
        // update passwordHash
        $scope.$watchGroup(
          ['$ctrl.password', '$ctrl.passwordVerify', '$ctrl.router.passwordHash'],
          this.updatePasswordHash.bind(this)
        );
      }

      updatePasswordHash() {
        if (this.password !== this.passwordVerify) {
          this.passwordHashed = undefined;
          this.passwordHash = undefined;
          return;
        }
        if (!this.password) {
          this.passwordHashed = undefined;
          this.passwordHash = this.router && this.router.passwordHash;
          return;
        }
        // don't hash again to prevent endless digest loops
        if (this.password === this.passwordHashed) return;
        this.passwordHashed = this.password;
        this.passwordHash = crypt(this.password);

      }

      updateFromInput(router) {
        if (!router) return;
        this.name = router.name;
        this.passwordHash = router.passwordHash;
        this.sshkeys = router.sshkeys;
        this.sshkeysEnabled = router.sshkeys !== undefined;
      }

      updateRouterOutput() {
        const router = {
          name: this.name,
          passwordHash: this.passwordHash,
          sshkeys: this.sshkeysEnabled ? this.sshkeys : undefined,
        };
        this.onRouterUpdate({router});
      }
    },
    template: require('./wizard-router.html'),
  });
