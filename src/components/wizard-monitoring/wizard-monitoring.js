import { copy, module } from 'angular';

export default module('app.components.wizard-monitoring', [])
  .component('wizardMonitoring', {
    bindings: {
      monitoring: '<',
      onUpdate: '&',
    },
    controller: class WizardMonitoringCtrl {
      constructor($scope) {
        'ngInject';

        this.newMonitoring = {};

        $scope.$watch('$ctrl.monitoring', this.updateFromInput.bind(this), true);
        $scope.$watch('$ctrl.newMonitoring', this.updateOutput.bind(this), true);
      }

      updateFromInput(monitoring) {
        copy(monitoring, this.newMonitoring);
      }

      updateOutput(newMonitoring) {
        let monitoring = copy(newMonitoring);
        if (!monitoring.enabled) {
          monitoring = {};
        }
        this.onUpdate({monitoring});
      }
    },
    template: require('./wizard-monitoring.html'),
  });
