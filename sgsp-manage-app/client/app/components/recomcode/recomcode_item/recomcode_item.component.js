var template = require('./recomcode_item.html');
var controller = require('./recomcode_item.controller');
//require ('./recomcode_item.css');

var RecomcodeItemComponent = function () {
  return {
    restrict: 'A',
    template:template,
    controller:controller
  };
};

module.exports = RecomcodeItemComponent;
