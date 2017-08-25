var angular = require("angular");
var ngFileUpload = require("ng-file-upload");
var HttpFactory = require("./http.factory");

var httpModule = angular.module('http', ['ngFileUpload'])

.factory('sHttp', HttpFactory);

module.exports = httpModule;
