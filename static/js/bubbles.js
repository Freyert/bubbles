'use strict';

paper.install(window);
window.onload = function() {
	var canvas = document.getElementById('bubbleCanvas');
	var companions = {}; //Position and colors for fellow dots.
	paper.setup(canvas);
	var radius = 30;
	var circle = new Path.Circle({
		center: view.center,
		radius: radius,
		fillColor: '#'+Math.floor(Math.random()*16777215).toString(16)//http://www.paulirish.com/2009/random-hex-color-code-snippets/
	});

	var socket = io();
	socket.on('connect', function(playerTable) {
		socket.emit('player join', {
						 x: circle.position.x,	
						 y: circle.position.y,
						 color: circle.fillColor.toCSS(true)
		 });
	});

	socket.on('init field', function (playerTable) {
		Object.keys(playerTable).map(function (key) {
			companions[key] = new Path.Circle({
				center: new Point(playerTable[key].x, playerTable[key].y),
				radius: radius,
				fillColor: playerTable[key].color
			});
		});
	});
	canvas.addEventListener('mousemove', function (event) {
		circle.position.x = event.clientX;
		circle.position.y =  event.clientY;
		socket.emit('mouse move', { x: event.clientX, y: event.clientY});
	});

	socket.on('player join', function(player) {
		companions[player.id] = new Path.Circle({
			center: new Point(player.x, player.y),
			radius: 30,
			fillColor: player.color
		});
	});

	socket.on('player left', function(playerId) {
		companions[playerId].remove();
		delete companions[playerId];
	});

	socket.on('player move', function(player) {
		companions[player.id].position.x = player.x;
		companions[player.id].position.y = player.y;
		view.update();
	});

};
