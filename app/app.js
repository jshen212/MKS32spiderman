var app = angular.module('app', [
   'mapsApp',
   'signup',
   'ngRoute'
]);

app.controller('cafeListCtrl', ['$scope', '$http', '$window', function($scope, $http, $window){
  $scope.newAppointment = {};

  $scope.selected = false;
  $scope.toggleCoffeeShopAppointments = function(){
    $scope.selected = !$scope.selected;
  };

  $scope.creatingAppointment = false;
  $scope.createNewAppointment = function(){
    if($scope.selected === false){
      $scope.selected = true;
    }
    $scope.creatingAppointment = !$scope.creatingAppointment;
  }

  $scope.addNewAppointment = function(shopId, shop){
    $scope.newAppointment.id = shopId;
    $scope.newAppointment.shop = shop;
    $scope.newAppointment.host_id = $window.localStorage.getItem('com.brewed');
    console.log('++line 26, token: ', $window.localStorage.getItem('com.brewed'));
    // shopId
    // day
    // time
    // host user

    console.log('++newAppointmentId: ', $scope.newAppointment.id);
    console.log('++newAppointment object: ', $scope.newAppointment);

    $http.post('/appointments', $scope.newAppointment).success(function(req, res){
      console.log('sent to server: ', $scope.newAppointment);
    });
  }

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
