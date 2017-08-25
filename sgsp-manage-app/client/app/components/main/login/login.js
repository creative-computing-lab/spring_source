var angular = require("angular");
var uiRouter = require("angular-ui-router");
var loginComponent = require("./login.component");

var loginModule = angular.module('login', [
  uiRouter
])

.config(function($stateProvider) {
  $stateProvider.state('login', {
    url: '/',
    template: '<div login></div>'
  });
})

.directive('login', loginComponent);

module.exports = loginModule;
