var MoodListController = function MoodListController($scope, $state, sHttp, sCache, $q) {
  this.name = 'mood_list';
  var id = 'mood_list';

  $scope.paging = {};
  $scope.paging.index = 1;
  $scope.paging.count = 0;
  $scope.paging.max = 10;

  $scope.listData = null;

  $scope.search = {};

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
    sHttp.list('mood/list', offset, max, $scope.search).then(function (data) {
      $scope.listData = data;
    })
  }

  $scope._onPageChanged = function () {
    getList();
  };



  // export
  $scope._getArray = function () {
    var deferred = $q.defer();

    var result = [];
    var offset = 0;
    var max = 100;
    var total = -1;

    fetch();

    // 내부 함수를 통해 -> total에 도달할때 까지 paging하여 조회하여 붙임
    function fetch() {
      if (total != -1 && total <= result.length) {
        deferred.resolve(result);
      } else {
        sHttp.list('mood/list', offset, max, $scope.search).then(function (data) {
          total = data.total;
          _.forEach(data.list, function (item) {
            result.push(item);
          })
          offset += data.count;

          fetch();
        })
      }
    }

    return deferred.promise;
  }

  $scope._getHeader = function () {
    return ["#", "감정 값",	"생성일", "글 제목", "사용자 ID", "채택된 댓글", "도움준 상담자"];
  }

  // search
  $scope._search = function () {
    $scope.paging.index = 1;
    getList();
  };

  $scope._toKeyword = function (ownerName) {
    $scope.search.ownerName = ownerName;
    $scope._search();
  }
}


MoodListController.$inject = ['$scope', '$state', 'sHttp', 'sCache', '$q'];

module.exports = MoodListController;
