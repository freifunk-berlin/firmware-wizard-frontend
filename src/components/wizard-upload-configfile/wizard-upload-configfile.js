import {copy, fromJson, module} from 'angular';

export default module('app.components.wizard-upload-configfile', [])
  .component('wizardUploadConfigfile', {
    bindings: {
      detailsString: '@',
      onUpdate: '&',
      fileContent: '<',
    },
    controller: class WizardTunnelCtrl {
      constructor($scope) {
        'ngInject';

        this.success = false;
        this.$scope = $scope;
        this.$ctrl = $scope.$ctrl;

        $scope.$watch('$ctrl.fileContent', this.updateFromInput.bind(this));
        $scope.$watch('$ctrl.newFileContent', this.updateOutput.bind(this));
      }

      $onInit() {
        this.details = fromJson(this.$ctrl.detailsString);
      }

      updateFromInput(value) {
        this.success = false;
        this.newFileContent = value;
        if (this.newFileContent) {
          this.success = true;
        }
      }

      updateOutput(newFileContent) {
        const fileContent = copy(newFileContent);
        this.onUpdate({fileContent});
      }

      uploadContent(content) {
        this.newFileContent = content;
        this.success = true;
      }

    },
    template: require('./wizard-upload-configfile.html'),
    transclude: true,
  });
