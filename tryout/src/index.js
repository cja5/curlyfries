window.onload = function() {
  let canvas = document.getElementById("canvas");
  let ctx = canvas.getContext("2d");
  let host = false;
  let timer = 0;
  let socket = io.connect();
  let menu = new Menu(socket);


  socket.on('Receive message', function(msg) {
    if (menu.gameStarted) {
      menu.game.interface.chat.outputMessage(msg);
    }
  });

  socket.on('Newcomer', function(num, powerups) {
      menu.game.player.unit.number = num;
      for (var i = 0; i < menu.game.gameObjects.length-16; i++) {
        menu.game.gameObjects[i+16].active = powerups[i];
      }
  });

  socket.on('Host', function() {
    host = true;
    socket.emit('Host');
  });

  socket.on('Update powerups', function(time) {
    if (timer === 0) {
      timer = time;
    } else if ((time - timer)/1000 > 60) {
      socket.emit('Update powerups');
      timer = 0;
    }
  });

  socket.on('Restore powerups', function() {
    if (menu.gameStarted) {
      for (var i = 16; i < menu.game.gameObjects.length; i++) {
        menu.game.gameObjects[i].active = true;
      }
    }
  });

  socket.on('Add player', function(num, team, name, x, y, health, powerup) {
    if (team === 1) {
      let elderly = new RedUnit(menu.game, name, socket);
      elderly.number = num;
      elderly.health = health;
      elderly.position.x = x;
      elderly.position.y = y;
      elderly.poweredUp = powerup;
      menu.game.redTeam.push(elderly);
      menu.game.otherPlayers.push(elderly);
    } else {
      let elderly = new BlueUnit(menu.game, name, socket);
      elderly.number = num;
      elderly.health = health;
      elderly.position.x = x;
      elderly.position.y = y;
      menu.game.blueTeam.push(elderly);
      menu.game.otherPlayers.push(elderly);
    }
    
  });

  socket.on('Click move', function(number, x, y) {
    if (menu.gameStarted) {
      findPlayer(number).moveToClick(x, y);
    }
  });

  socket.on('Create player', function(name, team, number) {
    if (menu.gameStarted) {
    if(team === 1) {
      let newbie = new RedUnit(menu.game, name, socket);
      newbie.number = number;
      menu.game.redTeam.push(newbie);
      menu.game.otherPlayers.push(newbie);
    } else if(team === 2) {
      let newbie = new BlueUnit(menu.game, name, socket);
      newbie.number = number;
      menu.game.blueTeam.push(newbie);
      menu.game.otherPlayers.push(newbie);
    } menu.game.interface.chat.outputMessage(name+ " has joined!");
  }
  });
  socket.on('Move up', function(number) {
    if (menu.gameStarted) {
      findPlayer(number).moveUpNext();
    }
  });

  socket.on('Stop up', function(number) {
    if (menu.gameStarted) {
      findPlayer(number).stopUpNext();
    }
  });

  socket.on('Move down', function(number) {
    if (menu.gameStarted) {
      findPlayer(number).moveDownNext();
    }
  });

  socket.on('Stop down', function(number) {
    if (menu.gameStarted) {
      findPlayer(number).stopDownNext();
    }
  });

  socket.on('Move left', function(number) {
    if (menu.gameStarted) {
      findPlayer(number).moveLeftNext();
    }
  });

  socket.on('Stop left', function(number) {
    if (menu.gameStarted) {
      findPlayer(number).stopLeftNext();
    }
  });

  socket.on('Move right', function(number) {
    if (menu.gameStarted) {
      findPlayer(number).moveRightNext();
    }
  });

  socket.on('Stop right', function(number) {
    if (menu.gameStarted) {
      findPlayer(number).stopRightNext();
    }
  });

  socket.on('Attack', function(number) {
    if (menu.gameStarted) {
      findPlayer(number).attackNext();
    }
  });

  socket.on('Check attack', function(number) {
    if (menu.gameStarted) {
      findPlayer(number).check();
    }
  });

  socket.on('Score change', function(red, blue) {
    if (menu.gameStarted) {
      menu.game.redScore = red;
      menu.game.blueScore = blue;
    }
  });

  socket.on('Desync check', function(number, x, y, xmove, ymove, side) {
    if (menu.gameStarted) {
      if (menu.game.player.unit.number === number) {
        var player = menu.game.player.unit;
      } else {
        var player = findPlayer(number);
      }
      player.position.x = x;
      player.position.y = y;
      player.movement.x = xmove;
      player.movement.y = ymove;
      player.side = side;
    }
  });

  socket.on('Health', function(number, health) {
    if (menu.gameStarted) {
      if (number === menu.game.player.unit.number) {
        menu.game.player.unit.health = health;
      } else {
        findPlayer(number).health = health;
      }
    }
  });

  socket.on('Shield taken', function(number, objectNumber) {
    if (menu.gameStarted) {
      menu.game.gameObjects[objectNumber].active = false;
      findPlayer(number).poweredUp = true;
    }
  });

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

  socket.on('Shield ended', function(number) {
    if (menu.gameStarted) {
      findPlayer(number).poweredUp = false;
    }
  });

  socket.on('Health taken', function(number, objectNumber) {
    if (menu.gameStarted) {
      menu.game.gameObjects[objectNumber].active = false;
    }
  });

  socket.on('Death', function(number) {
    if (menu.gameStarted) {
      if (number === menu.game.player.unit.number) {
        menu.game.player.unit.alive = false;
      } else {
        findPlayer(number).alive = false;
      }
    }
  });

  socket.on('Respawn start', function(time, started) {
    if (menu.gameStarted) {
      if(!started) {
        menu.game.player.respawnTime = time;
      } else {
        if ((time - menu.game.player.respawnTime)/1000 > 30) {
          menu.game.player.respawnTime = 0;
          menu.game.player.respawned();
          socket.emit('Respawned', menu.game.player.unit.number);
        } else {
          menu.game.player.respawnTimer = 30 - Math.round((time - menu.game.player.respawnTime)/1000);
        }
      }
    }
  });

  socket.on('Respawned', function(number) {
    if (menu.gameStarted) {
      findPlayer(number).respawned();
    }
  });

  socket.on('Red victory', function() {
    if (menu.gameStarted) {
      socket.emit('Reset');
      if (menu.game.player instanceof ActivePlayer) {
        if (menu.game.player.unit instanceof RedUnit) {
          victory();
        } else {
          defeat(true);
        }
      } else {
        defeat(true);
      }
    }
  });

  socket.on('Blue victory', function() {
    if (menu.gameStarted) {
      socket.emit('Reset');
      if (menu.game.player instanceof ActivePlayer) {
        if (menu.game.player.unit instanceof BlueUnit) {
          victory();
        } else {
          defeat(false);
        }
      } else {
        defeat(false);
      }
    }
  });

  socket.on('Remove player', function(number) {
    if (menu.gameStarted) {
      socket.emit('Shift', number);
      var removed = findPlayer(number);
      menu.game.otherPlayers.splice(menu.game.otherPlayers.indexOf(removed), 1);
      if (removed instanceof BlueUnit) {
        menu.game.blueTeam.splice(menu.game.blueTeam.indexOf(removed), 1);
      } else {
        menu.game.redTeam.splice(menu.game.redTeam.indexOf(removed), 1);
      }
        if(menu.game.player.unit.number >= number) {
          menu.game.player.unit.number--;
        }
        for(var i = 0; i < menu.game.otherPlayers.length; i++) {
          if(menu.game.otherPlayers[i].number >= number) {
            menu.game.otherPlayers[i].number--;
          }
        }
      }
  });

  let mouse = {
    x:0,
    y:0
  }
  window.onmousemove = mouseMovement;
  window.ontouchmove = mouseMovement;
  window.onmousedown = mouseClick;
  window.ontouchstart = mouseClick;

  function findPlayer(number){
    for (var i = 0; i < menu.game.otherPlayers.length; i++) {
      if(menu.game.otherPlayers[i].number === number) {
        return menu.game.otherPlayers[i];
      }
    }
  }

  function victory() {
    menu = new Menu(socket);
    menu.state = 1;
  }

  function defeat(side) {
    menu = new Menu(socket);
    menu.winner = side;
    menu.state = 2;
  }
  
  function mouseMovement(event) {
    var e = event || window.event;	
    mouse = { 
      x: e.clientX, 
      y: e.clientY 
    };
  }
  
  function mouseClick() {
    menu.click();
  }
  
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
        socket.emit('Update map');
      }
      
      requestAnimationFrame(loop);  //Basically a redraw function
    }
  
    loop();
}