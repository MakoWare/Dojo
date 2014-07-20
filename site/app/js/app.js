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
      .when('/configurations/nemsis/dAgency/add', {
        templateUrl: 'partials/nemsis/nemsisCreate.html',
        controller: 'NemsisCreateCtrl'
      })
      .when('/configurations/nemsis/dConfiguration/add', {
        templateUrl: 'partials/nemsis/nemsisCreate.html',
        controller: 'NemsisCreateCtrl'
      })
      .when('/configurations/nemsis/dContact/add', {
        templateUrl: 'partials/nemsis/nemsisCreate.html',
        controller: 'NemsisCreateCtrl'
      })
      .when('/configurations/nemsis/dCustomConfiguration/add', {
        templateUrl: 'partials/nemsis/nemsisCreate.html',
        controller: 'NemsisCreateCtrl'
      })
      .when('/configurations/nemsis/dCustomResults/add', {
        templateUrl: 'partials/nemsis/nemsisCreate.html',
        controller: 'NemsisCreateCtrl'
      })
      .when('/configurations/nemsis/dDevice/add', {
        templateUrl: 'partials/nemsis/nemsisCreate.html',
        controller: 'NemsisCreateCtrl'
      })
      .when('/configurations/nemsis/dFacility/add', {
        templateUrl: 'partials/nemsis/nemsisCreate.html',
        controller: 'NemsisCreateCtrl'
      })
      .when('/configurations/nemsis/dLocation/add', {
        templateUrl: 'partials/nemsis/nemsisCreate.html',
        controller: 'NemsisCreateCtrl'
      })
      .when('/configurations/nemsis/dPersonnel/add', {
        templateUrl: 'partials/nemsis/nemsisCreate.html',
        controller: 'NemsisCreateCtrl'
      })
      .when('/configurations/nemsis/dState/add', {
        templateUrl: 'partials/nemsis/nemsisCreate.html',
        controller: 'NemsisCreateCtrl'
      })
      .when('/configurations/nemsis/dVehicle/add', {
        templateUrl: 'partials/nemsis/nemsisCreate.html',
        controller: 'NemsisCreateCtrl'
      })
//Nemsis Read
      .when('/configurations/nemsis/dAgency', {
        templateUrl: 'partials/nemsis/nemsisRead.html',
        controller: 'NemsisReadCtrl'
      })
      .when('/configurations/nemsis/dConfiguration', {
        templateUrl: 'partials/nemsis/nemsisRead.html',
        controller: 'NemsisReadCtrl'
      })
      .when('/configurations/nemsis/dContact', {
        templateUrl: 'partials/nemsis/nemsisRead.html',
        controller: 'NemsisReadCtrl'
      })
      .when('/configurations/nemsis/dCustomConfiguration', {
        templateUrl: 'partials/nemsis/nemsisRead.html',
        controller: 'NemsisReadCtrl'
      })
      .when('/configurations/nemsis/dCustomResults', {
        templateUrl: 'partials/nemsis/nemsisRead.html',
        controller: 'NemsisReadCtrl'
      })
      .when('/configurations/nemsis/dDevice', {
        templateUrl: 'partials/nemsis/nemsisRead.html',
        controller: 'NemsisReadCtrl'
      })
      .when('/configurations/nemsis/dFacility', {
        templateUrl: 'partials/nemsis/nemsisRead.html',
        controller: 'NemsisReadCtrl'
      })
      .when('/configurations/nemsis/dLocation', {
        templateUrl: 'partials/nemsis/nemsisRead.html',
        controller: 'NemsisReadCtrl'
      })
      .when('/configurations/nemsis/dPersonnel', {
        templateUrl: 'partials/nemsis/nemsisRead.html',
        controller: 'NemsisReadCtrl'
      })
      .when('/configurations/nemsis/dState', {
        templateUrl: 'partials/nemsis/nemsisRead.html',
        controller: 'NemsisReadCtrl'
      })
      .when('/configurations/nemsis/dVehicle', {
        templateUrl: 'partials/nemsis/nemsisRead.html',
        controller: 'NemsisReadCtrl'
      })
//Nemsis Update
      .when('/configurations/nemsis/dAgency/:id', {
        templateUrl: 'partials/nemsis/nemsisUpdate.html',
        controller: 'NemsisUpdateCtrl'
      })
      .when('/configurations/nemsis/dConfiguration/:id', {
        templateUrl: 'partials/nemsis/nemsisUpdate.html',
        controller: 'NemsisUpdateCtrl'
      })
      .when('/configurations/nemsis/dContact/:id', {
        templateUrl: 'partials/nemsis/nemsisUpdate.html',
        controller: 'NemsisUpdateCtrl'
      })
      .when('/configurations/nemsis/dCustomConfiguration/:id', {
        templateUrl: 'partials/nemsis/nemsisUpdate.html',
        controller: 'NemsisUpdateCtrl'
      })
      .when('/configurations/nemsis/dCustomResults/:id', {
        templateUrl: 'partials/nemsis/nemsisUpdate.html',
        controller: 'NemsisUpdateCtrl'
      })
      .when('/configurations/nemsis/dDevice/:id', {
        templateUrl: 'partials/nemsis/nemsisUpdate.html',
        controller: 'NemsisUpdateCtrl'
      })
      .when('/configurations/nemsis/dFacility/:id', {
        templateUrl: 'partials/nemsis/nemsisUpdate.html',
        controller: 'NemsisUpdateCtrl'
      })
      .when('/configurations/nemsis/dLocation/:id', {
        templateUrl: 'partials/nemsis/nemsisUpdate.html',
        controller: 'NemsisUpdateCtrl'
      })
      .when('/configurations/nemsis/dPersonnel/:id', {
        templateUrl: 'partials/nemsis/nemsisUpdate.html',
        controller: 'NemsisUpdateCtrl'
      })
      .when('/configurations/nemsis/dState/:id', {
        templateUrl: 'partials/nemsis/nemsisUpdate.html',
        controller: 'NemsisUpdateCtrl'
      })
      .when('/configurations/nemsis/dVehicle/:id', {
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
