var angular = require("angular");
var uiRouter = require("angular-ui-router");
var DeniedComponent = require("./denied.component");

var DeniedModule = angular.module('denied', [
  uiRouter
])

.config(function($stateProvider) {
  $stateProvider
    .state('denied', {
      url: '/denied',
      template: '<div denied></div>'
    });
})

.directive('denied', DeniedComponent);

module.exports = DeniedModule;
