var angular = require("angular");
var Header = require("./header/header");
var SideMenu = require("./side_menu/side_menu");

var commonModule = angular.module('app.common', [
  Header.name,
  SideMenu.name
]);

module.exports = commonModule;
