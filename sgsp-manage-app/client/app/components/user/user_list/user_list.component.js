var template = require('./user_list.html');
var controller = require('./user_list.controller');
//require ('./user_list.css');

var UserListComponent = function () {
  return {
    restrict: 'A',
    template:template,
    controller:controller
  };
};

module.exports = UserListComponent;
