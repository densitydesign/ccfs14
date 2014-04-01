'use strict';

/* Directives */


angular.module('ccfs14.directives', [])
  .directive('mapContainer',[ 'fileService', '$timeout', function (fileService, $timeout){
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'partials/mapcontainer.html',
      link: function(scope, element, attrs) {

        var width = element.width(),
            height = element.height(),
            projection = d3.geo.mercator(),
                          //.center([9.1916, 45.4640])
                          //.scale((15 << 18) / 2 / Math.PI)
                          //.scale(709265)
                          //.translate([width / 2, height / 2]);
            path = d3.geo.path().projection(projection)

        var map = ccfs.map()
                    .width(width)
                    .height(height)
                    .projection(projection)

        //var chartMap = d3.select(element[0]).call(map)

        var bikemi = ccfs.bikemi()
                    .width(width)
                    .height(height)
                    .projection(projection)

        var chartBikemi = d3.select(element[0])

        var district = ccfs.district()
                    .width(width)
                    .height(height)
                    .projection(projection)

        var chartDistrict = d3.select(element[0])

        var mask = ccfs.mask()
                    .width(width)
                    .height(height)
                    .projection(projection)

        var chartMask = d3.select(element[0])

        scope.$watch('bikemiJson', function(newValue, oldValue){
          if(newValue != oldValue){
            chartBikemi.datum(scope.bikemiJson).call(bikemi.projection(projection));
          }
        })

        scope.$watch('districtJson', function(newValue, oldValue){
          if(newValue != oldValue){
            var b = path.bounds(scope.districtJson),
                s = 100 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
                t = [width/ 2, height / 2];
            
            projection.scale(s).translate(t).center([9.1916, 45.4640])
            d3.select(element[0]).call(map.projection(projection))
            chartDistrict.datum(scope.districtJson).call(district.projection(projection));
          }
        })

        scope.$watch('maskJson', function(newValue, oldValue){
          if(newValue != oldValue){
            chartMask.datum(scope.maskJson).call(mask.projection(projection));
          }
        })

      }
    }
  }])
  .directive('timelineContainer',[ 'fileService', '$timeout', function (fileService, $timeout){
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'partials/timelinecontainer.html',
      link: function(scope, element, attrs) {

      }
    }
  }])
  .directive('infoContainer',[ 'fileService', '$timeout', function (fileService, $timeout){
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'partials/infocontainer.html',
      link: function(scope, element, attrs) {
        var container = element.find('.content')[0]

        d3.select(container).append('h2')
          .text(scope.info.title.toUpperCase())

        d3.select(container).append('p')
          .text(scope.date)

        d3.select(container).append('p')
          .text(scope.info.city)

      }
    }
  }])
