var template = require("./app.html");
require("./app.css");

var appComponent = function() {
  return {
    restrict: 'A',
    template:template
  };
};

module.exports = appComponent;
