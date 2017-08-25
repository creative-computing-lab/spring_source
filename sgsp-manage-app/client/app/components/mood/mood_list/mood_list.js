var angular = require("angular");
var uiRouter = require("angular-ui-router");
require("ng-csv");
var MoodListComponent = require("./mood_list.component");

var MoodListModule = angular.module('mood_list', [
  uiRouter,
  'ngSanitize',
  'ngCsv'
])

.config(function($stateProvider) {
  $stateProvider
    .state('mood_list', {
      url: '/mood_list',
      parent: 'list_root',
      template: '<div mood_list></div>'
    });
})

.directive('moodList', MoodListComponent);

module.exports = MoodListModule;
