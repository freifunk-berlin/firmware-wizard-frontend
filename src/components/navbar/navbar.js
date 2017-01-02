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

    showConnectModal() {
      this.$uibModal.open({
        component: 'connectModal',
      });
    }
  },
  template: require('./navbar.html'),
});
