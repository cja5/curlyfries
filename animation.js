// initialises variable globally, it is necessary as it points to the image that will
// be animated, accessed by many different functions, could try a getter and setter method?
var objImage = null;

//function that is called as soon as window is loaded up
function init(){
  //sets previously defined variable to the image in the html which i have called "blue" for now
  objImage=document.getElementById("blue");
  //position absolute is useful for placing it in the canvas, avoids errors.
  objImage.style.position='absolute';
  //positions the sprite top left at first
  objImage.style.left='0px';
  objImage.style.top='0px';
}


//detects key down, raises interrupt
document.onkeydown = function(e) {
    //switch case statement checking for different keycodes to find what key is pressed
    switch(e.keyCode){
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
      //move sprite down, once again 7.5 changes speed
      objImage.style.top = (parseInt(objImage.style.top) || 0) + 7.5 + 'px';
      //if space key is pressed
      case 32:
      //call the strike function.
      strike();

}

}

//the strike function, this is called when player presses space to attack
function strike()
 {
    //sets image variable to the blue image we had originally
    image = document.getElementById('blue');
    //changes the image source to blueStrike image
    image.src = "blueStrike.png";
    //waits 500ms to change image back, gives animation of striking
    setTimeout(function(){image.src = "blueStanding.png"}, 500);
 }

//called when player presses right arrow key
function moveRight() {
  //flips image to face the other way, saves storage as we don't need another image
  objImage.style.transform = 'scaleX(-1)';
  walk();
  //moves right the same way we move up and down
  objImage.style.left = (parseInt(objImage.style.left) || 0) + 7.5 + 'px';
}

//called when player presses the left arrow key
function moveLeft() {
  //flips image back to original facing left
  objImage.style.transform = 'scaleX(+1)';
  walk();
  //moves sprite left
  objImage.style.left = (parseInt(objImage.style.left) || 0) - 7.5 + 'px';
}

function walk() {
    //similar as strike function, receives blue from html
  image = document.getElementById('blue');
  //changes image to moving
  image.src = "blueMoving.png";
    //changes back in 30ms, looks like the sprite is walking
  setTimeout(function(){image.src = "blueStanding.png"}, 30);
}
//as soon as window is loaded will initialise
window.onload=init;
