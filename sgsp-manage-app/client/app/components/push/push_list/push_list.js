var angular = require("angular");
var uiRouter = require("angular-ui-router");
var PushListComponent = require("./push_list.component");

var PushListModule = angular.module('push_list', [
  uiRouter
])

.config(function($stateProvider) {
  $stateProvider
    .state('push_list', {
      url: '/push/list',
      parent: 'list_root',
      template: '<div push_list></div>'
    });
})

.directive('pushList', PushListComponent);

module.exports = PushListModule;
