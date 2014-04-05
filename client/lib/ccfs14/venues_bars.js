(function(){

  var ccfs = window.ccfs || (window.ccfs = {});

  ccfs.barChart = function(){

    var height = 600,
    width = 600;


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

        var xMax = d3.max(data, function(d) { return d.socialActivity; })

        //Setting scales and domains
        var x = d3.scale.linear()
                  .range([0, width-5])

        var y = d3.scale.ordinal()
                  .rangeRoundBands([0, height], .57, 1)
        
        x.domain([0, xMax])
        y.domain(data.map(function(d) { return d.name; }))

    	// 		var xAxis = d3.svg.axis()
				 //    .scale(x)
				 //    .orient("bottom");

					// var yAxis = d3.svg.axis()
				 //    .scale(y)
				 //    .orient("left");

    	// 		chart.append("g")
			  //     .attr("class", "x axis")
			  //     .attr("transform", "translate(50," + (height-20) + ")")
			  //     // .attr("transform", "translate(0," + height + ")")
			  //     .call(xAxis);

				 //  chart.append("g")
			  //     .attr("class", "y axis")
			  //     .attr("transform", "translate(50,0)")
			  //     .call(yAxis)

       var barret = chart.selectAll(".bar").data(data)

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
        .attr("d", function(d) { return "M"+x(d.socialActivity)+" "+y(d.name)+" L"+(x(d.socialActivity)+5)+" "+(y(d.name)+(y.rangeBand()/2))+" L"+x(d.socialActivity)+" "+(y(d.name)+(y.rangeBand()/1))+" Z" })

       var texts = chart.selectAll(".barnames").data(data)

       texts.enter().append("text")
         .attr("class", "barnames")
         .attr("x", 	0)
         .attr("y", function(d) { return y(d.name); })
         .attr("fill", "#fff")
         .attr("dx", 4)
         .attr("dy", 12)
         .attr("font-family", "Clear Sans Light, times, sans-serif")
         .attr("font-size", "10px")
         .text(function(d) { return d.name; })



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

    return bars;

  }

})();