'use strict';

/* Directives */


angular.module('ccfs14.directives', [])
  .directive('mapCity',[ 'fileService', '$timeout', function (fileService, $timeout){
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'partials/mapcontainer.html',
      link: function(scope, element, attrs) {

        var width = element.width(),
            height = element.height(),
            projection = d3.geo.mercator(),
            path = d3.geo.path().projection(projection),
            b = path.bounds(scope.districtJson),
            s = 100 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
            t = [width/ 2, height / 2];

        projection.scale(s).translate(t).center([9.1916, 45.4640])

        var map = ccfs.map()
                    .width(width)
                    .height(height)
                    .projection(projection)

        var chartMap = d3.select(element[0]).call(map)

        var district = ccfs.district()
                    .width(width)
                    .height(height)
                    .projection(projection)

        var chartDistrict = d3.select(element[0])

        chartDistrict.datum(scope.districtJson).call(district)

        var mask = ccfs.mask()
                    .width(width)
                    .height(height)
                    .projection(projection)

        var chartMask = d3.select(element[0])

        chartMask.datum(scope.maskJson).call(mask)

        var tweet = ccfs.tweet()
                    .width(width)
                    .height(height)
                    .projection(projection)

        var chartTweet = d3.select(element[0])

        var bikemi = ccfs.bikemi()
                    .width(width)
                    .height(height)
                    .projection(projection)

        var chartBikemi = d3.select(element[0])

        scope.$watch('bikemiJson', function(newValue, oldValue){
          if(newValue != oldValue){
            chartBikemi.datum(newValue).call(bikemi)
          }
        })

        scope.$watch('tweetJson', function(newValue, oldValue){
          if(newValue != oldValue){
            chartTweet.datum(newValue).call(tweet)
          }
        })

      }
    }
  }])
  .directive('mapDistrict',[ 'fileService', '$timeout', function (fileService, $timeout){
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'partials/mapcontainer.html',
      link: function(scope, element, attrs) {

        var width = element.width(),
            height = element.height(),
            projection = d3.geo.mercator(),
            path = d3.geo.path().projection(projection),
            b = path.bounds(scope.districtJson),
            s = 100 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
            t = [width/ 2, height / 2],
            center = d3.geo.centroid(scope.districtJson);

        projection.scale(s).translate(t).center(center)

        var map = ccfs.map()
                    .width(width)
                    .height(height)
                    .projection(projection)

        var chartMap = d3.select(element[0]).call(map)

        // var bikemi = ccfs.bikemi()
        //             .width(width)
        //             .height(height)
        //             .projection(projection)

        // var chartBikemi = d3.select(element[0])

        var district = ccfs.district()
                    .width(width)
                    .height(height)
                    .projection(projection)

        var chartDistrict = d3.select(element[0])

        chartDistrict.datum(scope.districtJson).call(district.projection(projection))

        var mask = ccfs.mask()
                    .width(width)
                    .height(height)
                    .projection(projection)

        var chartMask = d3.select(element[0])

        chartMask.datum(scope.maskJson).call(mask.projection(projection))

        scope.$watch('bikemiJson', function(newValue, oldValue){
          if(newValue != oldValue){

          }
        })

        scope.$watch('districtJson', function(newValue, oldValue){
          if(newValue != oldValue){

          }
        })

        scope.$watch('maskJson', function(newValue, oldValue){
          if(newValue != oldValue){

          }
        })

      }
    }
  }])
  .directive('timelineCity',[ 'fileService', '$timeout', function (fileService, $timeout){
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'partials/timelinecity.html',
      link: function(scope, element, attrs) {
        fileService.getFile('data/stackedtest.json').then(
            function(data){

              var stackedTweet = ccfs.stackedArea()
                                        .width(element.find("#timeline-tweet").width())
                                        .height(element.find("#timeline-tweet").height())
                                        .stackColors(["#0EA789", "#0EA789"])

              var chartTweet = d3.select(element.find("#timeline-tweet")[0])

              chartTweet.datum(data).call(stackedTweet)

              var stackedCall = ccfs.stackedArea()
                          .width(element.find("#timeline-call").width())
                          .height(element.find("#timeline-call").height())
                          .stackColors(["#fff","#fff"])

              var chartCall = d3.select(element.find("#timeline-call")[0])

              chartCall.datum(data).call(stackedCall)


              $timeout(function() {
                    //chartBike.call(stackedBike.brushDate(1120104000000))
                    chartCall.call(stackedCall.brushDate(1120104000000))
                    chartTweet.call(stackedTweet.brushDate(1120104000000))
              }, 5000);
              
            },
            function(error){

            }
          );

          var stackedBike = ccfs.stackedArea()
                      .width(element.find("#timeline-bike").width())
                      .height(element.find("#timeline-bike").height())
                      .stackColors(["#FFE100","#FFE100"])

          var chartBike = d3.select(element.find("#timeline-bike")[0])

          chartBike.datum(scope.biketimeline).call(stackedBike)
      }
    }
  }])
  .directive('timelineDistrict',[ 'fileService', '$timeout', function (fileService, $timeout){
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'partials/timelinedistrict.html',
      link: function(scope, element, attrs) {
        fileService.getFile('data/stackedtest.json').then(
            function(data){

              var stackedTweet = ccfs.stackedArea()
                                        .width(element.find("#timeline-tweet").width())
                                        .height(element.find("#timeline-tweet").height())
                                        .stackColors(["#0EA789", "#0EA789"])

              var chartTweet = d3.select(element.find("#timeline-tweet")[0])

              chartTweet.datum(data).call(stackedTweet)

              $timeout(function() {
                    chartTweet.call(stackedTweet.brushDate(1120104000000))
              }, 5000);
              
            },
            function(error){

            }
          );
      }
    }
  }])
  .directive('infoContainer',[ 'fileService', '$timeout', 'monthsITFilter', function (fileService, $timeout, monthsIT){
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'partials/infocontainer.html',
      link: function(scope, element, attrs) {
        var container = d3.select(element.find('.content')[0])

        container.append('h2')
          .attr("class", "opacity80")
          .text(scope.info.title.toUpperCase())

        container.append('p')
          .text(scope.date.getDate() + " " + monthsIT(scope.date.getMonth()) + " " + scope.date.getFullYear())

        container.append('h1')
          .html("<span class='opacity80'>h </span>" + (scope.date.getHours()<10?'0':'') + scope.date.getHours() + "<span class='opacity80'>:</span>" + (scope.date.getMinutes()<10?'0':'') + scope.date.getMinutes())

        container.append('span')
          .attr("class", "box")
          .text((scope.info.district || scope.info.city).toUpperCase())

        scope.$watch('date', function(newValue, oldValue){
          if(newValue != oldValue){
            container.select('h1')
              .html("<span class='opacity80'>h </span>" + (newValue.getHours()<10?'0':'') + newValue.getHours() + "<span class='opacity80'>:</span>" + (newValue.getMinutes()<10?'0':'') + newValue.getMinutes())
          }
        })

      }
    }
  }])
