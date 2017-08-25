var angular = require("angular");
var uiRouter = require("angular-ui-router");
var RecomCodeListComponent = require("./recomcode_list.component");

var RecomCodeListModule = angular.module('recomcode_list', [
  uiRouter
])

.config(function($stateProvider) {
  $stateProvider
    .state('recomcode_list', {
      url: '/recomcode/list',
      parent: 'list_root',
      template: '<div recomcode_list></div>'
    });
})

.directive('recomcodeList', RecomCodeListComponent);

module.exports = RecomCodeListModule;
