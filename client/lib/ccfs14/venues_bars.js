(function(){

  var ccfs = window.ccfs || (window.ccfs = {});

  ccfs.barChart = function(){

    var height = 600,
        width = 600,
        duration = 2000;


    function bars(selection){
    	selection.each(function(data){
        
        var chart;

        if (selection.select('svg').empty()){
          chart = selection.append('svg')
            .attr('width', width)
            .attr('height', height)
        }
        else {
          chart = selection.select('svg')
            .attr('width', width)
            .attr('height', height)
         }

        /*Bar chart title */

        var titleHeight = 45;

        if(chart.select(".bc-title").empty()){
          var title = chart
                      .append("g")
                      .attr("transform", "translate(0," + titleHeight + ")")
                      .attr("class", "bc-title")
                      .append("text")
                      .attr("fill", "white")
                      .attr("font-size", "1.2em")

          title
            .append("tspan")
            .attr("font-family", "'clear_sans_lightregular', sans-serif")
            .attr("fill-opacity", 0.75)
            .text("Most Tweeted ")

          title
            .append("tspan")
            .attr("font-family", "'clear_sansregular', sans-serif")
            .text("Venues")
        }

        //Setting scales and domains

        var xMax = d3.max(data, function(d) { return d.socialActivity; });
        var arrowWidth = 5;

        var x = d3.scale.linear()
                  .range([0, width-arrowWidth])

        var y = d3.scale.ordinal()
                  .rangeRoundBands([titleHeight, height], .6, 0.6)
        
        x.domain([0, xMax])
        y.domain(data.map(function(d) { return d.name; }))

        var barret = chart.selectAll(".bar").data(data)

        barret
          .transition()
          .duration(duration)
          .attr("width", function(d) { return x(d.socialActivity); })

        barret.enter().append("rect")
          .attr("class", "bar")
          .attr("x", 	0)
          .attr("width", function(d) { return x(d.socialActivity); })
          .attr("y", function(d) { return y(d.name); })
          .attr("height", function(d) { return y.rangeBand(); })
          .attr("fill", "#007BC0")
          .attr("fill-opacity", 0.5)

        var arrows = chart.selectAll(".bararrow").data(data)

        arrows.enter().append("path")
          .attr("class", "bararrow")
          .attr("fill", "#007BC0")
          .attr("fill-opacity", 0.5)
          .attr("d", function(d) { return "M"+x(d.socialActivity)+" "+y(d.name)+" L"+(x(d.socialActivity)+arrowWidth)+" "+(y(d.name)+(y.rangeBand()/2))+" L"+x(d.socialActivity)+" "+(y(d.name)+(y.rangeBand()/1))+" Z" })

        var texts = chart.selectAll(".barnames").data(data)
         
        texts.enter().append("text")
          .attr("class", "barnames")
          .attr("x", 	0)
          .attr("y", function(d) { return y(d.name); })
          .attr("fill", "#fff")
          .attr("dx", 4)
          .attr("dy", 11)
          .attr("font-family", "'clear_sans_lightregular', sans-serif")
          .attr("font-size", "0.7em")
          .text(function(d) { return d.name; })

        var values = chart.selectAll(".barvalues").data(data)

        values
          .transition()
          .duration(duration)
          .tween("text", function(d) {
                var i = d3.interpolateNumber(this.textContent, d.socialActivity);
                return function(t) {
                    this.textContent = Math.round(i(t));
                };
          })

        values.enter().append("text")
          .attr("class", "barvalues")
          .attr("x", width - arrowWidth*2)
          .attr("y", function(d) { return y(d.name); })
          .attr("fill", "#fff")
          .attr("dy", 11)
          .attr("font-family", "'clear_sans_lightregular', sans-serif")
          .attr("font-size", "0.7em")
          .attr("text-anchor", "end")
          .text(function(d) { return d.socialActivity; })


    	}); //end selection
    } // end bars

    bars.height = function(x){
      if (!arguments.length) return height;
      height = x;
      return bars;
    }

    bars.width = function(x){
      if (!arguments.length) return width;
      width = x;
      return bars;
    }

    bars.duration = function(x){
      if (!arguments.length) return duration;
      duration = x;
      return bars;
    }

    return bars;

  }

})();