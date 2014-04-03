'use strict';

/* Controllers */

angular.module('ccfs14.controllers', [])
  .controller('geocity', function($scope, $window, fileService) {

    $scope.bikemiUrl = "data/bikemi.json";
    $scope.districtUrl = "data/district.json";
    $scope.maskUrl = "data/mask.json";
    $scope.bikemiJson;
    $scope.districtJson;
    $scope.maskJson;

    fileService.getFile($scope.districtUrl).then(
        function(data){
          $scope.districtJson = data;
          $scope.getMask()
        },
        function(error){

        }
      );

    $scope.getBikemi = function(){
      fileService.getFile($scope.bikemiUrl).then(
        function(data){
          $scope.bikemiJson = data;
        },
        function(error){

        }
      );
    }

    $scope.getMask = function(){
      fileService.getFile($scope.maskUrl).then(
        function(data){
          $scope.maskJson = data;
          $scope.getBikemi()
        },
        function(error){

        }
      );
    }

    $scope.date = new Date();
    
    $scope.info = {
      title: "citysensing",
      city: "Milano"
    }

    $scope.months = ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"]

    $scope.areas = [
      {name: "Brera Design District", cells : [5858, 5859, 5860, 5861, 5758, 5759, 5760, 5761, 5658, 5659, 5660, 5661, 5558, 5559, 5560, 5561, 5458, 5459, 5460, 5461, 5358, 5359, 5360, 5361, 5258, 5259, 5260, 5261]},
      {name: "Zona Tortona", cells : [4749, 4750, 4751, 4752, 4753, 4649, 4650, 4651, 4652, 4653, 4549, 4550, 4551, 4552, 4553, 4449, 4450, 4451, 4452, 4453]},
      {name: "Lambrate Ventura", cells : [6176, 6177, 6178, 6179, 6180, 6076, 6077, 6078, 6079, 6080, 5976, 5977, 5978, 5979, 5980, 5876, 5877, 5878, 5879, 5880]},
      {name: "Porta Romana", cells : [4661, 4662, 4663, 4664, 4665, 4666, 4667, 4668, 4561, 4562, 4563, 4564, 4565, 4566, 4567, 4568, 4461, 4462, 4463, 4464, 4465, 4466, 4467, 4468, 4361, 4362, 4363, 4364, 4365, 4366, 4367, 4368]},
    ]

  })
  .controller('geodistrict', function($scope, $window, $routeParams, fileService) {

    $scope.bikemiUrl = "data/bikemi.json";
    $scope.districtUrl = "data/district.json";
    $scope.maskUrl = "data/mask.json";
    $scope.bikemiJson;
    $scope.districtJson;
    $scope.maskJson;

    $scope.info = {
      title: "citysensing",
      city: "Milano",
      districtId: $routeParams.district,
      district: $routeParams.district.replace("_", " ")
    }

    fileService.getFile($scope.districtUrl).then(
        function(data){
          var cells = $scope.areas[$scope.info.districtId]
          data.features = data.features.filter(function(d){
            if(cells.indexOf(d.properties.id) > -1)
              return true
            else
              return false
          })
          $scope.districtJson = data;
          $scope.getMask()
        },
        function(error){

        }
      );

    $scope.getBikemi = function(){
      fileService.getFile($scope.bikemiUrl).then(
        function(data){
          $scope.bikemiJson = data;
        },
        function(error){

        }
      );
    }

    $scope.getMask = function(){
      fileService.getFile($scope.maskUrl).then(
        function(data){
          data.features = data.features.filter(function(d){
            return d.properties.id == $scope.info.districtId
          })
          $scope.maskJson = data;
          $scope.getBikemi()
        },
        function(error){

        }
      );
    }

    $scope.date = new Date();
  

    $scope.months = ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"]

    $scope.areas = {
      "brera" : [5858, 5859, 5860, 5861, 5758, 5759, 5760, 5761, 5658, 5659, 5660, 5661, 5558, 5559, 5560, 5561, 5458, 5459, 5460, 5461, 5358, 5359, 5360, 5361, 5258, 5259, 5260, 5261],
      "tortona" : [4749, 4750, 4751, 4752, 4753, 4649, 4650, 4651, 4652, 4653, 4549, 4550, 4551, 4552, 4553, 4449, 4450, 4451, 4452, 4453],
      "lambrate" : [6176, 6177, 6178, 6179, 6180, 6076, 6077, 6078, 6079, 6080, 5976, 5977, 5978, 5979, 5980, 5876, 5877, 5878, 5879, 5880],
      "porta_romana" : [4661, 4662, 4663, 4664, 4665, 4666, 4667, 4668, 4561, 4562, 4563, 4564, 4565, 4566, 4567, 4568, 4461, 4462, 4463, 4464, 4465, 4466, 4467, 4468, 4361, 4362, 4363, 4364, 4365, 4366, 4367, 4368]
    }

  });