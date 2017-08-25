var Side_menuController = function Side_menuController($scope) {
  this.name = 'side_menu';
 /* $scope.$on('$stateChangeSuccess', function(event) {
    $scope.sideMenu = sMenu.getGroupMenu();
  });*/
}

Side_menuController.$inject = ['$scope'];

module.exports = Side_menuController;
