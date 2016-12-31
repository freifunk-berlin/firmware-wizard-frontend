import { module } from 'angular';

export default module('app.components.language-dropdown', [])
  .component('languageDropdown', {
    controller: class LanguageDropdownCtrl {
      constructor($scope, $translate) {
        'ngInject';
        this.selectedLanguage = $translate.proposedLanguage() || $translate.use();
        $scope.$watch('$ctrl.selectedLanguage', language => $translate.use(language));
      }
    },
    template: require('./language-dropdown.html'),
  });
