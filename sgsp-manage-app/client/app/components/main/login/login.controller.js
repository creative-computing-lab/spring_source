var LoginController = function LoginController($scope, sUser, sHttp, sToast) {
  this.name = 'login';

  // 아이디 저장값
  $scope.save = false;
  var savedId = sUser.getSavedId();
  if(savedId) {
    $scope.id = savedId;
    $scope.save = true;
  }

  // 로그인
  var busy = false;
  $scope.login = function() {
    if(busy) { return; }
    if($scope.id!=null && $scope.password!=null) {
      busy = true;
      sHttp.login($scope.id, $scope.password, $scope.save);
    }
  }

  // 로그인 동작에 따른 이벤트
  $scope.$on('xLoginError', function() {
    busy = false;
    sToast.error("로그인에 실패하였습니다.");
  })

  $scope.$on('xLoginSuccess', function() {
    busy = false;
    sToast.success("로그인에 성공하였습니다.");
  })

  // test
  //$scope.id = "admin@test.com";
  //$scope.password = "1234";
}

LoginController.$inject = ['$scope', 'sUser', 'sHttp', 'sToast'];

module.exports = LoginController;
