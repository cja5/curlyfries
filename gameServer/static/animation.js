// initialises variable globally, it is necessary as it points to the image that will
// be animated, accessed by many different functions, could try a getter and setter method?

var socket = io();

//says hi
socket.on('message', function(data) {
  console.log(data);
});

//stores the local player name
var ourPlayer = null;
var objImage = null;

//adds a player using the id provided
function addPlayer(id) {
  //create an image and set the id, image and alt text
  var img = document.createElement('img');
  img.id = id;
  img.src = '/static/blueStanding.png';
  img.alt = 'standing';
  //position absolute is useful for placing it in the canvas, avoids errors.
  img.style.position='absolute';
  //positions the sprite top left at first
  img.style.left='0px';
  img.style.top='0px';

  //add the player class
  img.classList.add('player');

  //add the image to the container
  document.getElementById('container').appendChild(img);

  //return it for use later
  return img;
}


//sent by the server so the client knows its name
socket.on('name', function(data) {
  //set our player name
  ourPlayer = data;
  //sets previously defined variable to the image in the html which i have called "blue" for now
  objImage=addPlayer(data);
});

//stores local x and y
var movement = {
  x: 0,
  y: 0
};

//detects key down, raises interrupt
document.onkeydown = function(e) {
    //switch case statement checking for different keycodes to find what key is pressed
    switch(e.keyCode){
      case (71 && 65 && 89) :
        alert("gay");
        break;
      //if right arrow key is pressed
      case 39:
        //call moveRight function
        moveRight();
        //if no break, it moves diagonally upwards. So break is very important
        break;
        //if up key is pressed
      case 38:
        //changes css to move sprite up gradually, 7.5 changes speed.
        objImage.style.top = (parseInt(objImage.style.top) || 0) - 7.5 + 'px';
        movement.y -= 7.5;
        //break is once again very important
        break;
      //if left key is pressed
      case 37:
      //call moveLeft function
      moveLeft();
      //break is important. Movement goes really wrong if not with break.
      break;
      //if down key is pressed
      case 40:
      objImage.style.top = (parseInt(objImage.style.top) || 0) + 7.5 + 'px';
      movement.y += 7.5;
      break;
      //if space key is pressed
      case 32:
      //call the strike function.
      strike();

}

}

//the strike function, this is called when player presses space to attack
function strike()
 {
    //tell the server we're stabbing
    socket.emit('strike');
    //sets image variable to the blue image we had originally
    image = document.getElementById(ourPlayer);
    //changes the image source to blueStrike image
    image.src = "/static/blueStrike.png";
    //waits 500ms to change image back, gives animation of striking
    setTimeout(function(){image.src = "/static/blueStanding.png"}, 500);
 }

//called when player presses right arrow key
function moveRight() {
  //flips image to face the other way, saves storage as we don't need another image
  objImage.style.transform = 'scaleX(-1)';
  walk();
  movement.x += 7.5;
  //moves right the same way we move up and down
  objImage.style.left = (parseInt(objImage.style.left) || 0) + 7.5 + 'px';
}

//called when player presses the left arrow key
function moveLeft() {
  //flips image back to original facing left
  objImage.style.transform = 'scaleX(+1)';
  walk();
  movement.x -= 7.5;
  //moves sprite left
  objImage.style.left = (parseInt(objImage.style.left) || 0) - 7.5 + 'px';
}

function walk() {
  //similar as strike function, receives blue from html
  image = document.getElementById(ourPlayer);
  //changes image to moving
  image.src = "/static/blueMoving.png";
    //changes back in 30ms, looks like the sprite is walking
  setTimeout(function(){image.src = "/static/blueStanding.png"}, 30);
}

//tells the server there is a new player
socket.emit('new player');

//sends the server our position every 16.6ms
setInterval(function() {
  socket.emit('movement', movement);
}, 1000 / 60);

//state is the update from the server
socket.on('state', function(players) {
  //loop through all the player names
  for(var name in players) {
    //if the player is the local player skip it because we handle movement locally
    if(name == ourPlayer) {
      continue;
    }

    //get the player from the array
    var player = players[name];

    //initialize playerImg variable
    var playerImg;

    //if the document has the image already use it
    if(document.getElementById(name)) {
      playerImg = document.getElementById(name);

    //otherwise add a new player to the document
    } else {
      playerImg = addPlayer(name);
    }

    //set the images x and y to the data provided from the server
    playerImg.style.left = player.x + 'px';
    playerImg.style.top = player.y + 'px';
  }
});
