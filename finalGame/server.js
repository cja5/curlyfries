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
var connections = [];   //Connections array
var playerNum = 0;     //Player count
var playerList = {};  //Player list, holds all required information about current players
var blueScore = 0;   //Blue Score
var redScore = 0;   //Red Score
var powerups = Array(8).fill(true); //Array for power ups, true = active


server.listen(50710, function() {
  console.log('Starting server on port 50710');
});

io.on('connection', function(socket) {
  connections.push(socket);             //Add a connection to the array
  var host = false;                    //Initialize host boolean
  var id = 0;                         //Set the player id to 0(spectator)
  if (connections.length === 1) {    //If it is the first one connected
    powerups = Array(8).fill(true); //Refresh all powerups on the map
    connections[0].emit('Host');   //And make this connection a "host"
  }
  console.log("connected: "+ connections.length);


  socket.on('disconnect', function(socket) {
    if (host) {                        //If dosconnected was a host
      if (connections.length > 1) {   //And that is not the last connected player
        connections[1].emit('Host'); //Set the next one to be a host
      }
    }
    connections.splice(connections.indexOf(socket), 1);
    removePlayer(id);
    console.log('Disconnected: '+ connections.length);

  });
  //Outputs a message, useful for testing
  socket.on('To console', function(string) {
    console.log(string);
  });
  //Sets host boolean to true for the specific connection
  socket.on('Host', function() {
    host = true;
  });
  //Sends a message into the chat
  socket.on('Send message', function(message) {
    socket.broadcast.emit('Receive message', message);
  });
  //Useful for testing
  socket.on('test', function() {
    console.log("Stonks");
  });
  //Host-only information, used for resetting power ups
  socket.on('Update map', function() {
    var time = new Date();
    socket.emit('Update powerups', time.getTime());
  });
  //Restores all powerups
  socket.on('Update powerups', function() {
    powerups = Array(8).fill(true);
    socket.emit('Restore powerups');
    socket.broadcast.emit('Restore powerups');
  });
  //Broadcasts a click to every other client
  socket.on('Click move', function(number, x, y) {
    socket.broadcast.emit('Click move', number, x, y);
  });
  //Updates everyone's values to ones stored on the server
  socket.on('Desync check', function(number, xmove, ymove, side) {
    if (playerNum !== 0) { //If there are no players, do nothing
      socket.broadcast.emit('Desync check', number, playerList[number].x, playerList[number].y, xmove, ymove, side);
    }
  });
  //Updates server position of the player
  socket.on('Change position', function(number, x, y) {
    playerList[number].x = x;
    playerList[number].y = y;
  });
  //Up or W pressed
  socket.on('Move up', function(number) {
    socket.broadcast.emit('Move up', number);
  });
  //etc
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
  //Syncs health for everyone on the server
  socket.on('Health', function(number, health) {
    if (playerNum !== 0) { //If there are no players left, do nothing instead
      playerList[number].health = health;
      socket.broadcast.emit('Health', number, health);
    }
  });
  //Syncs dead units
  socket.on('Death', function(number) {
    socket.broadcast.emit('Death', number);
  });
  //Starts a countdown for respawn
  socket.on('Respawn start', function(started){
    var time = new Date();
    socket.emit('Respawn start', time.getTime(), started);
  });
  //Respawns a unit for every client
  socket.on('Respawned', function(number) {
    socket.broadcast.emit('Respawned', number);
  });
  //Makes the shield inactive and sets a specific player to being powered up
  socket.on('Shield taken', function(number, objectNumber) {
    powerups[objectNumber] = false;
    playerList[number].poweredUp = true;
    socket.broadcast.emit('Shield taken', number, objectNumber);
  });
  //Starts a shield timer
  socket.on('Shield timer', function(number, timer) {
    var time = new Date();
    socket.emit('Shield timer', number, timer, time.getTime());
  });
  //Removes powered up buff from a player
  socket.on('Shield ended', function(number) {
    playerList[number].poweredUp = false;
    socket.broadcast.emit('Shield ended', number);
  });
  //Makes a health pot inactive
  socket.on('Health taken', function(number, objectNumber) {
    powerups[objectNumber] = false;
    socket.broadcast.emit('Health taken', number, objectNumber);
  });
  //Updates score
  socket.on('Score change', function(number, score) {
    if(playerList[number].team === 1) {
      redScore+=score;
    } else {
      blueScore+=score;
    }
    socket.emit('Score change', redScore, blueScore);
    socket.broadcast.emit('Score change', redScore, blueScore);
    //Game ending conditions
    if(redScore >= 1) {
      socket.emit('Red victory');
      socket.broadcast.emit('Red victory');
      restart();
    } else if (blueScore >= 1) {
      socket.emit('Blue victory');
      socket.broadcast.emit('Blue victory');
      restart();
    }
  });
  //Resets an id to 0
  socket.on('Reset', function() {
    id = 0;
  });
  //Shifts unique id by -1
  socket.on('Shift', function(number) {
    if (id > number) {
      id--;
    }
  });
  //Creates a new player and sends them all required data
  socket.on('New player', function(name, team, x, y, health) {
    if(team !== 3) {  //3 - spectator
      playerNum++;
      id = playerNum; //Set a unique id
      playerList[playerNum] = new PlayerList(name, team, x, y, health); //Add a new player to the list
      socket.emit('Newcomer', playerNum, powerups);
      var number = playerNum; //Set a unique id
    } else {
      var number = playerNum +1;
    } 
    addPlayers(number, socket);

    console.log("New player: "+ name);
    socket.broadcast.emit('Create player', name, team, number);
  });
});
//Restart function, set's all values to initial ones
function restart() {
console.log('Game Restarting');
playerNum = 0;
playerList = {};
blueScore = 0;
redScore = 0;
powerups = Array(8).fill(true);
}
//Add players function, goes through the player list
function addPlayers(number, socket) {
  for (var i = 1; i < number; i++) {
    socket.emit('Add player', i, playerList[i].team, playerList[i].name, playerList[i].x, playerList[i].y, playerList[i].health, playerList[i].poweredUp);
  }
}
//Removes a player from the game, shifts unique ids, outputs a message etc
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


//PlayerList class, used for storing player data
class PlayerList {
  constructor(name, team, x, y, health) {
    this.name = name;
    this.team = team;
    this.x = x;
    this.y = y;
    this.health = health;
    this.poweredUp = false;
  }
}