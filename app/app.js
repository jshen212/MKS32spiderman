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
      $httpProvider.interceptors.push('AttachTokens');
}])

.factory('AttachTokens', function ($window) {
  // this is an $httpInterceptor
  // its job is to stop all out going request
  // then look in local storage and find the user's token
  // then add it to the header so the server can validate the request
  var attach = {
    request: function (object) {
      var jwt = $window.localStorage.getItem('com.brewed');
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
})

.factory('Auth', function ($http, $location, $window) {
  var isAuth = function () {
    return !!$window.localStorage.getItem('com.brewed');
  };

  return {
    isAuth: isAuth,
  };
})

.run(function ($rootScope, $location, Auth) {
  // here inside the run phase of angular, our services and controllers
  // have just been registered and our app is ready
  // however, we want to make sure the user is authorized
  // we listen for when angular is trying to change routes
  // when it does change routes, we then look for the token in localstorage
  // and send that token to the server to see if it is a real user or hasn't expired
  // if it's not valid, we then redirect back to signin/signup
  $rootScope.$on('$routeChangeStart', function (evt, next, current) {
    if (next.$$route && next.$$route.authenticate && !Auth.isAuth()) {
      $location.path('/signin');
    }
  });
});

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
