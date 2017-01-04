import { copy, module } from 'angular';

export default module('app.components.wizard-internet', [])
  .component('wizardInternet', {
    bindings: {
      internet: '<',
      onUpdate: '&',
    },
    // TODO: handle vpn
    controller: class WizardContactCtrl {
      constructor($scope) {
        'ngInject';

        this.newInternet = {};

        $scope.$watch('$ctrl.internet', this.updateFromInput.bind(this), true);
        $scope.$watch('$ctrl.newInternet', this.updateOutput.bind(this), true);
      }

      updateFromInput(internet) {
        copy(internet, this.newInternet);
      }

      updateOutput(newInternet) {
        let internet = copy(newInternet);
        if (!internet.share) {
          internet = {};
        }
        if (!internet.speedLimit) {
          delete internet.speedLimit;
          delete internet.speedLimitDown;
          delete internet.speedLimitUp;
        }
        this.onUpdate({internet});
      }
    },
    template: require('./wizard-internet.html'),
  });
