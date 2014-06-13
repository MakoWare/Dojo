'use strict';

angular
  .module('dojo', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'dojoServices'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl'
      })
      .when('/users/add', {
        templateUrl: 'partials/create.html',
        controller: 'CreateCtrl'
      })
      .when('/users', {
        templateUrl: 'partials/read.html',
        controller: 'ReadCtrl'
      })
      .when('/users/:id', {
        templateUrl: 'partials/update.html',
        controller: 'UpdateCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
