angular.module('signup', [])
.controller('submitCtrl', ['$scope', '$http', '$location', '$window', function ($scope, $http, $location, $window) {

// authenticates by checking if there is a token
  $scope.isAuth = function(){
    return Boolean($window.localStorage.getItem('com.brewed'));
  };

// post request to server and sends user info taken from the signup page's ng-model
  $scope.addUser = function(){
    $http.post('/signup', $scope.newUser).success(function(response){
      $location.path('/signin');
    });
  };

// post request to server and sends over user info taken from the singin page's ng-model
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

// authenticates if a user is signed in before allowing access to 'appointments' page
  $scope.navigateToAppointmentsDashboard = function(){
      if($scope.isAuth()){
        $location.path('/appointments');
      }
      else {
        $location.path('/signin');
      }
  };

// post request to server and sends the user's token to filter appointments on the server
// controller is just assigning the arrays to their respective $scope variables
  $scope.filterAppointments = function(){
    var token = $window.localStorage.getItem('com.brewed');
    $http.post('/filterAppointments', {token: token}).success(function(res){
      $scope.confirmed = res.confirmed;
      $scope.hosting = res.hosting;
      $scope.requested = res.requested;
    });
  };

  // $scope.filterAppointments();

// fetches all appointments to display on the "appointments" page
  $scope.fetchAllAppointmentsForUser = function (token) {
    $http.get('/fetchAppointmentsDashboardData').success(function(res){
      $scope.allAppointments = res;
    });
  };

// removes token when logout is clicked
  $scope.signout = function(){
    $window.localStorage.removeItem('com.brewed');
    $location.path('/home');
  };
}]);
