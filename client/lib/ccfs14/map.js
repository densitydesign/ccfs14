(function(){

  var ccfs = window.ccfs || (window.ccfs = {});

  ccfs.map = function(){

    var height = 600,
        width = 600,
        dispatch = d3.dispatch("clicked");


    function map(selection){
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
            .projection(projection);

        var tile = d3.geo.tile()
            .scale(projection.scale() * 2 * Math.PI)
            .translate(projection([0, 0]))
            .zoomDelta((window.devicePixelRatio || 1) - .5)
            .size([width, height]);

        var tiles = tile();

        chart
          .selectAll("image")
            .data(tiles)
          .enter().append("image")
            .attr("xlink:href", function(d) { return "http://" + ["a", "b", "c", "d"][Math.random() * 4 | 0] + ".tiles.mapbox.com/v3/examples.map-vyofok3q/" + d[2] + "/" + d[0] + "/" + d[1] + ".png"; })
            .attr("width", Math.round(tiles.scale))
            .attr("height", Math.round(tiles.scale))
            .attr("x", function(d) { return Math.round((d[0] + tiles.translate[0]) * tiles.scale); })
            .attr("y", function(d) { return Math.round((d[1] + tiles.translate[1]) * tiles.scale); });
      }); //end selection
    } // end map


  map.height = function(x){
    if (!arguments.length) return height;
    height = x;
    return map;
  }

  map.width = function(x){
    if (!arguments.length) return width;
    width = x;
    return map;
  }

  d3.rebind(map, dispatch, 'on');

  return map;

  }

})();