angular.module('brew.appts', [])
.controller('ApptCtrl', ['$scope', '$http', '$location', '$window', function ($scope, $http, $location, $window) {

  // authenticates by checking if there is a token
  $scope.isAuth = function(){
    return Boolean($window.localStorage.getItem('com.brewed'));
  };

// clears the hosting appointments and re-invokes appointment filter when host accepts a guest
  $scope.accepted = function(appt, guestEmail){
    $http.post('/acceptAppt', {time: appt.time, email: guestEmail }).success(function(res){
      if(res){
        $scope.hosting = [];
        $scope.filterAppointments();
      }
    });
  };

// clears the hosting appointments and re-invokes appointment filter when host denies a guest
  $scope.denied = function(appt, guestEmail){
    $http.post('/denyAppt', {time: appt.time, email: guestEmail }).success(function(res){
      if(res){
        $scope.hosting = [];
        $scope.filterAppointments();
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

  // fetches all appointments to display on the "appointments" page
  $scope.fetchAllAppointmentsForUser = function (token) {
    $http.get('/fetchAppointmentsDashboardData').success(function(res){
      $scope.allAppointments = res;
    });
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
}]);
