(function(){

  var ccfs = window.ccfs || (window.ccfs = {});

  ccfs.tweet = function(){

    var height = 600,
        width = 600,
        projection,
        minRadius = 2,
        maxRadius = 30,
        duration = 2000,
        dispatch = d3.dispatch("clicked");


    function tweet(selection){
      selection.each(function(data){
        var chart;

        if (selection.select('svg').empty()){
          chart = selection.append('svg')
          .attr('width', width)
          .attr('height', height)
        }
        else
        {
          chart = selection.select('svg')
          .attr('width', width)
          .attr('height', height)
        }

        var path = d3.geo.path()
            .projection(projection)
            //.pointRadius(0)

        var radiusDomain = d3.extent(data.features.map(function(d){return d.properties.social}))

        var radiusScale = d3.scale.linear()
                            .range([Math.pow(minRadius,2)*Math.PI, Math.pow(maxRadius,2)*Math.PI])
                            .domain(radiusDomain)

        var durationScale = d3.scale.linear()
                              .range([500,duration])
                              .domain(radiusDomain)

        var tweets = chart.selectAll(".tweet").data(data.features, function(d){return d.properties.id})


        tweets
          //.attr("d", path.pointRadius(0))
          //.attr("stroke-opacity", 1)
          .attr("fill-opacity", 1)
          .transition()
          .duration(function(d){return durationScale(d.properties.social)})
          .attr("d", path.pointRadius(function(d){return Math.sqrt((radiusScale(d.properties.social)/Math.PI))}))
          //.attr("stroke-opacity", 0.5)
          .attr("fill-opacity", 0.5)

        tweets
          .enter()
          .append("path")
          .attr("class", "tweet")
          .attr("d", path.pointRadius(0))
          //.attr("d", path.pointRadius(function(d){return Math.sqrt((radiusScale(d.properties.social)/Math.PI))}))
          .attr("fill", "#0EA789")
          .attr("fill-opacity", 0)
          //.attr("stroke", "#0EA789")
          //.attr("stroke-opacity", 0)
          //.attr("stroke-width", 2)
            .transition()
            .duration(function(d){return durationScale(d.properties.social)})
            //.attr("d", path.pointRadius(function(d){return Math.sqrt((radiusScale(d.properties.social)/Math.PI))}))
            //.attr("stroke-opacity", 0.5)
            .attr("fill-opacity", 0.5)

        tweets
          .exit()
          .transition()
          .duration(duration*Math.random())
          .attr("d", path.pointRadius(0))
          //.attr("stroke-opacity", 0)
          .attr("fill-opacity", 0)
          .remove()
          

      }); //end selection
    } // end tweet


  tweet.height = function(x){
    if (!arguments.length) return height;
    height = x;
    return tweet;
  }

  tweet.width = function(x){
    if (!arguments.length) return width;
    width = x;
    return tweet;
  }

  tweet.projection = function(x){
    if (!arguments.length) return projection;
    projection = x;
    return tweet;
  }

  tweet.minRadius = function(x){
    if (!arguments.length) return minRadius;
    minRadius = x;
    return tweet;
  }

  tweet.maxRadius = function(x){
    if (!arguments.length) return maxRadius;
    maxRadius = x;
    return tweet;
  }

  tweet.duration = function(x){
    if (!arguments.length) return duration;
    duration = x;
    return tweet;
  }

  d3.rebind(tweet, dispatch, 'on');

  return tweet;

  }

})();