import { copy, module } from 'angular';
import { assign, clone } from 'lodash';

export default module('app.components.wizard-internet', [])
  .component('wizardInternet', {
    bindings: {
      internet: '<',
      onUpdate: '&',
    },
    controller: class WizardInternetCtrl {
      constructor($scope) {
        'ngInject';

        this.newInternet = {};

        $scope.$watch('$ctrl.internet', this.updateFromInput.bind(this));
        $scope.$watchCollection('$ctrl.newInternet', this.updateOutput.bind(this));
        ['internetTunnelEnabled', 'meshTunnelEnabled', 'speedLimitEnabled']
          .forEach(property => $scope.$watch(`$ctrl.${property}`, this.updateOutput.bind(this)));
      }

      updateFromInput(internet) {
        this.lastone = internet;
        const newInternet = clone(internet || {});

        if (!newInternet.share) {
          delete newInternet.internetTunnel;
        }

        this.internetTunnelEnabled = newInternet.internetTunnel !== undefined;
        this.meshTunnelEnabled = newInternet.meshTunnel !== undefined;

        if (!newInternet.share && !this.meshTunnelEnabled) {
          delete newInternet.speedLimitDown;
          delete newInternet.speedLimitUp;
        }

        this.speedLimitEnabled =
          newInternet.speedLimitDown !== undefined ||
          newInternet.speedLimitUp !== undefined;

        copy({}, this.newInternet);
        assign(this.newInternet, newInternet);
      }

      updateOutput() {
        if (!this.newInternet.share && !this.newInternet.meshTunnel) {
          this.onUpdate({internet: undefined});
          return;
        }

        const internet = clone(this.newInternet);

        if (!internet.share) {
          delete internet.share;
        }

        if (!internet.share || !this.internetTunnelEnabled) {
          delete internet.internetTunnel;
        }

        if (!this.meshTunnelEnabled) {
          delete internet.meshTunnel;
        }

        if (!this.speedLimitEnabled) {
          delete internet.speedLimitDown;
          delete internet.speedLimitUp;
        }

        this.onUpdate({internet});
      }
    },
    template: require('./wizard-internet.html'),
  });
