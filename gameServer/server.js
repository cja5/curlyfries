var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');var app = express();
var server = http.Server(app);
var io = socketIO(server);app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});


server.listen(5000, function() {
  console.log('Starting server on port 5000');
});

io.on('connection', function(socket) {
});

setInterval(function() {
  io.sockets.emit('message', 'hi!');
}, 1000);

//hit detection
function overlaps(attackerName, players) {
  //get the attacker from the list of players
  var attacker = opponents[attackerName];

  //loop through all players to find opponents
  for(var name in players) {
    //if the attacker then skip
    if(attackerName == name) {
      continue;
    }

    //get the opponent
    var opponent = players[name];

    //if the attacker overlaps the opponent return the opponent that we killed
    if(attacker.x >= opponent.x && attacker.x <= opponent.x + 42) {
        if(attacker.y >= opponent.y && attacker.y <= opponent.y + 42) {
          return opponent;
        }
    }
  }

  //return nothing if no hits
  return undefined;
}

var players = {};

//on a connection
io.on('connection', function(socket) {
  //when receiving a new player event add the player to the list
  socket.on('new player', function() {
    players[socket.id] = {
      y: 0,
      x: 0
    };

    //send the player their name
    socket.emit('name', socket.id);
  });

  //when the player moves update it in the list
  socket.on('movement', function(data) {
    var player = players[socket.id] || {};
    player.x = data.x;
    player.y = data.y;
  });

  //on strike find the overlapping opponent
  socket.on('strike', function(data) {
    var opponent = overlaps(socket.id, players);

    //placeholder output
    if(opponent) {
      //successful
      console.log(opponent);
    } else {
      console.log('no');
    }
  });
});

setInterval(function() {
  //send the state every 16.6ms to everyone
  io.sockets.emit('state', players);
}, 1000 / 60);
