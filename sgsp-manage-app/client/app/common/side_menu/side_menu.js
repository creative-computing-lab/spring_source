var angular = require("angular");
var side_menuComponent = require("./side_menu.component");

var side_menuModule = angular.module('side_menu', [])

.directive('sideMenu', side_menuComponent);

module.exports = side_menuModule;
