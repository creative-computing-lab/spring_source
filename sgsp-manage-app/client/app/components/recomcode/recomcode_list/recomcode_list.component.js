var template = require('./recomcode_list.html');
var controller = require('./recomcode_list.controller');
//require ('./user_list.css');

var RecomCodeListComponent = function () {
  return {
    restrict: 'A',
    template:template,
    controller:controller
  };
};

module.exports = RecomCodeListComponent;
