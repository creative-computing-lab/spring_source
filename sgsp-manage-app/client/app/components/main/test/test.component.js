var template = require('./test.html');
var controller = require('./test.controller');

var TestComponent = function () {
  return {
    restrict: 'A',
    template:template,
    controller:controller
  };
};

module.exports = TestComponent;
