var angular = require("angular");
var uiRouter = require("angular-ui-router");
var TestComponent = require("./test.component");

var TestModule = angular.module('test', [
  uiRouter
])

.config(function($stateProvider) {
  $stateProvider
    .state('test', {
      url: '/test',
      parent: 'list_root',
      template: '<div test></div>'
    });
})

.directive('test', TestComponent);

module.exports = TestModule;
