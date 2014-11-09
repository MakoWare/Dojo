'use strict';

angular.module('dojo', [
    'navigation',
    'globalService',
    'parseService',
    'multi-select',
    'ui.bootstrap',
    'google-maps',
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
//Admin
      .when('/admin', {
        templateUrl: 'partials/admin.html',
        controller: 'AdminCtrl'
      })
//Configurations
      .when('/configurations', {
        templateUrl: 'partials/configurations.html',
        controller: 'ConfigCtrl'
      })
//Ipad Configurations
      .when('/configurations/ipad', {
        templateUrl: 'partials/ipadConfigurations.html',
        controller: 'IpadConfigCtrl'
      })
//Contact
      .when('/contact', {
        templateUrl: 'partials/contact.html',
        controller: 'ContactCtrl'
      })
//Dispatches
      .when('/dispatches', {
        templateUrl: 'partials/read.html',
        controller: 'ReadCtrl'
      })
      .when('/dispatches/:id', {
        templateUrl: 'partials/update.html',
        controller: 'CreateCtrl'
      })
//Documentation
      .when('/documentation', {
        templateUrl: 'partials/documentation.html',
        controller: 'DocumentationCtrl'
      })
//Facilities
      .when('/facilities', {
        templateUrl: 'partials/read.html',
        controller: 'ReadCtrl'
      })
      .when('/facilities/:id', {
        templateUrl: 'partials/update.html',
        controller: 'CreateCtrl'
      })
//Files
      .when('/files', {
        templateUrl: 'partials/read.html',
        controller: 'ReadCtrl'
      })
      .when('/files/:id', {
        templateUrl: 'partials/update.html',
        controller: 'CreateCtrl'
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
        templateUrl: 'partials/nemsis/nemsisCreate.html',
        controller: 'NemsisCreateCtrl'
      })
//Patients
      .when('/patients', {
        templateUrl: 'partials/read.html',
        controller: 'ReadCtrl'
      })
      .when('/patients/:id', {
        templateUrl: 'partials/update.html',
        controller: 'CreateCtrl'
      })
//PCRs
      .when('/pcrs', {
        templateUrl: 'partials/read.html',
        controller: 'ReadCtrl'
      })
      .when('/pcrs/:id', {
        templateUrl: 'partials/update.html',
        controller: 'CreateCtrl'
      })
//Users
      .when('/users', {
        templateUrl: 'partials/read.html',
        controller: 'ReadCtrl'
      })
      .when('/users/:id', {
        templateUrl: 'partials/update.html',
        controller: 'CreateCtrl'
      })
//Vehicles
      .when('/vehicles', {
        templateUrl: 'partials/read.html',
        controller: 'ReadCtrl'
      })
      .when('/vehicles/:id', {
        templateUrl: 'partials/update.html',
        controller: 'CreateCtrl'
      })
//Otherwise
      .otherwise({
        redirectTo: '/'
      });
  });
