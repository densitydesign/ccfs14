express   = require('express');
app       = express();
server 	  = require('http').createServer(app)
io 		  = require('socket.io').listen(server);
path  	  = require('path');

server.listen(80, function() {
	console.log("Started a server on port 80");
});

app.use(express.static(path.join(__dirname, '../../')));
/*app.get('/', function (req, res) {
  res.sendfile(__dirname + '/socket.io.html');
});*/


app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
 });




io.sockets.on('connection', function (socket) {
	incr = 0;
	var sendData = function() {
		data = [
			{
				"color": "blue",
				"name": "New York",
				"data": [ { "x": 0, "y": incr }, { "x": 1, "y": 49 }, { "x": 2, "y": 38 }, { "x": 3, "y": 30 }, { "x": 4, "y": 32 } ]
			}, {
			  "color": "red",
				"name": "London",
				"data": [ { "x": 0, "y": 19 }, { "x": 1, "y": incr }, { "x": 2, "y": 29 }, { "x": 3, "y": 20 }, { "x": 4, "y": 14 } ]
			}, {
			  "color": "black",
				"name": "Tokyo",
				"data": [ { "x": 0, "y": 8 }, { "x": 1, "y": 12 }, { "x": 2, "y": incr }, { "x": 3, "y": 11 }, { "x": 4, "y": 10 } ]
			}
	  ]
		socket.emit('rickshaw', data);
		incr++;
	}
	var run = setInterval(sendData, 2000);
  socket.on('disconnect', function() {
    clearInterval(run);
	});
});