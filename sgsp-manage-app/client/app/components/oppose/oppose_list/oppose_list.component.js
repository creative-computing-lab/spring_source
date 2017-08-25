var template = require('./oppose_list.html');
var controller = require('./oppose_list.controller');
//require ('./user_list.css');

var OpposeListComponent = function () {
  return {
    restrict: 'A',
    template:template,
    controller:controller
  };
};

module.exports = OpposeListComponent;
