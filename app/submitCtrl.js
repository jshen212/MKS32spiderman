angular.module('signup', [])

.controller('submitCtrl', ['$scope', '$http', '$location', '$window', function ($scope, $http, $location, $window) {

  // $scope.allAppointments;

  $scope.isAuth = function(){
    return Boolean($window.localStorage.getItem('com.brewed'));
  };

  $scope.addUser = function(){
    $http.post('/signup', $scope.newUser).success(function(response){
      $location.path('/signin');
    });

  };

  $scope.signin = function(){
    $http.post('/signin', $scope.user).success(function(response){

      // if a token comes back, redirect to home
      if(response){
        $window.localStorage.setItem('com.brewed', response);
        $location.path('/home');
      }

      // if no token, redirect to signin
      else {
        $location.path('/signin');
      }
    });
  };

  $scope.navigateToAppointmentsDashboard = function(){
    $http.post('/appointments', $scope.token).success(function(response){
      if($scope.isAuth()){
        $location.path('/appointments');
      }
      else {
        $location.path('/signin');
      }
    });
  };

  $scope.filterAppointments = function(){
    var token = $window.localStorage.getItem('com.brewed');
    $http.post('/filterAppointments', {token: token}).success(function(res){
      console.log('youre in filterAppointments function!!', res)
      $scope.confirmed = res.confirmed;
      $scope.hosting = res.hosting;
      $scope.requested = res.requested;
    });
  }

  $scope.fetchAllAppointmentsForUser = function (token) {
    $http.get('/fetchAppointmentsDashboardData').success(function(res){
      $scope.allAppointments = res;

      console.log($scope.allAppointments);
    });

  }

  $scope.signout = function(){
    $window.localStorage.removeItem('com.brewed');
    $location.path('/home');
  };

}]);
