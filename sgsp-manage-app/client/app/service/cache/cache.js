var angular = require("angular");
var cacheFactory = require("./cache.factory");

var cacheModule = angular.module('cache', [])

.factory('sCache', cacheFactory);

module.exports = cacheModule;
