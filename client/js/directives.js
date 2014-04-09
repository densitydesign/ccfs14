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

        scope.$watch('districtJson', function(newValue, oldValue){
          if(newValue != oldValue){
            chartDistrict.datum(newValue).call(district)
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

        var venues = ccfs.venues()
                    .width(width)
                    .height(height)
                    .projection(projection)

        var chartVenues = d3.select(element[0])

        chartVenues.datum(scope.venuesJson).call(venues.projection(projection))

        var tweet = ccfs.tweet()
                    .width(width)
                    .height(height)
                    .minRadius(5)
                    .maxRadius(50)
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

        scope.$watch('districtJson', function(newValue, oldValue){
          if(newValue != oldValue){
            chartDistrict.datum(newValue).call(district)
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
  .directive('timelineCity',[ 'fileService', '$timeout', function (fileService, $timeout){
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'partials/timelinecity.html',
      link: function(scope, element, attrs) {

          var stackedBike = ccfs.stackedArea()
                      .width(element.find("#timeline-bike").width())
                      .height(element.find("#timeline-bike").height())
                      .stackColors(["#FFE100","#FFE100"])

          var chartBike = d3.select(element.find("#timeline-bike")[0])

          chartBike.datum(scope.biketimeline).call(stackedBike)

          var stackedTweet = ccfs.stackedArea()
                                    .width(element.find("#timeline-tweet").width())
                                    .height(element.find("#timeline-tweet").height())
                                    .stackColors(["#0EA789", "#0EA789"])

          var chartTweet = d3.select(element.find("#timeline-tweet")[0])

          chartTweet.datum(scope.socialtimeline).call(stackedTweet)

          var stackedCall = ccfs.stackedArea()
                      .width(element.find("#timeline-call").width())
                      .height(element.find("#timeline-call").height())
                      .stackColors(["#fff","#fff"])

          var chartCall = d3.select(element.find("#timeline-call")[0])

          chartCall.datum(scope.calltimeline).call(stackedCall)

          scope.$watch('date', function(newValue, oldValue){
            if(newValue != oldValue){

              chartBike.call(stackedBike.brushDate(newValue))
              chartCall.call(stackedCall.brushDate(newValue))
              chartTweet.call(stackedTweet.brushDate(newValue))

            }
          })

      }
    }
  }])
  .directive('timelineDistrict',[ 'fileService', '$timeout', function (fileService, $timeout){
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'partials/timelinedistrict.html',
      link: function(scope, element, attrs) {

            var stackedTweet = ccfs.stackedArea()
                                      .width(element.find("#timeline-tweet").width())
                                      .height(element.find("#timeline-tweet").height())
                                      .stackColors(["#0EA789", "#0EA789"])

            var chartTweet = d3.select(element.find("#timeline-tweet")[0])

            chartTweet.datum(scope.socialtimeline).call(stackedTweet)

            scope.$watch('date', function(newValue, oldValue){
              if(newValue != oldValue){
                chartTweet.call(stackedTweet.brushDate(newValue))
              }
            })
              
      }
    }
  }])
.directive('barchartDistrict',[ 'fileService', '$timeout', function (fileService, $timeout){
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'partials/barcontainer.html',
      link: function(scope, element, attrs) {

            var barVenue = ccfs.barChart()
                              .width(element.find(".content").width())
                              .height(element.find(".content").height())

                                      
            var barVenueCont = d3.select(element.find(".content")[0])

            scope.$watch('venuesTopJson', function(newValue, oldValue){
              if(newValue != oldValue){
                console.log(newValue)
                barVenueCont.datum(newValue.venues).call(barVenue.xMax(newValue.maxValue))
              }
            })
      }
    }
  }])
  .directive('infoContainer',[ 'fileService', '$timeout', 'monthsITFilter', function (fileService, $timeout, monthsIT){
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'partials/infocontainer.html',
      link: function(scope, element, attrs) {
        var container = d3.select(element.find('.content')[0]),
            date = d3.time.minute.round(new Date(scope.date)) //rounded because of ugly intervals

       
        container.append('h2')
          .attr("class", "opacity80")
          .text(scope.info.title.toUpperCase())

        container.append('p')
          .text(date.getDate() + " " + monthsIT(date.getMonth()) + " " + date.getFullYear())

        
        container.append('h1')
          .html("<span class='opacity80'>h </span><span id='time-hours'>" 
                + (date.getHours()<10?'0':'') + date.getHours() + 
                "</span><span class='opacity80'>:</span><span id='time-minutes'>" 
                + (date.getMinutes()<10?'0':'') + date.getMinutes() + 
                "</span>")


        container.append('span')
          .attr("class", "box")
          .text((scope.info.district || scope.info.city).toUpperCase())

        scope.$watch('date', function(newValue, oldValue){
          if(newValue != oldValue){
            var date = d3.time.minute.round(new Date(newValue))
            
            container.select("#time-hours")
              .transition()
              .delay(2000)
              .text(function(d){ return (date.getHours()<10?'0':'') + date.getHours()})

            container.select("#time-minutes")
              .transition()
              .duration(2000)
              .tween("text", function() {
                var val = date.getMinutes() || 59;
                var i = d3.interpolateRound(parseInt(this.textContent), val);
                return function(t) {
                  this.textContent = (i(t)<10?'0':'') + i(t);
                };
              })
              .each("end", function(){
                if(this.textContent == '59')
                  return this.textContent = '00'
              });

          }
        })

      }
    }
  }])

  .directive('netCity',[ 'fileService', '$timeout', 'monthsITFilter', function (fileService, $timeout, monthsIT){
    return {
      restrict: 'A',
      replace: true,
      disableCache: true,
      templateUrl: 'partials/net-container.html',
      link: function(scope, element, attrs) {
        //var container = d3.select(element.find('.content')[0])
                    var network = ccfs.network()
                    .width(element.width())
                    .height(element.height())
                    
					//console.log(element.find("#net-container").width(), element.find("#net-container").height())
					
        var chartNet = d3.select("#net-container")

           scope.$watch('netJson', function(newValue, oldValue){
          if(newValue != oldValue){
            //chartTweet.datum(newValue).call(tweet)
            console.log(newValue)
            chartNet.datum(newValue).call(network)

          }
        })

      }
    }
  }])
  .directive('netDistrict',[ 'fileService', '$timeout', 'monthsITFilter', function (fileService, $timeout, monthsIT){
    return {
      restrict: 'A',
      replace: true,
      disableCache: true,
      templateUrl: 'partials/net-container-dist.html',
      link: function(scope, element, attrs) {
        //var container = d3.select(element.find('.content')[0])
                    var network = ccfs.network()
                    .width(element.width())
                    .height(element.height())
                    
          //console.log(element.find("#net-container").width(), element.find("#net-container").height())
          
        var chartNet = d3.select(element[0])
		console.log(element)
           scope.$watch('netJson', function(newValue, oldValue){
          if(newValue != oldValue){
            
            console.log(newValue, chartNet)
            chartNet.datum(newValue).call(network)

          }
        })

      }
    }
  }])
  .directive('topnet',[ 'fileService', '$timeout', 'monthsITFilter', function (fileService, $timeout, monthsIT){
    return {
      restrict: 'A',
      replace: true,
      disableCache: true,
      templateUrl: 'partials/topvh.html',
      link: function(scope, element, attrs) {
        
           scope.$watch('topJson', function(newValue, oldValue){
          if(newValue != oldValue){
            console.log(newValue)
            scope.tvenue=null
            scope.thash=null 

            if(newValue.topVenue && newValue.topVenue.socialActivity>0) {
              scope.tvenue=newValue.topVenue.name
            }

            if(newValue.topHashtag && newValue.topHashtag.socialActivity>0) {
              scope.thash=newValue.topHashtag.name
            }

            //console.log(tvenue,thash)

          }
        })

      }
    }
  }])

