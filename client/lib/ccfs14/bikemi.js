(function(){

  var ccfs = window.ccfs || (window.ccfs = {});

  ccfs.bikemi = function(){

    var height = 600,
        width = 600,
        projection,
        minRadius = 2,
        maxRadius = 5,
        duration = 2000,
        dispatch = d3.dispatch("clicked");


    function bikemi(selection){
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

        //var radiusDomain = d3.extent(data.features.map(function(d){return d.properties.social}))

        var radiusScale = d3.scale.linear()
                            .range([Math.pow(minRadius,2)*Math.PI, Math.pow(maxRadius,2)*Math.PI])
                            .domain([0, 100])

        var stalls = chart.selectAll(".stalls").data(data.features, function(d){return d.properties.id})

        stalls
        .transition()
        .duration(duration)
        .attr("d", path.pointRadius(function(d){return Math.sqrt((radiusScale(d.properties.percent*100)/Math.PI))}))

        stalls
          .enter()
          .append("path")
          .attr("class", "stalls")
          .attr("d", path.pointRadius(0))
          .attr("fill", "#FFE100")
          .attr("fill-opacity", 0.3)
            .transition()
            .duration(duration)
            .attr("d", path.pointRadius(function(d){return Math.sqrt((radiusScale(d.properties.percent*100)/Math.PI))}))

      }); //end selection
    } // end bikemi


  bikemi.height = function(x){
    if (!arguments.length) return height;
    height = x;
    return bikemi;
  }

  bikemi.width = function(x){
    if (!arguments.length) return width;
    width = x;
    return bikemi;
  }

  bikemi.projection = function(x){
    if (!arguments.length) return projection;
    projection = x;
    return bikemi;
  }

  bikemi.minRadius = function(x){
    if (!arguments.length) return minRadius;
    minRadius = x;
    return bikemi;
  }

  bikemi.maxRadius = function(x){
    if (!arguments.length) return maxRadius;
    maxRadius = x;
    return bikemi;
  }

  bikemi.duration = function(x){
    if (!arguments.length) return duration;
    duration = x;
    return bikemi;
  }


  d3.rebind(bikemi, dispatch, 'on');

  return bikemi;

  }

})();