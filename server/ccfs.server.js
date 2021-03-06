var express = require('express');
var app = express();

var fs = require('fs');

var MBTiles = require('mbtiles');
var _ = require("underscore")

var mbtilesLocation = __dirname + '/data/fuorisalone2014.mbtiles';

new MBTiles(mbtilesLocation, function(err, mbtiles) {
	if (err)
		throw err;
	app.get('/tiles/:z/:x/:y.*', function(req, res) {
		var extension = req.param(0);
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

var server = app.listen(3333);
var io = require('socket.io').listen(server);

io.enable('browser client minification');  // send minified client
io.enable('browser client etag');          // apply etag caching logic based on version number
io.enable('browser client gzip');          // gzip the file
io.set('log level', 1);                    // reduce logging

// enable all transports (optional if you want flashsocket support, please note that some hosting
// providers do not allow you to create servers that listen on a port different than 80 or their
// default port)
io.set('transports', [
    'websocket'
  , 'flashsocket'
  , 'htmlfile'
  , 'xhr-polling'
  , 'jsonp-polling'
]);

var data_url = "../sample_data/"
var map_url = data_url + "map/"
var bike_tl_url = data_url + "Bike/BikeTimeline/"
var bike_stall_url = data_url + "Bike/Stalls/"
var users_url = data_url + "UsersSa/"
var venuesTop_url = data_url + "VenuesTop/"
var venuesSa_url = data_url + "VanuesSa/"
var topnet_url = data_url + "TopVenuesHashtag/"
var centroids;

fs.readFile(data_url + "centroid_django.json", 'utf8', function(err, data) {

	centroids = JSON.parse(data);

})
//map utils - builds folder structure
function structureData(folder) {
	var struct = {
		"general" : []
	}
	var wholemap = fs.readdirSync(folder)
	for (i in wholemap) {
		var distName = wholemap[i]
		if (distName.indexOf("DS_Store") < 0) {
			if (fs.lstatSync(folder + distName).isDirectory()) {

				struct[distName] = []
				var currDistr = fs.readdirSync(folder + distName)
				for (j in currDistr) {
					struct[distName].push(currDistr[j])
				}
			} else {
				struct.general.push(wholemap[i])
			}
		}
	}
	return struct
}

//structured data
var districts = structureData(map_url)
var bike_timeline = structureData(bike_tl_url)
var bike_stalls = structureData(bike_stall_url)
var users = structureData(users_url)
var venuesTop = structureData(venuesTop_url)
var venuesSa = structureData(venuesSa_url)
var topnet = structureData(topnet_url)
var venuesList={}		
buildVenuesList(venuesTop, venuesList)


//================
//Emit events
//================
//io.sockets.on('connection', function(socket) {

	var inc = -1;

	var sendData = function() {
		inc++;

		//twitter
		emitTwitter(inc)
		//stalls
		emitStalls(inc)
		//all districts
		emitDistricts(inc)
		//all networks
		emitUsers(inc)
		//all Venues
		emitVenues(inc)
		//top venue and hastag
		emitTop(inc)

	}
	//var run = setInterval(sendData, 2000);
	//socket.on('disconnect', function() {
	//	clearInterval(run);
	//});
//});


/* count connected users, if nobody there stop emit*/
var run;
var usersConnected = 0
io.sockets.on('connection', function(socket) {

	usersConnected++
	if(usersConnected == 1){
		run = setInterval(sendData, 2000);
	}
	//console.log(usersConnected)
	socket.on('disconnect', function() {
		usersConnected--
		//console.log(usersConnected)
		if(usersConnected == 0){
			clearInterval(run);
			}
	});

})

function emitTwitter(i, socket) {
	var val = i % districts.general.length;
	var data;
	fs.readFile(map_url + districts.general[val], 'utf8', function(err, data) {
		if (err) {
			console.log('Error: ' + err);
			return;
		}
		data = JSON.parse(data);

		cells = data.cells;
		var res = {
			"time" : districts.general[val].replace(/\.[^/.]+$/, ""),
			"type" : "FeatureCollection",
			"features" : []
		}
		cells.forEach(function(d, j) {
			if (centroids[d.id] && d.social_activity > 0) {
				var obj = {
					"type" : "Feature",
					"properties" : {
						"id" : d.id,
						"social" : d.social_activity
					},
					"geometry" : centroids[d.id].geometry
				}
				res["features"].push(obj)
			}
		})
		//socket.emit('twitter', res);
		io.sockets.emit('twitter', res);
	});
}

function emitStalls(i, socket) {
	var val = i % bike_stalls.general.length;
	var data;
	fs.readFile(bike_stall_url + bike_stalls.general[val], 'utf8', function(err, data) {
		if (err) {
			console.log('Error: ' + err);
			return;
		}
		data = JSON.parse(data);

		stalls = data.stalls;
		var res = {
			"time" : bike_stalls.general[val].replace(/\.[^/.]+$/, ""),
			"type" : "FeatureCollection",
			"features" : []
		}
		stalls.forEach(function(d, j) {
			res.features.push({
				"type" : "Feature",
				"properties" : {
					"id" : d.id,
					"percent" : d.percentageOfAvailableBikes
				},
				"geometry" : {
					"type" : "Point",
					"coordinates" : [d.longitude, d.latitude]
				}
			})
		})
		//socket.emit('stalls', res);
		io.sockets.emit('stalls', res);
	});
}

function emitDistricts(i, socket) {
	var distr = _.omit(districts, 'general');
	var filtDistr = _.pairs(_.pick(distr, ['Brera', 'Tortona', 'Lambrate', 'PRomana']))
	var out = {
		"type" : "FeatureCollection",
		"features" : []
	}
	var counter = 0;
	filtDistr.forEach(function(d, j) {
		var val = i % d[1].length;
		var data;

		fs.readFile(map_url + d[0] + "/" + d[1][val], 'utf8', function(err, data) {
			if (err) {
				console.log('Error: ' + err);
				return;
			}
			data = JSON.parse(data);
			var mobileDomain = data.cells.map(function(d) {
				return d.mobily_activity
			})
			var mobileRange = [0, 100]
			var cells = data.cells
			//var res={"time":d[1][val].replace(/\.[^/.]+$/, ""),"type": "FeatureCollection","features": []}
			var scaleValue = function(value) {
				return mobileRange[0] + (((value - _.min(mobileDomain)) * (mobileRange[1] - mobileRange[0])) / (_.max(mobileDomain) - _.min(mobileDomain)))
			}
			cells.forEach(function(d, j) {
				var obj = {
					"type" : "Feature",
					"properties" : {
						"id" : d.id,
						"mobile" : scaleValue(d.mobily_activity)
					}
				}
				//res["features"].push(obj)
				out["features"].push(obj)
			})
			//socket.emit(d[0],res)
			counter = counter + 1;
			if (counter == filtDistr.length) {
				out["time"] = d[1][val].replace(/\.[^/.]+$/, "");
				//socket.emit("districts", out);
				io.sockets.emit("districts", out);
			}
		});
	})
}

function emitUsers(i, socket) {

	var filtUsr = _.pairs(_.pick(users, ['general', 'Brera', 'Tortona', 'Lambrate', 'PRomana']))
	filtUsr.forEach(function(d, j) {

		var val = i % d[1].length;

		var data;
		var file_url;

		if (d[0] === 'general')
			file_url = users_url + d[1][val]
		else
			file_url = users_url + d[0] + "/" + d[1][val]

		fs.readFile(file_url, 'utf8', function(err, data) {
			if (err) {
				console.log('Error: ' + err);
				return;
			}
			try {
				data = JSON.parse(data);
			} catch (e) {
				// An error has occured, handle it, by e.g. logging it
				console.log(e);
				data = {
					"error" : e
				}
			}
			data.time = d[1][val].replace(/\.[^/.]+$/, "")
			//socket.emit("net-" + d[0], data)
			io.sockets.emit("net-" + d[0], data)
		});
	})
}


function emitTop(i, socket) {

	var filtTop = _.pairs(_.pick(topnet, ['general', 'Brera', 'Tortona', 'Lambrate', 'PRomana']))
	filtTop.forEach(function(d, j) {

		var val = i % d[1].length;

		var data;
		var file_url;

		if (d[0] === 'general')
			file_url = topnet_url + d[1][val]
		else
			file_url = topnet_url + d[0] + "/" + d[1][val]

		fs.readFile(file_url, 'utf8', function(err, data) {
			if (err) {
				console.log('Error: ' + err);
				return;
			}
			try {
				data = JSON.parse(data);
			} catch (e) {
				// An error has occured, handle it, by e.g. logging it
				console.log(e);
				data = {
					"error" : e
				}
			}
			var topVenue = data["topVenues"][0]
			var topHashtag = data["topHashtags"][0]
			var topTime = d[1][val].replace(/\.[^/.]+$/, "")
			//socket.emit("net-" + d[0], data)
			var res={"topVenue":topVenue, "topHashtag":topHashtag, "time":topTime};

			//if ( d[0] === 'general') console.log(res)
			io.sockets.emit("top-" + d[0], res)
		});
	})
}

function emitVenues(i,socket) {
	
	var filtVen = _.pairs(_.pick(venuesSa, ['general', 'Brera', 'Tortona', 'Lambrate', 'PRomana']))
	
	filtVen.forEach(function(d, j) {
		var res={}
		var totVenues=_.map(venuesList[d[0]].venues, _.clone)
		var maxSocialActivity = _.max(totVenues, function(d){ return d.utilsSocial}).utilsSocial
		var val = i % d[1].length;
		var data;
		var file_url;
		
		
		if (d[0] === 'general')
			file_url = venuesSa_url + d[1][val]
		else
			file_url = venuesSa_url + d[0] + "/" + d[1][val]
			
		fs.readFile(file_url, 'utf8', function(err, data) {
			if (err) {
				console.log('Error: ' + err);
				return;
			}
			try {
				data = JSON.parse(data);
			} catch (e) {
				// An error has occured, handle it, by e.g. logging it
				console.log(e);
				data = {
					"error" : e
				}
			}
			res.time = d[1][val].replace(/\.[^/.]+$/, "")
			res.maxValue = maxSocialActivity
			data.venues.forEach(function(e,k){
				
				var curr=totVenues.filter(function(r){return r.id===e.id})[0]
				
				curr.socialActivity=e.socialActivity
			
			})
		
			res.venues=totVenues;
			if (d[0] === 'general') {
			}
			//socket.emit("venue-" + d[0], res)
			io.sockets.emit("venue-" + d[0], res)
		});
		})
}

function buildVenuesList(vtop, vlist) {

	_.pairs(vtop).forEach(function(v, k) {
		
		var name;
		if (v[0] === "general")
			name = ""
		else
			name = v[0] + "/";

		data=fs.readFileSync(venuesTop_url + name + v[1], 'utf8')
		
				data = JSON.parse(data);
				data.venues.forEach(function(d, i) {
					delete d.latitude
					delete d.longitude
					d.utilsSocial = d.socialActivity;
					d.socialActivity = 0;

				})
				vlist[v[0]] = data
				
	})

}

