'use strict';

angular.module('dojo', [
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
//Devices
      .when('/devices/add', {
        templateUrl: 'partials/create.html',
        controller: 'CreateCtrl'
      })
      .when('/devices', {
        templateUrl: 'partials/read.html',
        controller: 'ReadCtrl'
      })
      .when('/devices/:id', {
        templateUrl: 'partials/update.html',
        controller: 'UpdateCtrl'
      })
//Dispatches
      .when('/dispatches/add', {
        templateUrl: 'partials/create.html',
        controller: 'CreateCtrl'
      })
      .when('/dispatches', {
        templateUrl: 'partials/read.html',
        controller: 'ReadCtrl'
      })
      .when('/dispatches/:id', {
        templateUrl: 'partials/update.html',
        controller: 'UpdateCtrl'
      })
//Facilities
      .when('/facilities/add', {
        templateUrl: 'partials/create.html',
        controller: 'CreateCtrl'
      })
      .when('/facilities', {
        templateUrl: 'partials/read.html',
        controller: 'ReadCtrl'
      })
      .when('/facilities/:id', {
        templateUrl: 'partials/update.html',
        controller: 'UpdateCtrl'
      })
//Patients
      .when('/patients/add', {
        templateUrl: 'partials/create.html',
        controller: 'CreateCtrl'
      })
      .when('/patients', {
        templateUrl: 'partials/read.html',
        controller: 'ReadCtrl'
      })
      .when('/patients/:id', {
        templateUrl: 'partials/update.html',
        controller: 'UpdateCtrl'
      })
//Users
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
//Vehicles
      .when('/vehicles/add', {
        templateUrl: 'partials/create.html',
        controller: 'CreateCtrl'
      })
      .when('/vehicles', {
        templateUrl: 'partials/read.html',
        controller: 'ReadCtrl'
      })
      .when('/vehicles/:id', {
        templateUrl: 'partials/update.html',
        controller: 'UpdateCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
