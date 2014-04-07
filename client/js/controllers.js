'use strict';

/* Controllers */

angular.module('ccfs14.controllers', [])
  .controller('geocity', function($scope, $window, $location, fileService, ccfsSocket, district, mask, biketimeline, biketimelineFilter, callsocialtimeline, callsocialtimelineFilter, getPathFilter) {

    $scope.info = {
      title: "citysensing",
      city: "Milano",
      startDate: 1365580799000
    }

    $scope.date = $scope.info.startDate;

    $scope.calltimeline = callsocialtimelineFilter(callsocialtimeline)[0];
    $scope.socialtimeline = callsocialtimelineFilter(callsocialtimeline)[1];
    $scope.biketimeline = biketimelineFilter(biketimeline);
    $scope.districtJson = district;
    $scope.maskJson = mask;

    ccfsSocket.on('twitter', function(data) {
      $scope.date = parseInt(data.time);
      $scope.tweetJson = data
    });

    ccfsSocket.on('stalls', function(data) {
      $scope.bikemiJson = data
    });

    ccfsSocket.on('districts', function(data) {
      $scope.districtJson = data
    });

    $scope.utils = {
      keys : [66,84,76,80,78,77]
    }

    $scope.keyPress = function(e) {
      var key = e.keyCode
      if($scope.utils.keys.indexOf(key) > -1){
        var currentLocation = $location.path();
        $location.path(getPathFilter(key, currentLocation))
      }
    };

  })
  .controller('geodistrict', function($scope, $window, $location, $routeParams, fileService, ccfsSocket, mask, district, districtCellFilter, districtMaskFilter, callsocialtimeline, callsocialtimelineFilter, getPathFilter, venues, districtVenuesFilter) {

    $scope.info = {
      title: "citysensing",
      city: "Milano",
      districtId: $routeParams.district,
      district: $routeParams.district.replace("_", " "),
      startDate: 1365580799000
    }
    
    $scope.date = $scope.info.startDate;
    $scope.socialtimeline = callsocialtimelineFilter(callsocialtimeline)[1];
    $scope.districtJson = districtCellFilter($scope.info.districtId, district)
    $scope.maskJson = districtMaskFilter($scope.info.districtId, mask)
    $scope.venuesJson = districtVenuesFilter(venues)

    ccfsSocket.on('twitter', function(data) {
      $scope.date = parseInt(data.time);
      $scope.tweetJson = districtCellFilter($scope.info.districtId, data)
    });

    ccfsSocket.on('stalls', function(data) {
      $scope.bikemiJson = data
    });

    ccfsSocket.on('districts', function(data) {
      $scope.districtJson = districtCellFilter($scope.info.districtId, data)
    });

    $scope.utils = {
      keys : [66,84,76,80,78,77]
    }

    $scope.keyPress = function(e) {
      var key = e.keyCode
      if($scope.utils.keys.indexOf(key) > -1){
        var currentLocation = $location.path();
        $location.path(getPathFilter(key, currentLocation))
      }
    };
  
  })
  .controller('usernet', function($scope, $window, $location, $routeParams, fileService, ccfsSocket, getPathFilter) {

    $scope.date = new Date();
    
    $scope.info = {
      title: "citysensing",
      city: "Milano",
    }
    
    ccfsSocket.on('net-general', function(data) {
      $scope.date = parseInt(data.time);
      $scope.netJson = data
    });

    $scope.utils = {
      keys : [66,84,76,80,78,77]
    }

    $scope.keyPress = function(e) {
      var key = e.keyCode
      if($scope.utils.keys.indexOf(key) > -1){
        var currentLocation = $location.path();
        $location.path(getPathFilter(key, currentLocation))
      }
    };

  })
   .controller('netdistrict', function($scope, $window, $location, $routeParams, fileService, ccfsSocket, getPathFilter) {

    $scope.date = new Date();
    
    $scope.info = {
      title: "citysensing",
      city: "Milano",
      districtId: $routeParams.district,
      district: $routeParams.district.replace("_", " ")
    }

    ccfsSocket.on('net-'+$scope.info.district, function(data) {
      $scope.date = parseInt(data.time);
      $scope.netJson = data
    });

    $scope.utils = {
      keys : [66,84,76,80,78,77]
    }

    $scope.keyPress = function(e) {
      var key = e.keyCode
      if($scope.utils.keys.indexOf(key) > -1){
        var currentLocation = $location.path();
        $location.path(getPathFilter(key, currentLocation))
      }
    };

  })
