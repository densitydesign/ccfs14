'use strict';

/* Directives */


angular.module('ccfs14.directives', [])
  .directive('mapContainer',[ 'fileService', '$timeout', function (fileService, $timeout){
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'partials/mapcontainer.html',
      link: function(scope, element, attrs) {

        var map = ccfs.map()
                    .width(element.width())
                    .height(element.height())

        var chartMap = d3.select(element[0]).call(map)

        var bikemi = ccfs.bikemi()
                      .width(element.width())
                      .height(element.height())

        var chartBikemi = d3.select(element[0])

        var district = ccfs.district()
              .width(element.width())
              .height(element.height())

        var chartDistrict = d3.select(element[0])

        scope.$watch('bikemiJson', function(newValue, oldValue){
          if(newValue != oldValue){
            chartBikemi.datum(scope.bikemiJson).call(bikemi);
          }
        })

        scope.$watch('districtJson', function(newValue, oldValue){
          if(newValue != oldValue){
            chartDistrict.datum(scope.districtJson).call(district);
          }
        })

      }
    }
  }])
