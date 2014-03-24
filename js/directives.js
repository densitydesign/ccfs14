'use strict';

/* Directives */


angular.module('ccfs14.directives', [])
  .directive('mapContainer',[ 'fileService', '$timeout', function (fileService, $timeout){
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'partials/mapcontainer.html',
      link: function(scope, element, attrs) {
        console.log(element.width(), element.height())
        var map = ccfs.map()
                    .width(element.width())
                    .height(element.height())

        var chart = d3.select(element[0]).call(map)
      }
    }
  }])
