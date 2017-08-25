var template = require("./main.html");
var controller = require("./main.controller");

var mainComponent = function () {
  return {
    restrict: 'A',
    template:template,
    controller:controller
  };
};

module.exports = mainComponent;
