var express = require('express');
var app = express();

var fs=require('fs');

var MBTiles = require('mbtiles');
var _ = require("underscore")


var mbtilesLocation = __dirname + '/data/fuorisalone2014.mbtiles';

new MBTiles(mbtilesLocation, function(err, mbtiles) {
  if (err) throw err;
  app.get('/tiles/:z/:x/:y.*', function(req, res) {
    var extension = req.param(0);
    console.log("entered here")
    switch (extension) {
      case "png": {
        mbtiles.getTile(req.param('z'), req.param('x'), req.param('y'), function(err, tile, headers) {
          if (err) {
            res.status(404).send('Tile rendering error: ' + err + '\n');
          } else {
            res.header("Content-Type", "image/png")
            res.send(tile);
          }
        });
        break;
      }
      case "grid.json": {
        mbtiles.getGrid(req.param('z'), req.param('x'), req.param('y'), function(err, grid, headers) {
          if (err) {
            res.status(404).send('Grid rendering error: ' + err + '\n');
          } else {
            res.header("Content-Type", "text/json")
            res.send(grid);
          }
        });
        break;
      }
    }
  });

});



var server = app.listen(8000);
var io = require('socket.io').listen(server);


io.set('log level', 1); 

var data_url="../sample_data/"
var map_url=data_url+"map/"
var bike_tl_url=data_url+"Bike/BikeTimeline/"
var bike_stall_url=data_url+"Bike/Stalls/"
var users_url=data_url+"UsersSa/"
var centroids;

fs.readFile(data_url+"centroid_django.json", 'utf8', function (err, data) {

	centroids = JSON.parse(data);
	
})

//map utils - builds folder structure
function structureData(folder) {
	var struct={"general":[]}
	var wholemap=fs.readdirSync(folder)
	for(i in wholemap) {
		var distName=wholemap[i]
		if(distName.indexOf("DS_Store")<0) {
			if(fs.lstatSync(folder+distName).isDirectory()) {
				
				struct[distName]=[]
				var currDistr =	fs.readdirSync(folder+distName)
				for(j in currDistr){
					struct[distName].push(currDistr[j])
				}
			}
			else {
				struct.general.push(wholemap[i])
			}
		}
	}
	return struct	
}

//structured data
var districts=structureData(map_url)
var bike_timeline=structureData(bike_tl_url)
var bike_stalls=structureData(bike_stall_url)
var users=structureData(users_url)




//================
//Emit events
//================
io.sockets.on('connection', function (socket) {
	
	var inc=-1;
	
	var sendData = function() {
		inc++;
		console.log(inc)
		//twitter
		emitTwitter(inc,socket)
		//stalls
		emitStalls(inc,socket)
		//all districts
		emitDistricts(inc, socket)
		//all networks
		emitUsers(inc,socket)
		
	}
	var run = setInterval(sendData, 2000);
  socket.on('disconnect', function() {
    clearInterval(run);
	});
});

//================





function emitTwitter(i,socket) {
	var val=i%districts.general.length;
	var data;
	fs.readFile(map_url+districts.general[val], 'utf8', function (err, data) {
	  if (err) {
	    console.log('Error: ' + err);
	    return;
	  }
	  data = JSON.parse(data);

		cells=data.cells;
		var res={"time":districts.general[val].replace(/\.[^/.]+$/, ""),"type": "FeatureCollection","features": []}
		cells.forEach(function(d,j){
			if(centroids[d.id] && d.social_activity>0 ) {
				var obj={"type":"Feature","properties":{"id":d.id,"social":d.social_activity},"geometry":centroids[d.id].geometry}
				res["features"].push(obj)
			}
		})
	  socket.emit('twitter', res);
	});
}

function emitStalls(i, socket) {
	var val=i%bike_stalls.general.length;
	var data;
	fs.readFile(bike_stall_url+bike_stalls.general[val], 'utf8', function (err, data) {
	  if (err) {
	    console.log('Error: ' + err);
	    return;
	  }
	  data = JSON.parse(data);
	  
	  
		stalls=data.stalls;
		var res={"time":bike_stalls.general[val].replace(/\.[^/.]+$/, ""),"type": "FeatureCollection","features": []}
		stalls.forEach(function(d,j){
			res.features.push({"type":"Feature","properties":{"id":d.id, "percent":d.percentageOfAvailableBikes},"geometry":{"type":"Point","coordinates":[d.longitude,d.latitude]}})
		})
	  socket.emit('stalls', res);
	});
} 

function emitDistricts(i,socket) {
	var distr = _.omit(districts,'general');
	var filtDistr=_.pairs(_.pick(distr,['Brera','Tortona','Lambrate','PRomana']))
	filtDistr.forEach(function(d,j) {
		
		console.log(i,d[1].length,i%d[1].length)
		var val=i%d[1].length;
		
		var data;
		
		fs.readFile(map_url+d[0]+"/"+d[1][val], 'utf8', function (err, data) {
		  if (err) {
		    console.log('Error: ' + err);
		    return;
		  }
		  data = JSON.parse(data);
		var cells=data.cells
		var res={"time":d[1][val].replace(/\.[^/.]+$/, ""),"type": "FeatureCollection","features": []}
			cells.forEach(function(d,j){	
					var obj={"type":"Feature","properties":{"id":d.id,"mobile":d.mobily_activity}}
					res["features"].push(obj)
			})
			socket.emit(d[0],res)
		});
	})
}


function emitUsers(i,socket) {
	
	var filtUsr=_.pairs(_.pick(users,['general','Brera','Tortona','Lambrate','PRomana']))
	filtUsr.forEach(function(d,j) {
		
		var val=i%d[1].length;

		var data;
		var file_url;

		if(d[0]==='general') file_url=users_url+d[1][val]
		else file_url=users_url+d[0]+"/"+d[1][val]

		fs.readFile(file_url, 'utf8', function (err, data) {
		  if (err) {
		    console.log('Error: ' + err);
		    return;
		  }
		 try {
		  	data = JSON.parse(data);
			}
		  catch (e) {
			  // An error has occured, handle it, by e.g. logging it
			  console.log(e);
			  data={"error":e}
			}
		  data.time=d[1][val].replace(/\.[^/.]+$/, "")
		  socket.emit("net-"+d[0],data)
		});
	})
}

