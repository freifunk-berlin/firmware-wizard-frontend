import { copy, module } from 'angular';

export default module('app.components.wizard-ip', [])
  .component('wizardIp', {
    bindings: {
      wirelessDevices: '<',
      ip: '<',
      onUpdate: '&',
    },
    controller: class WizardIpCtrl {
      constructor($scope) {
        'ngInject';

        this.newIp = {};

        // eslint-disable-next-line no-restricted-properties
        this.pow = Math.pow;

        $scope.$watch('$ctrl.ip', this.updateFromInput.bind(this), true);
        $scope.$watch('$ctrl.newIp', this.updateOutput.bind(this), true);
      }

      updateFromInput(ip) {
        copy(ip, this.newIp);
      }

      updateOutput(newIp) {
        const ip = copy(newIp);
        if (!ip.meshLan && ip.v4) {
          delete ip.v4.lan;
        }
        if (!ip.distribute) {
          delete ip.v4ClientSubnet;
        }
        this.onUpdate({ip});
      }
    },
    template: require('./wizard-ip.html'),
  });
