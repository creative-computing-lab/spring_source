var angular = require("angular");
var EnumFactory = require("./enum.factory");

var enumModule = angular.module('enum', [])

.factory('sEnum', EnumFactory);

module.exports = enumModule;
