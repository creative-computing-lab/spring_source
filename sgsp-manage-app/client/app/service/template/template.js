var angular = require("angular");
var templateFactory = require("./template.factory");

var templateModule = angular.module('template', [])

.run(templateFactory);

module.exports = templateModule;
