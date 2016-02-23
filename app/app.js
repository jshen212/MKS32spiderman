var app = angular.module('app', [
   'mapsApp',
   'signup',
   'ui.router'
]);

app.controller('cafeListCtrl', function($scope){
  $scope.selected = false;
  $scope.toggleCoffeeShopAppointments = function(){
    $scope.selected = !$scope.selected;
  }
});

app.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider){
  $urlRouterProvider.otherwise('/home');

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: 'templates/home.html',
    })
    .state('appointments', {
      url: '/appointments',
      templateUrl: 'templates/appointments.html'
    })
    .state('signin', {
      url: '/signin',
      templateUrl: 'templates/signin.html',
      controller: 'submitCtrl'
    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'templates/signup.html',
      controller: 'submitCtrl'
    });
}]);
