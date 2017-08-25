var angular = require("angular");
var uiRouter = require("angular-ui-router");
var OpposeListComponent = require("./oppose_list.component");

var OpposeListModule = angular.module('oppose_list', [
  uiRouter
])

.config(function($stateProvider) {
  $stateProvider
    .state('oppose_list', {
      url: '/oppose/list',
      parent: 'list_root',
      template: '<div oppose_list></div>'
    });
})

.directive('opposeList', OpposeListComponent);

module.exports = OpposeListModule;
