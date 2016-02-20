angular.module('signup', [])

.controller('submitCtrl', ['$scope', '$http', function ($scope, $http) {

  $scope.addUser = function(){
    console.log('NEW USER', $scope.newUser);
    $http.post('/signup', $scope.newUser).success(function(response){
      console.log('SUCCESSFUL POST TO SERVER');
    });
  };
}]);
