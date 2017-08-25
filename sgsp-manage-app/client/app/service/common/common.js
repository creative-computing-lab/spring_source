var angular = require("angular");
var CommonDirective = require("./common.directive");
var CommonFilter = require("./common.filter");

var CommonModule = angular.module('common', [])
.directive('currency', CommonDirective.currency)
.directive('numbersOnly', CommonDirective.numbersOnly)
.directive('equal', CommonDirective.equal)
.filter('formatDate', CommonFilter.formatDate)
;

module.exports = CommonModule;
