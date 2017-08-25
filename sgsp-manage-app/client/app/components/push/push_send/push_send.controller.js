var PushSendController = function PushSendController($scope, $state, $stateParams, sHttp, sEnum, sToast) {
  this.name = 'push_send';
  var id = 'push_send';

  $scope.form = {};
  $scope.editerOpen = false;
  $scope.isNew = false;

  if ($state.is('push_send_new')) {
    $scope.editerOpen = true;
    $scope.isNew = true;
  } else if ($state.is('push_send')) {
    getItem($stateParams.itemNo );
  }

  sEnum.getPushMessageType().then(function (data) {
    $scope.pushMessageTypeCode = data;
    if ($scope.form.pushMessageType == undefined) {
      $scope.form.pushMessageType = $scope.pushMessageTypeCode[0].key;
    }
  });

  sEnum.getToType().then(function (data) {
    $scope.toTypeCode = data;
    if ($scope.form.toType == undefined) {
      $scope.form.toType = $scope.toTypeCode[0].key;
    }
  })

  // read
  function getItem(itemNo) {
    sHttp.get('push/item', { 'seq': itemNo}).then(function (data) {
      $scope.form = data;
      sEnum.getSendStatusValue(data.status).then(function (data) {
        $scope.statusNm = data;
      });

      sEnum.getToTypeValue(data.toType).then(function (data) {
        $scope.toTypeNm = data;
      });
    }, function (reason) {
      sToast.error("읽는 중 실패 : " + reason.msg);
    });
  }

  $scope._edit = function () {
    $scope.editerOpen = true;
  }

  $scope._cancel = function () {
    if ($scope.isNew || $scope.editerOpen == false) {
      $state.go("push_list", null, { 'location': 'replace' });
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
        url = 'push/create';
      } else {
        url = (_.template('push/update/${seq}'))({ 'seq': $stateParams.itemNo });
      }

      var req = sHttp.post(url, $scope.form, 'application/json');
      req.then(function (data) {
        busy = false;
        //sToast.success(data);
        if($scope.isNew) {
          sToast.success("메시지 작성하여 대상을 조회 중입니다. [새로 고침] 해주세요.");
          $state.go('push_send', { itemNo: data.seq }, { 'location': 'replace' })
        } else {
          $state.go("push_list", null, { 'location': 'replace' });
        }
      }, function (data) {
        busy = false;
        sToast.error(data.msg);
      })
    }
  }

  $scope._remove = function () {
    if (confirm("삭제하시겠습니까?")) {

      var url = (_.template('push/remove/${seq}'))({ 'seq': $stateParams.itemNo });
      sHttp.post(url).then(function (data) {
        sToast.success("삭제하였습니다.");
        $state.go("push_list", null, { 'location': 'replace' });
      }, function (data) {
        sToast.error("삭제 중 문제발생하였습니다.: " + data);
      })
    }
  };
  $scope._send = function () {
    if (confirm("전송 요청 하시겠습니까?")) {
      var url = (_.template('push/send/${seq}'))({ 'seq': $stateParams.itemNo });
      sHttp.post(url).then(function (data) {
        getItem($stateParams.itemNo );
        sToast.success("전송요청하였습니다.");
      }, function (data) {
        sToast.error("전송요청 중 문제발생하였습니다.: " + data);
      })
    }
  };
  $scope._cancelSend = function () {
    if (confirm("전송 취소 요청 하시겠습니까?")) {
      var url = (_.template('push/cancelSend/${seq}'))({ 'seq': $stateParams.itemNo });
      sHttp.post(url).then(function (data) {
        getItem($stateParams.itemNo );
        sToast.success("전송 취소 요청하였습니다.");
      }, function (data) {
        sToast.error("전송요청 중 문제발생하였습니다.: " + data);
      })
    }
  };


  $scope._test_put_device = function () {
    var params = {
      'deviceId': 'test_deviceId', 'token': 'test_token', 'isAgreeSend' : true
    }
    sHttp.post('push/putDevice', params, 'application/json').then(function (data) {
      sToast.success("test ok1");

    var params = {
      'deviceId': 'test_deviceId'
    }
      sHttp.post('push/updateDevice', params, 'application/json').then(function (data) {
        sToast.success("test ok2");


      }, function (data) {
      })

    }, function (data) {
    })
  }
}

PushSendController.$inject = ['$scope', '$state', '$stateParams', 'sHttp', 'sEnum', 'sToast'];

module.exports = PushSendController;
