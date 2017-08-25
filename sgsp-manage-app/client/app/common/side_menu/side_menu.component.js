var template = require('./side_menu.html');
var controller = require('./side_menu.controller');

var side_menuComponent = function () {
  return {
    restrict: 'A',
    template:template,
    controller:controller
  };
};

module.exports = side_menuComponent;
