var OpposeItemController = function OpposeItemController($scope, $state, $stateParams, sHttp, sToast, sEnum) {
  this.name = 'oppose_item';
  var id = 'oppose_item';

  $scope.form = {};
  $scope.editerOpen = false;
  $scope.isNew = false;
  if ($state.is('oppose_item_new')) {
    $scope.editerOpen = true;
    $scope.isNew = true;
  } else if ($state.is('oppose_item')) {
    getItem();
  }

  // read
  function getItem() {
    sHttp.get('posts/item/', { 'seq': $stateParams.itemNo }).then(function (data) {
      $scope.form = data[0];
    }, function (reason) {
      sToast.error("읽는 중 실패 : " + reason.msg);
    });
  }

  $scope._edit = function () {
    $scope.editerOpen = true;
  }

  $scope._cancel = function () {
    if ($scope.isNew || $scope.editerOpen == false) {
      $state.go("oppose_list", null, { 'location': 'replace' });
    } else {
      $scope.editerOpen = false;
    }
  }

  var busy = false;

  $scope._remove = function () {
    if (confirm("삭제하시겠습니까?")) {

      var url = (_.template('posts/remove/${seq}'))({ 'seq': $stateParams.itemNo });
      sHttp.post(url).then(function (data) {
        sToast.success("삭제하였습니다.");
        $state.go("oppose_list", null, { 'location': 'replace' });
      }, function (data) {
        sToast.error("삭제 중 문제발생하였습니다.: " + data);
      })
    }
  };

}

OpposeItemController.$inject = ['$scope', '$state', '$stateParams', 'sHttp', 'sToast', 'sEnum'];

module.exports = OpposeItemController;
