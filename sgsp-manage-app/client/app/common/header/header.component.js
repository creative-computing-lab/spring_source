var template = require("./header.html");
var controller = require("./header.controller");
require("./header.css");

var headerComponent = function () {
  return {
    restrict: 'A',
    template:template,
    controller:controller,
    replace: true
  };
};

module.exports = headerComponent;
