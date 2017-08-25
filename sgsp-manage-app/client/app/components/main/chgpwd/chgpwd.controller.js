var ChgpwdController = function ChgpwdController($scope, $state, sUser, sHttp, sToast) {
  this.name = 'chgpwd';
  var id = 'chgpwd';

  $scope.name = sUser.getUsername();

  // 로그인
  var busy = false;
  $scope._update = function() {
    if(busy) { return; }
    $scope.inputForm.$setSubmitted();
    if(!$scope.inputForm.$invalid) {
      busy = true;
      var req = sHttp.post('user/updatePwd', $scope.form, 'application/json');
      req.then(function(data) {
        busy = false;
        sToast.success(data.msg);
        $state.go("main", null, { 'location': 'replace' });
      }, function(data) {
        busy = false;
        sToast.error(data.msg);
      })
    }
  }
}

ChgpwdController.$inject = ['$scope', '$state', 'sUser', 'sHttp', 'sToast'];

module.exports = ChgpwdController;
