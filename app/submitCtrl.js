angular.module('signup', [])

.controller('submitCtrl', ['$scope', '$http', '$state', function ($scope, $http, $state) {

  $scope.addUser = function(){
    console.log('NEW USER', $scope.newUser);
    $http.post('/signup', $scope.newUser).success(function(response){
      console.log('SUCCESSFUL POST TO SERVER');
      $state.go('signin');
    });
  };

  $scope.signin = function(){
    console.log('signing in');
    $http.post('/signin', $scope.user).success(function(response){
      console.log('successful SIGN IN');
      $state.go('home');
    });
  };

  $scope.signup = function(){
    console.log('signing up');
    $http.post('/signup', $scope.newUser).success(function(response){
      console.log('FINISHED SIGNING UP');
      $state.go('home');
    });
  };



}]);
``
