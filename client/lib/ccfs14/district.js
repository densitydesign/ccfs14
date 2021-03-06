(function(){

  var ccfs = window.ccfs || (window.ccfs = {});

  ccfs.district = function(){

    var height = 600,
        width = 600,
        projection,
        duration = 2000,
        dispatch = d3.dispatch("clicked");


    function district(selection){
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

        var scaleOpacity = d3.scale.linear().range([1,0])
        var opacityDomain = d3.extent(data.features.map(function(d){return d.properties.mobile}))
        scaleOpacity.domain(opacityDomain)

        var districts = chart.selectAll(".district").data(data.features, function(d){return d.properties.id})

        districts
          .transition()
          .duration(duration)
          .attr("fill-opacity", function(d){return scaleOpacity(d.properties.mobile)})

        districts
          .enter().append("path")
          .attr("class", "district")
          .attr("d", path)
          .attr("fill", "black")
          .attr("fill-opacity", 1)

      }); //end selection
    } // end district


  district.height = function(x){
    if (!arguments.length) return height;
    height = x;
    return district;
  }

  district.width = function(x){
    if (!arguments.length) return width;
    width = x;
    return district;
  }

  district.projection = function(x){
    if (!arguments.length) return projection;
    projection = x;
    return district;
  }

  district.duration = function(x){
    if (!arguments.length) return duration;
    duration = x;
    return district;
  }

  d3.rebind(district, dispatch, 'on');

  return district;

  }

})();