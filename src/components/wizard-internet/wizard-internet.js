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

        this.$scope = $scope;

        this.newInternet = {};

        $scope.$watch('$ctrl.internet', this.updateFromInput.bind(this));
        $scope.$watch('$ctrl.internetTunnelEnabled', this.updateInternetTunnel.bind(this));
        $scope.$watch('$ctrl.meshTunnelEnabled', this.updateMeshTunnel.bind(this));
        $scope.$watch('$ctrl.speedLimitEnabled', this.updateSpeedLimit.bind(this));
        $scope.$watchCollection('$ctrl.newInternet', this.updateOutput.bind(this));
      }

      updateFromInput(internet) {
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
          (this.$scope.internetForm.limitDown && !this.$scope.internetForm.limitDown.$pristine) ||
          (this.$scope.internetForm.limitUp && !this.$scope.internetForm.limitUp.$pristine) ||
          newInternet.speedLimitDown !== undefined ||
          newInternet.speedLimitUp !== undefined;

        copy({}, this.newInternet);
        assign(this.newInternet, newInternet);
      }

      updateInternetTunnel(enabled) {
        if (!enabled) delete this.newInternet.internetTunnel;
        if (enabled && !this.newInternet.internetTunnel) this.newInternet.internetTunnel = {};
      }

      updateMeshTunnel(enabled) {
        if (!enabled) delete this.newInternet.meshTunnel;
        if (enabled && !this.newInternet.meshTunnel) this.newInternet.meshTunnel = {};
      }

      updateSpeedLimit(enabled) {
        if (!enabled) {
          delete this.newInternet.speedLimitDown;
          delete this.newInternet.speedLimitUp;
        }
      }

      updateOutput() {
        if (!this.newInternet.share && !this.newInternet.meshTunnel) {
          this.onUpdate({internet: undefined});
          return;
        }

        const internet = clone(this.newInternet);

        if (!internet.share) {
          delete internet.share;
          delete internet.internetTunnel;
        }

        this.onUpdate({internet});
      }
    },
    template: require('./wizard-internet.html'),
  });
