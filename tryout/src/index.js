window.onload = function() {
  let canvas = document.getElementById("canvas");
  let ctx = canvas.getContext("2d");
  let socket = io.connect();
  let menu = new Menu(socket);


  socket.on('Receive message', function(msg) {
    if (menu.gameStarted) {
      menu.game.interface.chat.outputMessage(msg);
    }
  });

  socket.on('Newcomer', function(num) {
      menu.game.player.unit.number = num;
  });

  socket.on('Add player', function(num, team, name, x, y, health) {
    if (team === 1) {
      let elderly = new RedUnit(menu.game, name, socket);
      elderly.number = num;
      elderly.health = health;
      elderly.position.x = x;
      elderly.position.y = y;
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
    findPlayer(number).moveToClick(x, y);
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
    findPlayer(number).moveUpNext();
  });

  socket.on('Stop up', function(number) {
    findPlayer(number).stopUpNext();
  });

  socket.on('Move down', function(number) {
    findPlayer(number).moveDownNext();
  });

  socket.on('Stop down', function(number) {
    findPlayer(number).stopDownNext();
  });

  socket.on('Move left', function(number) {
    findPlayer(number).moveLeftNext();
  });

  socket.on('Stop left', function(number) {
    findPlayer(number).stopLeftNext();
  });

  socket.on('Move right', function(number) {
    findPlayer(number).moveRightNext();
  });

  socket.on('Stop right', function(number) {
    findPlayer(number).stopRightNext();
  });

  socket.on('Attack', function(number) {
    findPlayer(number).attackNext();
  });
  socket.on('Check attack', function(number) {
    findPlayer(number).check();
  });

  socket.on('Score change', function(red, blue) {
    menu.game.redScore = red;
    menu.game.blueScore = blue;
  });

  socket.on('Desync check', function(number, x, y, xmove, ymove, side) {
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
  });

  socket.on('Health', function(number, health) {
    if (number === menu.game.player.unit.number) {
      menu.game.player.unit.health = health;
    } else {
      findPlayer(number).health = health;
    }
  });

  socket.on('Death', function(number) {
    if (number === menu.game.player.unit.number) {
      menu.game.player.unit.alive = false;
    } else {
      findPlayer(number).alive = false;
    }
  });

  socket.on('Red victory', function() {

  });

  socket.on('Blue victory', function() {

  });

  socket.on('Remove player', function(number) {
    socket.emit('test');
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
      
      requestAnimationFrame(loop);  //Basically a redraw function
    }
  
    loop();
}