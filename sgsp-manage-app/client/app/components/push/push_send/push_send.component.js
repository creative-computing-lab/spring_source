var template = require('./push_send.html');
var controller = require('./push_send.controller');
//require ('./user_list.css');

var PushSendComponent = function () {
  return {
    restrict: 'A',
    template:template,
    controller:controller
  };
};

module.exports = PushSendComponent;
