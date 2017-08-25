var PushListController = function PushListController($scope, $state, sHttp, sEnum, sCache) {
  this.name = 'push_list';
  var id = 'push_list';

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
    sHttp.list('push/list', offset, max, $scope.search).then(function (data) {
      $scope.listData = data;
      _.forEach($scope.listData.list, function (item) {
        sEnum.getSendStatusValue(item.status).then(function (data) {
          item.statusNm = data;
        });
      });
    })
  }

  $scope._onPageChanged = function () {
    getList();
  };

  $scope._go = function (where) {
    sCache.put(id, "paging", $scope.paging);
    $state.go('push_send', { itemNo: where })
  }
}

PushListController.$inject = ['$scope', '$state', 'sHttp', 'sEnum', 'sCache'];

module.exports = PushListController;
