import { module } from 'angular';

require('./load-file-button.less');

export default module('app.components.load-file-button', [])
  .component('loadFileButton', {
    bindings: {
      accept: '@',
      onDismiss: '&',
      onLoaded: '&',
    },
    controller: class LoadFileButtonCtrl {
      constructor($element, $scope) {
        'ngInject';
        this.$scope = $scope;
        $element.on('change', this.load.bind(this));
      }

      load(event) {
        if (!event.target.files || event.target.files.length === 0) return;
        const reader = new FileReader();
        reader.onload = event => this.$scope.$apply(() => {
          this.onLoaded({content: event.target.result});
        });
        reader.readAsText(event.target.files[0]);
      }
    },
    template: require('./load-file-button.html'),
    transclude: true,
  });
