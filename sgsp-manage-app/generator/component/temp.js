var angular = require("angular");
var uiRouter = require("angular-ui-router");
var <%= upCaseName %>Component = require("./<%= name %>.component");

var <%= upCaseName %>Module = angular.module('<%= name %>', [
  uiRouter
])

.config(function($stateProvider) {
  $stateProvider
    .state('<%= name %>', {
      url: '/<%= name %>',
      parent: 'list_root',
      template: '<div <%= name %>></div>'
    })
    .state('<%= name %>_new', {  // 순서가 중요
        url: '/<%= name %>/new',
        parent: 'list_root',
        template: '<div <%= name %>></div>'
    })
    .state('<%= name %>', {
      url: '/<%= name %>/:<%= name %>No',
      parent: 'list_root',
      template: '<div <%= name %>></div>'
    });
})

.directive('<%= camelName %>', <%= upCaseName %>Component);

module.exports = <%= upCaseName %>Module;
