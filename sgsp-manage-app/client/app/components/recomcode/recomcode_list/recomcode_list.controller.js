var RecomCodeListController = function RecomCodeListController($scope, $state, sHttp, sCache) {
  this.name = 'recomcode_list';
  var id = 'recomcode_list';

  $scope.paging = {};
  $scope.paging.index = 1;
  $scope.paging.count = 0;
  $scope.paging.max = 10;

  $scope.listData = null;

  // resume
  $scope.$on('xResume', function (event, menu) {
    if (id == menu) {
      $scope.search = sCache.get(id, "search", $scope.search);
      $scope.paging = sCache.get(id, "paging", $scope.paging);
      getList();
    }
  });

  function getList() {
    var offset = ($scope.paging.index - 1) * $scope.paging.max;
    var max = $scope.paging.max;
    sHttp.list('recommCode/list', offset, max, $scope.search).then(function (data) {
      $scope.listData = data;
    })
  }

  $scope._onPageChanged = function () {
    getList();
  };

  $scope._go = function (where) {
    sCache.put(id, "paging", $scope.paging);
    $state.go('recomcode_item', { itemNo: where })
  }

}

RecomCodeListController.$inject = ['$scope', '$state', 'sHttp', 'sCache'];

module.exports = RecomCodeListController;
