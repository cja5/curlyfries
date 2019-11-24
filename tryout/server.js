var path = require('path');
var http = require('http');
var express = require('express');
var app = express();
var server = http.Server(app);
var io = require('socket.io')(server);
app.use('/', express.static(__dirname + '/'));
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});
connections = [];
playerNum = 0;
var playerList = {};
var blueScore = 0;
var redScore = 0;


server.listen(8081, function() {
  console.log('Starting server on port 5000');
});

io.on('connection', function(socket) {
  connections.push(socket);
  var id = 0;
  console.log("connected: "+ connections.length);


  socket.on('disconnect', function(socket) {
    connections.splice(connections.indexOf(socket), 1);
    removePlayer(id);
    console.log('Disconnected: '+ connections.length);

  });

  socket.on('Send message', function(message) {
    socket.broadcast.emit('Receive message', message);
  });

  socket.on('test', function() {
    console.log("Stonks");
  });

  socket.on('Click move', function(number, x, y) {
    socket.broadcast.emit('Click move', number, x, y);
  });

  socket.on('Desync check', function(number, xmove, ymove, side) {
    socket.broadcast.emit('Desync check', number, playerList[number].x, playerList[number].y, xmove, ymove, side);
  })

  socket.on('Change position', function(number, x, y) {
    playerList[number].x = x;
    playerList[number].y = y;
  });

  socket.on('Move up', function(number) {
    socket.broadcast.emit('Move up', number);
  });

  socket.on('Stop up', function(number) {
    socket.broadcast.emit('Stop up', number);
  });

  socket.on('Move down', function(number) {
    socket.broadcast.emit('Move down', number);
  });

  socket.on('Stop down', function(number) {
    socket.broadcast.emit('Stop down', number);
  });

  socket.on('Move left', function(number) {
    socket.broadcast.emit('Move left', number);
  });

  socket.on('Stop left', function(number) {
    socket.broadcast.emit('Stop left', number);
  });

  socket.on('Move right', function(number) {
    socket.broadcast.emit('Move right', number);
  });

  socket.on('Stop right', function(number) {
    socket.broadcast.emit('Stop right', number);
  });

  socket.on('Attack', function(number) {
    socket.broadcast.emit('Attack', number);
  });
  socket.on('Check attack', function(number) {
    socket.broadcast.emit('Check attack', number);
  });

  socket.on('Health', function(number, health) {
    playerList[number].health = health;
    socket.broadcast.emit('Health', number, health);
  });

  socket.on('Death', function(number) {
    socket.broadcast.emit('Death', number);
  });

  socket.on('Score change', function(number, score) {
    if(playerList[number].team === 1) {
      redScore+=score;
    } else {
      blueScore+=score;
    }
    socket.emit('Score change', redScore, blueScore);
    socket.broadcast.emit('Score change', redScore, blueScore);

    if(redScore >= 50) {
      socket.emit('Red victory');
      socket.broadcast.emit('Red victory');
    } else if (blueScore >= 50) {
      socket.emit('Blue victory');
      socket.broadcast.emit('Blue victory');
    }
  });


  socket.on('New player', function(name, team, x, y, health) {
    if(team !== 3) {
      playerNum++;
      id = playerNum;
      playerList[playerNum] = new PlayerList(name, team, x, y, health);
      socket.emit('Newcomer', playerNum);
      var number = playerNum;
    } else {
      var number = playerNum +1;
    } 
    addPlayers(number, socket);

    console.log("New player: "+ name);
    socket.broadcast.emit('Create player', name, team, number);
  });
});

function addPlayers(number, socket) {
  for (var i = 1; i < number; i++) {
    socket.emit('Add player', i, playerList[i].team, playerList[i].name, playerList[i].x, playerList[i].y, playerList[i].health);
  }
}

function removePlayer(id) {
  console.log(id);
    if (id !== 0) {
      if (connections.length !== 0) {
        connections[0].emit('Remove player', id);
        connections[0].broadcast.emit('Remove player', id);
        connections[0].emit('Receive message', playerList[id].name+" has disconnected =(");
        connections[0].broadcast.emit('Receive message', playerList[id].name+" has disconnected =(");
      }
      playerNum--;
      for (var i = id; i <= playerNum; i++) {
        playerList[i] = playerList[i+1];
      }
    }
  }



class PlayerList {
  constructor(name, team, x, y, health) {
    this.name = name;
    this.team = team;
    this.x = x;
    this.y = y;
    this.health = health;
  }
}