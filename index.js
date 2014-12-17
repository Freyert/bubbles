var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var playerTable = {}; //global player table

app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/static', express.static(__dirname + '/static'));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
	console.log(socket.id + ' user connected');
	socket.join('init');
	io.to('init').emit('init field', playerTable);
	socket.leave('init');
	socket.on('player join', function(player) {
		playerTable[socket.id] = { x: player.x, y: player.y, color: player.color};
		socket.broadcast.emit('player join', {
			id: socket.id,
			x: player.x,
			y: player.y,
			color: player.color
		});
	});


	socket.on('disconnect', function() {
		console.log('user disconnected');
		delete playerTable[socket.id];
		socket.broadcast.emit('player left', socket.id);
	});

	socket.on('mouse move', function(point) {
		var player = {
			id: socket.id,
			x: point.x,
			y: point.y

		};
		socket.broadcast.emit('player move', player);
	});
});


http.listen(3000, function() {
	console.log('listening on *:3000');
});
