(function(){

  var ccfs = window.ccfs || (window.ccfs = {});

  ccfs.mask = function(){

    var height = 600,
        width = 600,
        projection;


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

        var path = d3.geo.path()
            .projection(projection)

        var paths = data.features.map(function(d){return path(d)})

        chart.append("path")
          .attr("class", ".mask")
          .attr("fill-rule", "evenodd")
          .attr("d", function(d) { return "M0,0H" + width + "V" + height + "H0Z" + paths.join(" "); })
          .attr("fill", "black")
          .attr("fill-opacity", 0.9)
          .attr("stroke", "white")
          .attr("stroke-width", 0.5)
          .attr("stroke-opacity", 0.85)

        //var bounds = data.features.map(function(d){return path.bounds(d)})

        //console.log(bounds[0])
        var districtLabel = chart.selectAll(".district-label").data(data.features)

        districtLabel
          .enter().append("text")
          .attr("class", ".district-label")
          .attr("x", function(d){return path.bounds(d)[0][0]})
          .attr("y", function(d){return path.bounds(d)[0][1] - 5})
          .attr("font-family", '"clear_sans_lightregular", sans-serif')
          .attr("font-size", "0.85em")
          .attr("fill", "white")
          .attr("kerning", 1.5)
          .text(function(d){return d.properties.label.toUpperCase()})

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

  mask.projection = function(x){
    if (!arguments.length) return projection;
    projection = x;
    return mask;
  }

  return mask;

  }

})();