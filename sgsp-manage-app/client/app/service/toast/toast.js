var angular = require("angular");
require("ng-toast/dist/ngToast.css");
require("ng-toast/dist/ngToast-animations.css");
var ngToast = require("ng-toast");
var toastFactory = require("./toast.factory");

var toastModule = angular.module('toast', ['ngToast'])

.factory('sToast', toastFactory);

module.exports = toastModule;
