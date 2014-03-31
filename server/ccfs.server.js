var express = require('express');
var app = express();
var server = app.listen(8000);

var io = require('socket.io').listen(server);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.set("origins","*:*")
io.sockets.on('connection', function (socket) {
	console.log("lol")
	incr = 0;
	var sendData = function() {
		data = new Date();
		socket.emit('send', data);
		incr++;
	}
	var run = setInterval(sendData, 2000);
  socket.on('disconnect', function() {
    clearInterval(run);
	});
});