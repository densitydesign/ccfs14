var express = require('express');
var app = express();
var server = app.listen(8000);
var fs=require('fs');
var io = require('socket.io').listen(server);

/*app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});*/

//io.set("origins","*:*")

var data_url="../sample_data/"
var map_url=data_url+"map/"

//map utils - builds folder structure
var districts={"general":[]}
var wholemap=fs.readdirSync(map_url)
for(i in wholemap) {
	if(fs.lstatSync(map_url+wholemap[i]).isDirectory()) {
		var distName=wholemap[i]
		districts[distName]=[]
		var currDistr =	fs.readdirSync(map_url+distName)
		for(j in currDistr){
			districts[distName].push(currDistr[j])
		}
	}
	else {
		districts.general.push(wholemap[i])
	}
}

console.log(districts)

io.sockets.on('connection', function (socket) {
	
	var sendData = function() {
		data = new Date();
		socket.emit('send', data);
	}
	var run = setInterval(sendData, 2000);
  socket.on('disconnect', function() {
    clearInterval(run);
	});
});