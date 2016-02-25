var app = angular.module('app', [
  'mapsApp',
  'signup',
  'ngRoute'
]);

app.controller('cafeListCtrl', ['$scope', '$http', '$window', '$location', function($scope, $http, $window, $location){
  $scope.newAppointment = {};

  $scope.selected = false;
  $scope.toggleCoffeeShopAppointments = function(shopId){
    $scope.selected = !$scope.selected;
    $scope.appointmentList = [];
    $http.post('/getAppointments', { id: shopId }).success(function(res){
      $scope.appointmentList = res;
    });
  };

  $scope.creatingAppointment = true;
  $scope.createNewAppointment = function(shopId){
    if($scope.selected === false){
      $scope.toggleCoffeeShopAppointments(shopId);
      // $scope.selected = true;
    }
    // $scope.creatingAppointment = !$scope.creatingAppointment;
  };

  $scope.addNewAppointment = function(shopId, shop){
    var hostId = $window.localStorage.getItem('com.brewed');

    if(!hostId){
      $location.path('/signin');
    }

    else {
      $scope.newAppointment.id = shopId;
      $scope.newAppointment.shop = shop;
      $scope.newAppointment.host_id = hostId;
      $scope.newAppointment.guest_id = null;
      $scope.newAppointment.guests = [];
      $scope.newAppointment.appointmentStatus = null;


      $http.post('/createAppointment', $scope.newAppointment).success(function(req, res){
        $scope.newAppointment.firstName = res.firstName;
        $scope.newAppointment.firstName = res.lastName;
        // $scope.toggleCoffeeShopAppointments();
        $http.post('/getAppointments', { id: shopId }).success(function(res){
          $scope.appointmentList = res;
          console.log(res);
        });
      });



    }

  };

// sweetalert pop-up box when joining appointments
  $scope.requestToJoin = function(thisAppointment) {
    var hostId = $window.localStorage.getItem('com.brewed');

    swal({
      title: "Are you sure you want to join this appointment?",
      type: "",
      showCancelButton: true,
      confirmButtonColor: "forestgreen",
      confirmButtonText: "Yes!",
      closeOnConfirm: false
    }, function(){
      console.log('++line76 appointmentList for this cafe: ', $scope.appointmentList);
      swal("Request sent!", "The host of this appointment has recieved your request to join. Check your appointments page to see if they accepted!", "success");
      $http.post('/sendJoinRequest', { token: hostId, appointment: $scope.appointmentList[thisAppointment] }).success(function(req, res){
        console.log('++line 76 app.js: a request should be sent to the server now');
      });
    });
  };
}]);



app.config(['$routeProvider', '$httpProvider', function($routeProvider){
  $routeProvider

  .when('/home', {
    templateUrl: 'templates/home.html',
    controller: 'submitCtrl'
  })

  .when('/appointments', {
    templateUrl: 'templates/appointments.html',
    controller: 'submitCtrl',
    authenticate: true
  })

  .when('/signin', {
    templateUrl: 'templates/signin.html',
    controller: 'submitCtrl'
  })

  .when('/signup', {
    templateUrl: 'templates/signup.html',
    controller: 'submitCtrl'
  })

  .otherwise({
    redirectTo: '/home'
  });
}])

.factory('Auth', function ($http, $location, $window) {
  var isAuth = function () {
    return Boolean($window.localStorage.getItem('com.brewed'));
  };

  return {
    isAuth: isAuth,
  };
})

.run(function ($rootScope, $location, Auth) {
  $rootScope.$on('$routeChangeStart', function (evt, next, current) {
    if (next.$$route && next.$$route.authenticate && !Auth.isAuth()) {
      $location.path('/signin');
    }
  });
});
