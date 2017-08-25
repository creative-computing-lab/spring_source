var template = require('./push_list.html');
var controller = require('./push_list.controller');
//require ('./user_list.css');

var PushListComponent = function () {
  return {
    restrict: 'A',
    template:template,
    controller:controller
  };
};

module.exports = PushListComponent;
