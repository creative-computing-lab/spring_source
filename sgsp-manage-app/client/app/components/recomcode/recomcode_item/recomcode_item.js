var angular = require("angular");
var uiRouter = require("angular-ui-router");
var RecomcodeItemComponent = require("./recomcode_item.component");

var RecomcodeItemModule = angular.module('recomcode_item', [
  uiRouter
])

.config(function($stateProvider) {
  $stateProvider
    .state('recomcode_item_new', {  // 순서가 중요
        url: '/recomcode/item/new',
        parent: 'list_root',
        template: '<div recomcode_item></div>'
    })
    .state('recomcode_item', {
      url: '/recomcode/item/:itemNo',
      parent: 'list_root',
      template: '<div recomcode_item></div>'
    });
})

.directive('recomcodeItem', RecomcodeItemComponent);

module.exports = RecomcodeItemModule;
