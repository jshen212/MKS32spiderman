var app = angular.module('app', [
   'mapsApp',
   'signup',
   'ngRoute'
]);

app.controller('cafeListCtrl', function($scope){
  $scope.selected = false;
  $scope.toggleCoffeeShopAppointments = function(){
    $scope.selected = !$scope.selected;
  };
});

app.config(['$routeProvider', function($routeProvider){
  $routeProvider

  .when('/home', {
    templateUrl: 'templates/home.html',
    controller: 'submitCtrl'
  })

  .when('/appointments', {
    templateUrl: 'templates/appointments.html',
    controller: 'submitCtrl'
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
}]);










// *********ui router code (we switched to ng-route to use tokens)*********
// app.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider){
//   $urlRouterProvider.otherwise('/home');
//
//   $stateProvider
//     .state('home', {
//       url: '/home',
//       templateUrl: 'templates/home.html',
//     })
//     .state('appointments', {
//       url: '/appointments',
//       templateUrl: 'templates/appointments.html'
//     })
//     .state('signin', {
//       url: '/signin',
//       templateUrl: 'templates/signin.html',
//       controller: 'submitCtrl'
//     })
//     .state('signup', {
//       url: '/signup',
//       templateUrl: 'templates/signup.html',
//       controller: 'submitCtrl'
//     });
// }]);
