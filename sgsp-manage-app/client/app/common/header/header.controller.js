var HeaderController = function HeaderController($scope, $state, sUser, sHttp) {
  this.name = 'header';

  updateStatus();

  // 로그인 관련 event를 수신
  _.forEach(['xLoginSuccess', 'xLogoutSuccess', 'xValidateSuccess', 'xValidateError'], function (event){
    $scope.$on(event, function() {
      updateStatus();
    })
  });

  // 로그인 여부에 따른 UI 변경
  updateStatus();
  function updateStatus() {
    $scope.username = sUser.getUsername();
    $scope.isLogin = sUser.isLogin();
  }

  // 로그아웃
  $scope._logout = function() {
    sHttp.logout();
  }
}

HeaderController.$inject = ['$scope', '$state', 'sUser', 'sHttp'];

module.exports = HeaderController;
