(function(){

  var ccfs = window.ccfs || (window.ccfs = {});

  ccfs.bikemi = function(){

    var height = 600,
        width = 600,
        projection,
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

        chart.selectAll(".bikemi")
          .data(data.features)
          .enter().append("path")
          .attr("class", ".bikemi")
          .attr("d", path.pointRadius(0))
          .attr("fill", "yellow")
          .attr("fill-opacity", 0.7)
          .transition()
          .duration(1000)
          .attr("d", path.pointRadius(function(d) { return d.properties.STALLI/10 }))

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

  d3.rebind(bikemi, dispatch, 'on');

  return bikemi;

  }

})();