'use strict';

/* Controllers */

angular.module('ccfs14.controllers', [])
  .controller('geocity', function($scope, $window, fileService, ccfsSocket, district, mask, stacked, biketimeline, biketimelineFilter, callsocialtimeline, callsocialtimelineFilter) {

    $scope.date = 1365580799000;
    
    $scope.info = {
      title: "citysensing",
      city: "Milano"
    }

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

    console.log(new Date(1365580799000), new Date($scope.calltimeline[0].values[0].date), new Date($scope.socialtimeline[0].values[0].date), new Date($scope.biketimeline[0].values[0].date))

  })
  .controller('geodistrict', function($scope, $window, $routeParams, fileService, district, mask, stacked, districtCellFilter, districtMaskFilter) {

    $scope.date = new Date();
    
    $scope.info = {
      title: "citysensing",
      city: "Milano",
      districtId: $routeParams.district,
      district: $routeParams.district.replace("_", " ")
    }

    $scope.bikemiUrl = "data/bikemi.json";
    $scope.bikemiJson;
    $scope.districtJson = districtCellFilter($scope.info.districtId, district)
    $scope.maskJson = districtMaskFilter($scope.info.districtId, mask)

  
  });
