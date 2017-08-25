var angular = require("angular");
var uiRouter = require("angular-ui-router");
var PushSendComponent = require("./push_send.component");

var PushSendModule = angular.module('push_send', [
  uiRouter
])

.config(function($stateProvider) {
  $stateProvider
    .state('push_send_new', {
      url: '/push/send/new',
      parent: 'list_root',
      template: '<div push_send></div>'
    })
    .state('push_send', {
      url: '/push/send/:itemNo',
      parent: 'list_root',
      template: '<div push_send></div>'
    });
})

.directive('pushSend', PushSendComponent);

module.exports = PushSendModule;
