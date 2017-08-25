var template = require("./login.html");
var controller = require("./login.controller");
require("./login.css")

var loginComponent = function () {
  return {
    restrict: 'A',
    template:template,
    controller:controller
  };
};

module.exports = loginComponent;
