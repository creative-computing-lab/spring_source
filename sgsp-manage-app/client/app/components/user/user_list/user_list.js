var angular = require("angular");
var uiRouter = require("angular-ui-router");
var UserListComponent = require("./user_list.component");

var UserListModule = angular.module('user_list', [
  uiRouter
])

.config(function($stateProvider) {
  $stateProvider
    .state('user_list', {
      url: '/user/list',
      parent: 'list_root',
      template: '<div user_list></div>'
    });
})

.directive('userList', UserListComponent);

module.exports = UserListModule;
