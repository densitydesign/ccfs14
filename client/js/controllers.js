'use strict';

/* Controllers */

angular.module('ccfs14.controllers', [])
  .controller('geocity', function($scope, $window, fileService, ccfsSocket, district, mask, stacked) {

    $scope.date = new Date();
    
    $scope.info = {
      title: "citysensing",
      city: "Milano"
    }

    $scope.bikemiUrl = "data/bikemi.json";
    $scope.bikemiJson;
    $scope.districtJson = district;
    $scope.maskJson = mask;

    ccfsSocket.on('twitter', function(data) {
      $scope.tweetJson = data
    });

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

  
  })
  .controller('usernet', function($scope, $window, $routeParams, fileService, district, mask, stacked, districtCellFilter, districtMaskFilter) {

    //$scope.date = new Date();
    
    $scope.info = {
      title: "citysensing",
      city: "Milano",
    }

    //$scope.bikemiUrl = "data/bikemi.json";
    //$scope.bikemiJson;
    //$scope.districtJson = districtCellFilter($scope.info.districtId, district)
    //$scope.maskJson = districtMaskFilter($scope.info.districtId, mask)

  })
   .controller('netdistrict', function($scope, $window, $routeParams, fileService, district, mask, stacked, districtCellFilter, districtMaskFilter) {

    //$scope.date = new Date();
    
    $scope.info = {
      title: "citysensing",
      city: "Milano",
      districtId: $routeParams.district,
      district: $routeParams.district.replace("_", " ")
    }

    //$scope.bikemiUrl = "data/bikemi.json";
    //$scope.bikemiJson;
    //$scope.districtJson = districtCellFilter($scope.info.districtId, district)
    //$scope.maskJson = districtMaskFilter($scope.info.districtId, mask)

  })
