(function(){

  var ccfs = window.ccfs || (window.ccfs = {});

  ccfs.mask = function(){

    var height = 600,
        width = 600


    function mask(selection){
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

        var projection = d3.geo.mercator()
            .center([9.1916, 45.4640])
            .scale((17 << 18) / 2 / Math.PI)
            .translate([width / 2, height / 2]);

        var path = d3.geo.path()
            .projection(projection)

        var paths = data.features.map(function(d){return path(d)})

        chart.append("path")
          .attr("class", ".mask")
          .attr("fill-rule", "evenodd")
          .attr("d", function(d) { return "M0,0H" + width + "V" + height + "H0Z" + paths.join(" "); })
          .attr("fill", "black")
          .attr("fill-opacity", 0.85)

      }); //end selection
    } // end mask


  mask.height = function(x){
    if (!arguments.length) return height;
    height = x;
    return mask;
  }

  mask.width = function(x){
    if (!arguments.length) return width;
    width = x;
    return mask;
  }

  return mask;

  }

})();