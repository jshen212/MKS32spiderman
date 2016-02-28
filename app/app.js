angular.module('brew', [
  'brew.auth',
  'brew.appts',
  'brew.map',
  'brew.cafelist',
  'ngRoute',
  'ngAnimate',
  'ui.bootstrap.datetimepicker'
])

.config(['$routeProvider', '$httpProvider', function($routeProvider){
  $routeProvider

  .when('/home', {
    templateUrl: 'app/mapCafe/home.html',
    controller: 'AuthCtrl'
  })

  .when('/appointments', {
    templateUrl: 'app/appointments/appointments.html',
    controller: 'ApptCtrl',
    authenticate: true
  })

  .when('/signin', {
    templateUrl: 'app/auth/signin.html',
    controller: 'AuthCtrl'
  })

  .when('/signup', {
    templateUrl: 'app/auth/signup.html',
    controller: 'AuthCtrl'
  })

  .otherwise({
    redirectTo: '/home'
  });
}])

// authenticates by checking if the user has a sign in token
.factory('Auth', function ($http, $location, $window) {
  var isAuth = function () {
    return Boolean($window.localStorage.getItem('com.brewed'));
  };

  return {
    isAuth: isAuth,
  };
})

// if user is not signed in, he/she will be redirected to the signin page if he/she tries to access restricted areas
.run(function ($rootScope, $location, Auth) {
  $rootScope.$on('$routeChangeStart', function (evt, next, current) {
    if (next.$$route && next.$$route.authenticate && !Auth.isAuth()) {
      $location.path('/signin');
    }
  });
});
