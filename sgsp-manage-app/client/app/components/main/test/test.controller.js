var TestController = function TestController($scope, sHttp) {
  this.name = 'test';
  var id = 'test';


  $scope.goStoreList = function() {
    sHttp.get('store/list');
  };

  $scope.nav = {}
  $scope.nav.southwestLat = 33;
  $scope.nav.northeastLat = 39;
  $scope.nav.southwestLng = 126;
  $scope.nav.northeastLng = 128;
  $scope.goStoreNav = function() {
    sHttp.get('store/nav', $scope.nav);
  };

  $scope.goStoreItem = function() {
    sHttp.get('store/item', $scope.item);
  };

  $scope.timeline = {};
  $scope.goTimelineList = function() {
    sHttp.list('timeline/list', 0, 100, $scope.timeline)
  };
}

TestController.$inject = ['$scope', 'sHttp'];

module.exports = TestController;
