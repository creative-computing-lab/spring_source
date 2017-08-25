var template = require('./mood_list.html');
var controller = require('./mood_list.controller');
//require ('./mood_list.css');

var MoodListComponent = function () {
  return {
    restrict: 'A',
    template:template,
    controller:controller
  };
};

module.exports = MoodListComponent;
