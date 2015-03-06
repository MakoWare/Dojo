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
    'dojo.LocationModel',
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
      .when('/dashboard', {
        templateUrl: 'components/axis/axis.html',
        controller: AxisCtrl
      })
//Login
      .when('/', {
        templateUrl: 'components/login/login.html',
        controller: LoginCtrl
      })
      .otherwise({
        redirectTo: '/'
      });
  });
