var express = require('express');
var app = express();
var server = app.listen(8000);
var fs=require('fs');
var io = require('socket.io').listen(server);
var _ = require("underscore")

/*app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});*/

//io.set("origins","*:*")

var data_url="../sample_data/"
var map_url=data_url+"map/"
var bike_tl_url=data_url+"Bike/BikeTimeline/"
var bike_stall_url=data_url+"Bike/Stalls/"
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


io.sockets.on('connection', function (socket) {
	
	var inc=-1;
	
	var sendData = function() {
		inc++;
		
		//twitter
		var res = emitTwitter(inc,socket)
		
	}
	var run = setInterval(sendData, 2000);
  socket.on('disconnect', function() {
    clearInterval(run);
	});
});


function emitTwitter(i,socket) {
	val=i%districts.general.length;
	var data;
	fs.readFile(map_url+districts.general[val], 'utf8', function (err, data) {
	  if (err) {
	    console.log('Error: ' + err);
	    return;
	  }
	 
	  data = JSON.parse(data);
	  
	  //data.time=districts.general[val].replace(/\.[^/.]+$/, "")
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




