import { module } from 'angular';

require('./load-file-button.less');

export default module('app.components.load-file-button', [])
  .component('loadFileButton', {
    bindings: {
      accept: '@',
      base64: '@',
      onDismiss: '&',
      onLoaded: '&',
    },
    controller: class LoadFileButtonCtrl {
      constructor($element, $scope, $window) {
        'ngInject';

        this.$scope = $scope;
        this.$window = $window;
        $element.on('change', this.load.bind(this));
      }

      load(event) {
        if (!event.target.files || event.target.files.length === 0) return;
        const reader = new this.$window.FileReader();
        reader.onload = frEvent => this.$scope.$apply(() => {
          if (this.base64) {
            this.onLoaded({content: frEvent.target.result.split(',')[1]});
          } else {
            this.onLoaded({content: frEvent.target.result});
          }
        });
        if (this.base64) {
          reader.readAsDataURL(event.target.files[0]);
        } else {
          reader.readAsText(event.target.files[0]);
        }
      }

      removeBase64TypeString(contentString) {
        if (this.base64) {
          return contentString.split(',')[1];
        }
        return contentString.result;
      }
    },
    template: require('./load-file-button.html'),
    transclude: true,
  });
