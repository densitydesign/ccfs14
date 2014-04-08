(function(){

  var ccfs = window.ccfs || (window.ccfs = {});

  ccfs.venues = function(){

    var height = 600,
        width = 600,
        projection,
        duration = 2000,
        dispatch = d3.dispatch("clicked");


    function venues(selection){
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

        var venues = chart.selectAll(".venues").data(data.features, function(d){return d.properties.id})

        venues
          .enter()
          .append("path")
          .attr("class", "venues")
          .attr("transform", function(d) { return "translate(" + projection(d.geometry.coordinates) + ")"; })
          .attr("d", d3.svg.symbol().type("triangle-up"))
          .attr("fill", "#007BC0")
          .attr("fill-opacity", 0)
            .transition()
            .duration(duration)
            .attr("fill-opacity", 0.5)

      }); //end selection
    } // end venues


  venues.height = function(x){
    if (!arguments.length) return height;
    height = x;
    return venues;
  }

  venues.width = function(x){
    if (!arguments.length) return width;
    width = x;
    return venues;
  }

  venues.projection = function(x){
    if (!arguments.length) return projection;
    projection = x;
    return venues;
  }

  venues.duration = function(x){
    if (!arguments.length) return duration;
    duration = x;
    return venues;
  }


  d3.rebind(venues, dispatch, 'on');

  return venues;

  }

})();