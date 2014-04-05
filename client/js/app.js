'use strict';


// Declare app level module which depends on filters, and services
angular.module('ccfs14', [
  'ngRoute',
  'ngAnimate',
  'ui.bootstrap',
  'ccfs14.filters',
  'ccfs14.services',
  'ccfs14.directives',
  'ccfs14.controllers',
  'btford.socket-io'
  ]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/geocity', {
  	templateUrl: 'partials/geocity.html', 
  	controller: 'geocity', 
  	resolve: {
      district : function (fileService) {
        return fileService.getFile('data/district.json')
      },
      mask : function (fileService) {
        return fileService.getFile('data/mask.json')
      },
      biketimeline : function (fileService) {
        return fileService.getFile('data/biketimeline.json')
      },
      callsocialtimeline : function (fileService) {
        return fileService.getFile('data/callsocialtimeline.json')
      }
    }
  });
  $routeProvider.when('/geodistrict/:district', {
    templateUrl: 'partials/geodistrict.html', 
    controller: 'geodistrict',
    resolve: {
      district : function (fileService) {
        return fileService.getFile('data/district.json')
      },
      mask : function (fileService) {
        return fileService.getFile('data/mask.json')
      }, 
      callsocialtimeline : function ($route, fileService) {
        var district = $route.current.params.district;
        return fileService.getFile('data/' + district + '/callsocialtimeline.json')
      }
    }
  });
  $routeProvider.when('/usernet', {
  	templateUrl: 'partials/usernet.html', 
  	controller: 'usernet'
  });
   $routeProvider.when('/netdistrict/:district', {
  	templateUrl: 'partials/netdistrict.html', 
  	controller: 'netdistrict'
  });
  $routeProvider.otherwise({redirectTo: '/geocity'});
}]);
