var template = require('./<%= name %>.html');
var controller = require('./<%= name %>.controller');
//require ('./<%= name %>.css');

var <%= upCaseName %>Component = function () {
  return {
    restrict: 'A',
    template:template,
    controller:controller
  };
};

module.exports = <%= upCaseName %>Component;
