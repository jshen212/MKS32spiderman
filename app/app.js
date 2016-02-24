var app = angular.module('app', [
   'mapsApp',
   'signup',
   'ngRoute'
]);

app.controller('cafeListCtrl', ['$scope', '$http', '$window', '$location', function($scope, $http, $window, $location){
  $scope.newAppointment = {};
  // $scope.appointmentList;

  $scope.selected = false;
  $scope.toggleCoffeeShopAppointments = function(shopId){
    $scope.selected = !$scope.selected;
    console.log(shopId);
    // query db for all appointments with matching id
    $scope.appointmentList = [];
    $http.post('/getAppointments', { id: shopId }).success(function(res){
      console.log('__line17 response from server = ', res);
      $scope.appointmentList = res;
      console.log($scope.appointmentList);
    });

  };

  $scope.creatingAppointment = false;
  $scope.createNewAppointment = function(){
    if($scope.selected === false){
      $scope.selected = true;
    }
    $scope.creatingAppointment = !$scope.creatingAppointment;
  }

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
      console.log('++line 26, token: ', $window.localStorage.getItem('com.brewed'));
      // shopId
      // day
      // time
      // host user
      console.log('++newAppointmentId: ', $scope.newAppointment.id);
      console.log('++newAppointment object: ', $scope.newAppointment);

      $http.post('/createAppointment', $scope.newAppointment).success(function(req, res){
        console.log('sent to server: ', $scope.newAppointment);
      });
    }
  };
}]);

app.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider){
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
    return !!$window.localStorage.getItem('com.brewed');
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
