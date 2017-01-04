import { module } from 'angular';

require('./navbar.less');

export default module('app.components.navbar', []).component('navbar', {
  controller: class NavbarCtrl {
    constructor($uibModal, session) {
      'ngInject';

      this.$uibModal = $uibModal;
      this.session = session;

      this.collapsed = true;
    }

    showAuthenticateModal() {
      this.$uibModal.open({
        component: 'authenticateModal',
      });
    }

    showConnectModal() {
      this.$uibModal.open({
        component: 'connectModal',
      });
    }
  },
  template: require('./navbar.html'),
});
