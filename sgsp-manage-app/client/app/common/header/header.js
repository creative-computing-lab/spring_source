var angular = require("angular");
require("angular-ui-event");
var headerComponent = require("./header.component");

var headerModule = angular.module('header', ['ui.event'])

.directive('header', headerComponent);

module.exports = headerModule;
