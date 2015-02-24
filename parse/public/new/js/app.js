'use strict';

angular.module('dojo', [
    'navigation',
    'sidebar',
    'componentheader',
    'footer',
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
//Agency
      .when('/agencies', {
        templateUrl: 'partials/agencies/agencyList.html',
        controller: 'ReadCtrl'
      })
      .when('/agencies/:id', {
        templateUrl: 'partials/agencies/agency.html',
        controller: 'AgencyCtrl'
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
        controller: 'ContactInfoCtrl'
      })
//Contacts
      .when('/contacts', {
          templateUrl: 'partials/read.html',
          controller: 'ReadCtrl'
      })
      .when('/contacts/:id', {
          templateUrl: 'partials/contacts/contact.html',
          controller: 'ContactCtrl'
      })
//Dispatches
      .when('/dispatches', {
        templateUrl: 'partials/read.html',
        controller: 'ReadCtrl'
      })
      .when('/dispatches/:id', {
        templateUrl: 'partials/dispatches/dispatch.html',
        controller: 'DispatchCtrl'
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
        templateUrl: 'partials/facilities/facility.html',
        controller: 'FacilityCtrl'
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
//Default
      .when('/', {
        templateUrl: 'components/dashboard/dashboard.html',
        controller: 'DashBoardCtrl'
      })
//Map
      .when('/map', {
        templateUrl: 'partials/map.html',
        controller: 'MapCtrl'
      })
//Patients
      .when('/patients', {
        templateUrl: 'partials/read.html',
        controller: 'ReadCtrl'
      })
      .when('/patients/:id', {
        templateUrl: 'partials/patients/patient.html',
        controller: 'PatientCtrl'
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
        templateUrl: 'partials/users/user.html',
        controller: 'UserCtrl'
      })
//Vehicles
      .when('/vehicles', {
        templateUrl: 'partials/read.html',
        controller: 'ReadCtrl'
      })
      .when('/vehicles/:id', {
        templateUrl: 'partials/vehicles/vehicle.html',
        controller: 'VehicleCtrl'
      })
//Otherwise
      .otherwise({
        redirectTo: '/'
      });
  });
