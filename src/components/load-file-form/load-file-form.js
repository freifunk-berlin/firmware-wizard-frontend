import {copy, module} from 'angular';

export default module('app.components.load-file-form', [])
  .component('loadFileForm', {
    bindings: {
      details: '<',
      onUpdate: '&',
      fileContent: '<',
      idPrefix: '@',
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
    template: require('./load-file-form.html'),
    transclude: true,
  });
