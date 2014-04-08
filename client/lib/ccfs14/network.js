(function(){

  var ccfs = window.ccfs || (window.ccfs = {});

  ccfs.network = function(){

    var height = 600,
        width = 600,
        graph={"nodes":[],"links":[]};


    function net(selection){
      selection.each(function(data){
        
      var toDelete=[];
      graph.nodes.forEach(function(d,i){
        found=false;
        data.nodes.forEach(function(e,j){
          if(d.id==e.id) {
            if(d.socialActivity != e.socialActivity) {
              d.socialActivity = e.socialActivity
              d.act=true;
            }
            found=true;
          }        
        })  
        if(!found) toDelete.push(d.id)
      })


      graph.nodes = graph.nodes.filter(function( obj ) {
          return toDelete.indexOf(obj.id)<0;
      });


      data.nodes.forEach(function(d,j){
        found=false;
        graph.nodes.forEach(function(e,i){
          if(d.id==e.id) { 
            found=true;
          }
        })
        if(!found) graph.nodes.push(d);
      })      



      graph.links=data.links
      graph.links.forEach(function(d,i){
          var src=graph.nodes.filter(function(e){return e.id==d.source})[0]
          var tgt=graph.nodes.filter(function(e){return e.id==d.target})[0]
          d.source=graph.nodes.indexOf(src);
          d.target=graph.nodes.indexOf(tgt);
      })


        var vis,force;
      
        
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
		var lerp = d3.scale.linear().domain([0,max]).range([0,3000])  
		force=d3.layout.force();
		
		force
      .nodes(graph.nodes)
	    .links(graph.links);
			  
			  
		force.size([width, height])
		.gravity(.05)
    .distance(100)
    .charge(-200)
		.start();
		
		    var link = vis.selectAll("line.link")
		    .data(force.links())
		        
		        
		      link.enter().append("svg:line")
		      .attr("class", "link")
	        .style("stroke","#fff")
          .style("stroke-width",1)
		
		
			  link.exit().remove();
		
		
		    var node = vis.selectAll("g.node")
          .data(graph.nodes, function(e){return e.id})
		        
        node.selectAll("node-circle").transition().duration(500)
	       .attr("r", function(d){return Math.sqrt(lerp(d.socialActivity)/Math.PI)})
		    
        node.filter(function(d){return d.act})
        .append("circle")
        .attr("class","halo")
        .attr("cx",0)
        .attr("cy",0)
        .attr("r", function(d){d.act=false;return Math.sqrt(lerp(d.socialActivity)/Math.PI)})
        .style("stroke","#3b7")
        .style("fill","none")
        .transition().duration(1000)
        .attr("r", function(d){return Math.sqrt(lerp(d.socialActivity)/Math.PI)+50})
        .style("opacity",0)
        .remove()    
		        
		    var nodeEnter = node.enter().append("svg:g")
		        .attr("class", "node");
		        
		      nodeEnter.append("circle")
		      	.attr("class","node-circle")
		        .attr("cx",0)
		        .attr("cy",0)
            .style("fill","#fff")
            .transition()
            .duration(500)
		        .attr("r", function(d){return Math.sqrt(lerp(d.socialActivity)/Math.PI)})
            .style("opacity",1)
		        
		
		    nodeEnter.filter(function(e){return e.socialActivity > 50})
		    .append("clipPath")
		    .attr("class","mask")
		      .attr('id', function(d,i) { return "clip" + i })
		      .append('circle')
		      .attr("cx",0)
		      .attr("cy",0)
		      .attr("r", function(d){return Math.sqrt(lerp(d.socialActivity)/Math.PI)-1})
		
		      nodeEnter.filter(function(e){return e.socialActivity > 50})
		      .append("image")
		      .attr("xlink:href", function(d){return d.avatar})
		      .attr("x", function(d){return -Math.sqrt(lerp(d.socialActivity)/Math.PI)})
		      .attr("y", function(d){return -Math.sqrt(lerp(d.socialActivity)/Math.PI)})
		      .attr("preserveAspectRatio","none")  
		      .attr("width", function(d){return 2*Math.sqrt(lerp(d.socialActivity)/Math.PI)})
		      .attr("height", function(d){return 2*Math.sqrt(lerp(d.socialActivity)/Math.PI)})
		      .attr("clip-path", function(d,i){return "url(#clip" + i +")" })
		      .transition()
          .duration(500)
          .style("opacity",1)  
		
		    nodeEnter.filter(function(e){return e.socialActivity > 50})
		    .append("text")
		    .attr("x",0)
		    .attr("y",function(d){return Math.sqrt(lerp(d.socialActivity)/Math.PI)+12})
		    .text(function(d){return d.name})
		    .attr("text-anchor","middle")
		    .attr("font-family","sans-serif")
		    .style("fill","#fff")
        .transition()
        .duration(500)
		    .style("opacity",1)      
		      
		      node.exit().transition().duration(500).style("opacity",0).remove();
		
		    force.on("tick", function() {
		      link.attr("x1", function(d) { return d.source.x; })
		          .attr("y1", function(d) { return d.source.y; })
		          .attr("x2", function(d) { return d.target.x; })
		          .attr("y2", function(d) { return d.target.y; });
		
		      node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
		     // if(force.alpha()<0.099) force.alpha(0.099)
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

  return net;

  }

})();