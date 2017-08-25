var MainController = function MainController($scope, $state, sHttp,sUser,$filter) {
  this.name = 'main';
  var id = 'main';

  $scope.$on('xResume', function(event, menu) {

  });

  $scope.$on("xValidateError", function() {
    console.log("xValidateError");
    $state.go("login", null, {'location':'replace'})
  })


}

MainController.$inject = ['$scope', '$state', 'sHttp', 'sUser' ,'$filter'];

module.exports = MainController;
