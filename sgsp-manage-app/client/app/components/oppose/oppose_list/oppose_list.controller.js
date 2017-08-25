var OpposeListController = function OpposeListController($scope, $state, sHttp, sCache) {
  this.name = 'oppose_list';
  var id = 'oppose_list';

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
    sHttp.list('oppose/list', offset, max, $scope.search).then(function(data) {
      $scope.listData = data;
    })
  }

  $scope._onPageChanged = function() {
    getList();
  };

  $scope._go = function (where) {
    sCache.put(id, "paging", $scope.paging);
    $state.go('oppose_item', { itemNo: where })
  }
}

OpposeListController.$inject = ['$scope', '$state', 'sHttp', 'sCache'];

module.exports = OpposeListController;
