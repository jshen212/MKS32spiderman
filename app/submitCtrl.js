angular.module('signup', [])

.controller('submitCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {

  $scope.addUser = function(){
    console.log('NEW USER', $scope.newUser);
    $http.post('/signup', $scope.newUser).success(function(response){
      console.log('SUCCESSFUL POST TO SERVER');
      $location.path('/signin');
    });
  };

  $scope.signin = function(){
    console.log('signing in');
    $http.post('/signin', $scope.user).success(function(response){
      console.log('line16++ successful SIGN IN', response);
      if(response){
        $location.path('/home');
      } else {
        $location.path('/signin');
      }
    });
  };

  $scope.signup = function(){
    console.log('signing up');
    $http.post('/signup', $scope.newUser).success(function(response){
      console.log('FINISHED SIGNING UP');
      $location.path('/home');
    });
  };
}]);
