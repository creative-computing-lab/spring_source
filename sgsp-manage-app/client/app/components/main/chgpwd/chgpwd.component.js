var template = require('./chgpwd.html');
var controller = require('./chgpwd.controller');
//require ('./chgpwd.css');

var ChgpwdComponent = function () {
  return {
    restrict: 'A',
    template:template,
    controller:controller
  };
};

module.exports = ChgpwdComponent;
