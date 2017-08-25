var angular = require("angular");
var uiRouter = require("angular-ui-router");
var ChgpwdComponent = require("./chgpwd.component");

var ChgpwdModule = angular.module('chgpwd', [
  uiRouter
])

.config(function($stateProvider) {
  $stateProvider
    .state('chgpwd', {
      url: '/chgpwd',
      parent: 'list_root',
      template: '<div chgpwd></div>'
    });
})

.directive('chgpwd', ChgpwdComponent);

module.exports = ChgpwdModule;
