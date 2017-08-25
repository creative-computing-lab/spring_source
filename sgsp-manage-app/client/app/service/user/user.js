var angular = require("angular");
var ngStorage = require("ngstorage");
var UserFactory = require("./user.factory");

var userModule = angular.module('user', [ngStorage.name])

.factory('sUser', UserFactory);

module.exports = userModule;
