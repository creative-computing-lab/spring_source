var angular = require("angular");
var uiRouter = require("angular-ui-router");
var mainComponent = require('./main.component');

var mainModule = angular.module('main', [
  uiRouter
])

.config(function($stateProvider) {
  $stateProvider.state('main', {
    url: '/main',
    role : 'ROLE_ADMIN',
    parent: 'list_root',
    template: '<div main></div>'
  });
})

.directive('main', mainComponent);

module.exports = mainModule;
