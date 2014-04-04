(function(){

  var ccfs = window.ccfs || (window.ccfs = {});

  ccfs.network = function(){

    var height = 600,
        width = 600,


    function net(selection){
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

        // WORK IN PROGRESS :))))

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