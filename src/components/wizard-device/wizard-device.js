import { copy, module } from 'angular';

export default module('app.components.wizard-device', [])
  .component('wizardDevice', {
    bindings: {
      onUpdate: '&',
    },
    controller: class WizardDeviceCtrl {
      constructor($scope, router, session) {
        'ngInject';

        this.router = router;
        this.session = session;

        this.newModel = {};

        $scope.$watch('$ctrl.session.connection', this.updateFromSession.bind(this), true);
        $scope.$watch('$ctrl.newModel', this.updateOutput.bind(this), true);
      }

      updateFromSession(connection) {
        if (connection) {
          this.router.getNetworkWireless().then(data => console.log(data));
        }
      }

      updateOutput(newModel) {
        let model = copy(newModel);
        this.onUpdate({model});
      }
    },
    template: require('./wizard-device.html'),
  });
