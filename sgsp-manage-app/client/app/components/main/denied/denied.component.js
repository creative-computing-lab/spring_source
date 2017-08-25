var template = require('./denied.html');
var controller = require('./denied.controller');

var DeniedComponent = function () {
  return {
    restrict: 'A',
    template:template,
    controller:controller
  };
};

module.exports = DeniedComponent;
