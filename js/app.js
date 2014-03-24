'use strict';


// Declare app level module which depends on filters, and services
angular.module('ccfs14', [
  'ngRoute',
  'ui.bootstrap',
  'ccfs14.filters',
  'ccfs14.services',
  'ccfs14.directives',
  'ccfs14.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/geocity', {templateUrl: 'partials/geocity.html', controller: 'geocity'});
  $routeProvider.when('/geodistrict/:district', {templateUrl: 'partials/geodistrict.html', controller: 'geodistrict'});
  $routeProvider.otherwise({redirectTo: '/geocity'});
}]);
