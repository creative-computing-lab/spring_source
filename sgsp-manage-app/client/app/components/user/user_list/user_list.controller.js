var UserListController = function UserListController($scope, $state, sHttp, sCache) {
  this.name = 'user_list';
  var id = 'user_list';

  $scope.paging = {};
  $scope.paging.index = 1;
  $scope.paging.count = 0;
  $scope.paging.max = 10;

  $scope.listData = null;

  // resume
  $scope.$on('xResume', function(event, menu) {
    if(id==menu) {
      $scope.search = sCache.get(id, "search", $scope.search);
      $scope.paging = sCache.get(id, "paging", $scope.paging);
      getList();
    }
  });

  function getList() {
    var offset = ($scope.paging.index-1)*$scope.paging.max;
    var max = $scope.paging.max;
    sHttp.list('user/list', offset, max, $scope.search).then(function(data) {
      $scope.listData = data;
    })
  }

  $scope._onPageChanged = function() {
    getList();
  };
}

UserListController.$inject = ['$scope', '$state', 'sHttp', 'sCache'];

module.exports = UserListController;
