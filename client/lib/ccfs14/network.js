(function(){

  var ccfs = window.ccfs || (window.ccfs = {});

  ccfs.network = function(){

    var height = 600,
        width = 600,
        update;


    function net(selection){
      selection.each(function(data){
        
        var graph = data;
        var vis,force;
        
        update=function() {
        	console.log(force)
        	//return force;
        }
                 
        
        if (selection.select('svg').empty()){
	          vis = selection.append('svg')
	          .attr('width', width)
	          .attr('height', height)

        }
        else
        {
          vis = selection.select('svg')
          .attr('width', width)
          .attr('height', height)
        }
        

		var max = d3.max(data.nodes, function(e){return e.socialActivity});
		var lerp = d3.scale.linear().domain([0,max]).range([0,1000])  
		force=d3.layout.force();
		
		force
        .nodes(graph.nodes,function(e){return e.id})
	    .links(graph.links);
			  
			  
		force.size([width, height])
		.gravity(.05)
        .distance(30)
        .charge(-100)
		.start();
		
		    var link = vis.selectAll("line.link")
		        .data(graph.links)
		        
		        
		      link.enter().append("svg:line")
		        .attr("class", "link")
		        .style("stroke","#fff")
		
		
			  link.exit().remove();
		
		
		    var node = vis.selectAll("g.node")
		        .data(graph.nodes, function(e){return e.id})
		        
		        node.selectAll("node-circle").transition().duration(200)
		       .attr("r", function(d){return Math.sqrt(lerp(d.socialActivity)/Math.PI)})
		        
		        
		    var nodeEnter = node.enter().append("svg:g")
		        .attr("class", "node");
		        
		      nodeEnter.append("circle")
		      	.attr("class","node-circle")
		        .attr("cx",0)
		        .attr("cy",0)
		        .attr("r", function(d){return Math.sqrt(lerp(d.socialActivity)/Math.PI)})
		        .style("fill","#fff")
		
		    nodeEnter.filter(function(e){return e.socialActivity > 200})
		    .append("clipPath")
		    .attr("class","mask")
		      .attr('id', function(d,i) { return "clip" + i })
		      .append('circle')
		      .attr("cx",0)
		      .attr("cy",0)
		      .attr("r", function(d){return Math.sqrt(lerp(d.socialActivity)/Math.PI)-1})
		
		      nodeEnter.filter(function(e){return e.socialActivity > 200})
		      .append("image")
		      .attr("xlink:href", function(d){return d.avatar})
		      .attr("x", function(d){return -Math.sqrt(lerp(d.socialActivity)/Math.PI)})
		      .attr("y", function(d){return -Math.sqrt(lerp(d.socialActivity)/Math.PI)})
		      .attr("preserveAspectRatio","none")  
		      .attr("width", function(d){return 2*Math.sqrt(lerp(d.socialActivity)/Math.PI)})
		      .attr("height", function(d){return 2*Math.sqrt(lerp(d.socialActivity)/Math.PI)})
		      .attr("clip-path", function(d,i){return "url(#clip" + i +")" })
		        
		
		    nodeEnter.filter(function(e){return e.socialActivity > 200})
		    .append("text")
		    .attr("x",0)
		    .attr("y",function(d){return Math.sqrt(lerp(d.socialActivity)/Math.PI)+12})
		    .text(function(d){return d.name})
		    .attr("text-anchor","middle")
		    .attr("font-family","sans-serif")
		    .style("fill","#fff")
		      
		      
		      node.exit().remove();
		
		    force.on("tick", function() {
		      link.attr("x1", function(d) { return d.source.x; })
		          .attr("y1", function(d) { return d.source.y; })
		          .attr("x2", function(d) { return d.target.x; })
		          .attr("y2", function(d) { return d.target.y; });
		
		      node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
		      if(force.alpha()<0.099) force.alpha(0.099)
		    })

      }); //end selection
    } // end net


  net.height = function(x){
    if (!arguments.length) return height;
    height = x;
    return net;
  }

  net.width = function(x){
    if (!arguments.length) return width;
    width = x;
    return net;
  }
  
  net.update = function(data) {
  	update()
  	return net;
  }

  return net;

  }

})();