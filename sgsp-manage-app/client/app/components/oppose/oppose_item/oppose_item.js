var angular = require("angular");
var uiRouter = require("angular-ui-router");
var OpposeItemComponent = require("./oppose_item.component");

var OpposeItemModule = angular.module('oppose_item', [
  uiRouter
])

.config(function($stateProvider) {
  $stateProvider
    .state('oppose_item', {
      url: '/oppose/item/:itemNo',
      parent: 'list_root',
      template: '<div oppose_item></div>'
    });
})

.directive('opposeItem', OpposeItemComponent);

module.exports = OpposeItemModule;
