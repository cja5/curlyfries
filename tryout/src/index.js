window.onload = function() {
  let canvas = document.getElementById("canvas");
  let ctx = canvas.getContext("2d");
  let host = false;   //True - this client is checking power ups respawn time
  let timer = 0;     //Power ups respawn time, used only if host === true
  let socket = io.connect(); //Creates a connection
  let menu = new Menu(socket); //new menu

  //Receive a message from server
  socket.on('Receive message', function(msg) {
    if (menu.gameStarted) { //If game has started, output this message in chat
      menu.game.interface.chat.outputMessage(msg);
    }
  });
  //Gives a player a unique id upon joining the game and sets some power ups inactive
  socket.on('Newcomer', function(num, powerups) {
      menu.game.player.unit.number = num;
      for (var i = 0; i < menu.game.gameObjects.length-18; i++) { //Start with 18
        menu.game.gameObjects[i+18].active = powerups[i];        //Since 18 - end are only power ups
      }
  });
  //Upon receiveing becomes a "host"
  socket.on('Host', function() {
    host = true;
    socket.emit('Host');
  });
  //Resets power ups once a minute (host only)
  socket.on('Update powerups', function(time) {
    if (timer === 0) {
      timer = time;
    } else if ((time - timer)/1000 > 60) {
      socket.emit('Update powerups');
      timer = 0;
    }
  });
  //Restores all power ups in the game
  socket.on('Restore powerups', function() {
    if (menu.gameStarted) {
      for (var i = 18; i < menu.game.gameObjects.length; i++) {
        menu.game.gameObjects[i].active = true;
      }
    }
  });
  //Upon joining, adds all current players to your game
  socket.on('Add player', function(num, team, name, x, y, health, powerup) {
    if (team === 1) { //1 = red
      let elderly = new RedUnit(menu.game, name, socket);
      elderly.number = num;    //Player id
      elderly.health = health;
      elderly.position.x = x;
      elderly.position.y = y;
      elderly.poweredUp = powerup;  //True if unit is currently powered up
      menu.game.redTeam.push(elderly);
      menu.game.otherPlayers.push(elderly);
    } else {   //2 = blue
      let elderly = new BlueUnit(menu.game, name, socket);
      elderly.number = num;   //Player id
      elderly.health = health;
      elderly.position.x = x;
      elderly.position.y = y;
      elderly.poweredUp = powerup;  //True if unit is currently powered up
      menu.game.blueTeam.push(elderly);
      menu.game.otherPlayers.push(elderly);
    }
    
  });
  //Initiates a moving after click for non-player units
  socket.on('Click move', function(number, x, y) {
    if (menu.gameStarted) {
      findPlayer(number).moveToClick(x, y);
    }
  });
  //Creates a newly joined player
  socket.on('Create player', function(name, team, number) {
    if (menu.gameStarted) {
    if(team === 1) {
      let newbie = new RedUnit(menu.game, name, socket);
      newbie.number = number;  //Unique id
      menu.game.redTeam.push(newbie);
      menu.game.otherPlayers.push(newbie);
    } else if(team === 2) {
      let newbie = new BlueUnit(menu.game, name, socket);
      newbie.number = number;  //Unique id
      menu.game.blueTeam.push(newbie);
      menu.game.otherPlayers.push(newbie);
    } menu.game.interface.chat.outputMessage(name+ " has joined!"); //Notify everyone in the chat
  }
  });
  //Below are handlers of inputs from another players
  //Up or W pressed
  socket.on('Move up', function(number) {
    if (menu.gameStarted) {
      findPlayer(number).moveUpNext();
    }
  });
  //Up or W released
  socket.on('Stop up', function(number) {
    if (menu.gameStarted) {
      findPlayer(number).stopUpNext();
    }
  });
  //Down or S pressed
  socket.on('Move down', function(number) {
    if (menu.gameStarted) {
      findPlayer(number).moveDownNext();
    }
  });
  //Down or S released
  socket.on('Stop down', function(number) {
    if (menu.gameStarted) {
      findPlayer(number).stopDownNext();
    }
  });
  //Left or A
  socket.on('Move left', function(number) {
    if (menu.gameStarted) {
      findPlayer(number).moveLeftNext();
    }
  });
  //Left or A released
  socket.on('Stop left', function(number) {
    if (menu.gameStarted) {
      findPlayer(number).stopLeftNext();
    }
  });
  //Right or D
  socket.on('Move right', function(number) {
    if (menu.gameStarted) {
      findPlayer(number).moveRightNext();
    }
  });
  //Right or D released
  socket.on('Stop right', function(number) {
    if (menu.gameStarted) {
      findPlayer(number).stopRightNext();
    }
  });
  //Spacebar pressed
  socket.on('Attack', function(number) {
    if (menu.gameStarted) {
      findPlayer(number).attackNext();
    }
  });
  //Spacebar released
  socket.on('Check attack', function(number) {
    if (menu.gameStarted) {
      findPlayer(number).check();
    }
  });


  //Fetches score from the server
  socket.on('Score change', function(red, blue) {
    if (menu.gameStarted) {
      menu.game.redScore = red;
      menu.game.blueScore = blue;
    }
  });
  //Desync check, makes sure that everyone has their correct position
  socket.on('Desync check', function(number, x, y, xmove, ymove, side) {
    if (menu.gameStarted) {
      if (menu.game.player.unit.number === number) { //Specify the player
        var player = menu.game.player.unit; 
      } else {
        var player = findPlayer(number);
      }  //Update the values for player's unit
      player.position.x = x;
      player.position.y = y;
      player.movement.x = xmove;
      player.movement.y = ymove;
      player.side = side;
    }
  });
  //Updates health of a specific unit
  socket.on('Health', function(number, health) {
    if (menu.gameStarted) {
      if (number === menu.game.player.unit.number) {
        menu.game.player.unit.health = health;
      } else {
        findPlayer(number).health = health;
      }
    }
  });
  //Activate a shield for a specific unit and make power up inactive
  socket.on('Shield taken', function(number, objectNumber) {
    if (menu.gameStarted) {
      menu.game.gameObjects[objectNumber+18].active = false;
      findPlayer(number).poweredUp = true;
    }
  });
  //Waits 10 seconds before removing the shield from unit (shield bearer only)
  socket.on('Shield timer', function(number, timer, time) {
    if (menu.gameStarted) {
      if (timer === 0) {
        menu.game.player.shieldTimer = time;
      } else if ((time-menu.game.player.shieldTimer)/1000 > 10) {
        menu.game.player.unit.poweredUp = false;
        menu.game.player.unit.playerPoweredUp = false;
        menu.game.player.shieldTimer = 0;
        socket.emit('Shield ended', number);
      }
    }
  });
  //Removes shield buff from a unit
  socket.on('Shield ended', function(number) {
    if (menu.gameStarted) {
      findPlayer(number).poweredUp = false;
    }
  });
  //Makes a health pot inactive
  socket.on('Health taken', function(number, objectNumber) {
    if (menu.gameStarted) {
      menu.game.gameObjects[objectNumber].active = false;
    }
  });
  //Check for dead players
  socket.on('Death', function(number) {
    if (menu.gameStarted) {
      if (number === menu.game.player.unit.number) {
        menu.game.player.unit.alive = false;
      } else {
        findPlayer(number).alive = false;
      }
    }
  });
  //Counts 30 seconds before respawning
  socket.on('Respawn start', function(time, started) {
    if (menu.gameStarted) {
      if(!started) {
        menu.game.player.respawnTime = time;
      } else {
        if ((time - menu.game.player.respawnTime)/1000 > 30) {
          menu.game.player.respawnTime = 0;
          menu.game.player.respawned();
          socket.emit('Respawned', menu.game.player.unit.number);
        } else { //Sends time left to the timer to be outputted on screen
          menu.game.player.respawnTimer = 30 - Math.round((time - menu.game.player.respawnTime)/1000);
        }
      }
    }
  });
  //Respawns a unit
  socket.on('Respawned', function(number) {
    if (menu.gameStarted) {
      findPlayer(number).respawned();
    }
  }); 
  //Ends the game with Red Victory
  socket.on('Red victory', function() {
    if (menu.gameStarted) {
      socket.emit('Reset');
      if (menu.game.player instanceof ActivePlayer) { //Checks if player is not a spectator
        if (menu.game.player.unit instanceof RedUnit) { //Checks if player's team is red
          victory();
        } else {
          defeat(true); 
        }
      } else {
        defeat(true);
      }
    }
  });
  //Ends the game with Blue Victory
  socket.on('Blue victory', function() {
    if (menu.gameStarted) {
      socket.emit('Reset');
      if (menu.game.player instanceof ActivePlayer) { //Checks if player is not a spectator
        if (menu.game.player.unit instanceof BlueUnit) { //Checks if player's team is blue
          victory();
        } else {
          defeat(false);
        }
      } else {
        defeat(false);
      }
    }
  });
  //Removes a unit if player disconnected
  socket.on('Remove player', function(number) {
    if (menu.gameStarted) {
      socket.emit('Shift', number); //Shifts unique id on the server
      var removed = findPlayer(number); //Finds the removed player
      menu.game.otherPlayers.splice(menu.game.otherPlayers.indexOf(removed), 1); //Removes him from the list
      if (removed instanceof BlueUnit) { //Checks the team
        menu.game.blueTeam.splice(menu.game.blueTeam.indexOf(removed), 1);
      } else {
        menu.game.redTeam.splice(menu.game.redTeam.indexOf(removed), 1);
      } //Shifts unique id by -1
        if(menu.game.player.unit.number >= number) {
          menu.game.player.unit.number--;
        } //Shifts other players' id by -1
        for(var i = 0; i < menu.game.otherPlayers.length; i++) {
          if(menu.game.otherPlayers[i].number >= number) {
            menu.game.otherPlayers[i].number--;
          }
        }
      }
  });
  //Holds cursor positions
  let mouse = {
    x:0,
    y:0
  }
  window.onmousemove = mouseMovement;
  window.ontouchmove = mouseMovement;
  window.onmousedown = mouseClick;
  window.ontouchstart = mouseClick;
  //Searches for a player's unique id in the players' Array
  function findPlayer(number){
    for (var i = 0; i < menu.game.otherPlayers.length; i++) {
      if(menu.game.otherPlayers[i].number === number) {
        return menu.game.otherPlayers[i];
      }
    }
  }
  //Resets the game with a victory screen
  function victory() {
    menu = new Menu(socket);
    menu.state = 1;
  }
  //Resets the game with a defeat/spectator screen
  function defeat(side) {
    menu = new Menu(socket);
    menu.winner = side;
    menu.state = 2;
  }
  //Rewrites cursor position
  function mouseMovement(event) {
    var e = event || window.event;	
    mouse = { 
      x: e.clientX, 
      y: e.clientY 
    };
  }
  //Activates upon mouse click
  function mouseClick() {
    menu.click();
  }
    //Actual game loop
   function loop() {
       //Gets current height and width of a client
      //Updates it in case any changes occur
      let height = document.documentElement.clientHeight;
      let width = document.documentElement.clientWidth;
  
      ctx.canvas.height = height;
      ctx.canvas.width = width;
      //Clears the canvas and updates everything on it
      ctx.clearRect(0, 0, width, height)
      menu.update(ctx, mouse.x, mouse.y);
      if (host) {
        socket.emit('Update map'); //If client is "host", then counts 60 seconds for map update
      }
      
      requestAnimationFrame(loop);  //Basically a redraw function
    }
  
    loop();
}