var <%= upCaseName %>Controller = function <%= upCaseName %>Controller($scope) {
  this.name = '<%= name %>';
  var id = '<%= name %>';
}

<%= upCaseName %>Controller.$inject = ['$scope'];

module.exports = <%= upCaseName %>Controller;
