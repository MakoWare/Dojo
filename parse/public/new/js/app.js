'use strict';

angular.module('dojo', [
    'navbar',
    'notifications',
    'sidebar',
    'dashboard',
    'footer',
    'componentBox',
    'globalService',
    'parseService',
    'dojo.UserModel',
    'dojo.AgencyModel',
    'dojo.ContactModel',
    'dojo.FacilityModel',
    'dojo.DispatchModel',
    'dojo.PatientModel',
    'dojo.VehicleModel',
    'multi-select',
    'ui.bootstrap',
    'google-maps',
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
//DashBoard
      .when('/dashboard', {
        templateUrl: 'partials/admin.html',
        controller: 'AdminCtrl'
      })
//Login
      .when('/', {
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
