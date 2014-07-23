'use strict';

angular.module('dojo', [
    'globalService',
    'parseService',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
//Configurations
      .when('/configurations', {
        templateUrl: 'partials/configurations.html',
        controller: 'CreateCtrl'
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
//Login
      .when('/', {
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl'
      })
//Map
      .when('/map', {
        templateUrl: 'partials/map.html',
        controller: 'MapCtrl'
      })
//Nemsis Create
      .when('/configurations/nemsis/:sectionName/add', {
        templateUrl: 'partials/nemsis/nemsisCreate.html',
        controller: 'NemsisCreateCtrl'
      })
//Nemsis Read
      .when('/configurations/nemsis/:sectionName', {
        templateUrl: 'partials/nemsis/nemsisRead.html',
        controller: 'NemsisReadCtrl'
      })
//Nemsis Update
      .when('/configurations/nemsis/:sectionName/:id', {
        templateUrl: 'partials/nemsis/nemsisUpdate.html',
        controller: 'NemsisUpdateCtrl'
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
//Otherwise
      .otherwise({
        redirectTo: '/'
      });
  });
