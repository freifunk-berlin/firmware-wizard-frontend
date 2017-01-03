import { module } from 'angular';

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
            '$ctrl.password',
            '$ctrl.passwordVerify',
            '$ctrl.sshkeysEnabled',
            '$ctrl.sshkeys',
          ],
          this.updateRouterOutput.bind(this)
        );
      }

      updateRouterOutput() {
        const router = {
          name: this.name,
          password: this.password === this.passwordVerify ? this.password : undefined,
          sshkeys: this.sshkeysEnabled ? this.sshkeys : undefined,
        };
        this.onRouterUpdate({router});
      }
    },
    template: require('./wizard-router.html'),
  });
