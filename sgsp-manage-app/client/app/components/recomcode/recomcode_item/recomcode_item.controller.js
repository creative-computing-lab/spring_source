var RecomcodeItemController = function RecomcodeItemController($scope, $state, $stateParams, sHttp, sToast, sEnum) {
  this.name = 'recomcode_item';
  var id = 'recomcode_item';

  $scope.form = {};
  $scope.editerOpen = false;
  $scope.isNew = false;
  if ($state.is('recomcode_item_new')) {
    $scope.editerOpen = true;
    $scope.isNew = true;
  } else if ($state.is('recomcode_item')) {
    getItem();
  }

  // read
  function getItem() {
    sHttp.get('recommCode/item/', { 'seq': $stateParams.itemNo }).then(function (data) {
      $scope.form = data;
    }, function (reason) {
      sToast.error("읽는 중 실패 : " + reason.msg);
    });
  }

  $scope._edit = function () {
    $scope.editerOpen = true;
  }

  $scope._cancel = function () {
    if ($scope.isNew || $scope.editerOpen == false) {
      $state.go("recomcode_list", null, { 'location': 'replace' });
    } else {
      $scope.editerOpen = false;
    }
  }

  var busy = false;

  // update
  $scope._update = function () {
    if (busy) { return; }
    $scope.inputForm.$setSubmitted();
    if (!$scope.inputForm.$invalid) {
      busy = true;

      var url = "";
      if ($scope.isNew) {
        url = 'recommCode/create';
      } else {
        url = (_.template('recommCode/update/${seq}'))({ 'seq': $stateParams.itemNo });
      }

      var req = sHttp.post(url, $scope.form, 'application/json');
      req.then(function (data) {
        busy = false;
        //sToast.success(data);
        $state.go("recomcode_list", null, { 'location': 'replace' });
      }, function (data) {
        busy = false;
        sToast.error(data.msg);
      })
    }
  }

  $scope._remove = function () {
    if (confirm("삭제하시겠습니까?")) {

      var url = (_.template('recommCode/remove/${seq}'))({ 'seq': $stateParams.itemNo });
      sHttp.post(url).then(function (data) {
        sToast.success("삭제하였습니다.");
        $state.go("recomcode_list", null, { 'location': 'replace' });
      }, function (data) {
        sToast.error("삭제 중 문제발생하였습니다.: " + data);
      })
    }
  };

}

RecomcodeItemController.$inject = ['$scope', '$state', '$stateParams', 'sHttp', 'sToast', 'sEnum'];

module.exports = RecomcodeItemController;
