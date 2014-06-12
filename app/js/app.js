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
      .when('/edit', {
        templateUrl: 'partials/crud.html',
        controller: 'CrudCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
