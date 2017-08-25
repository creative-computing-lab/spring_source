var template = require('./oppose_item.html');
var controller = require('./oppose_item.controller');
//require ('./user_list.css');

var OpposeItemComponent = function () {
  return {
    restrict: 'A',
    template:template,
    controller:controller
  };
};

module.exports = OpposeItemComponent;
