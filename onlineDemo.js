
  //init object globally
  var objImage = null;

  function init(){
    objImage=document.getElementById("animate");
    objImage.style.position='relative';
    objImage.style.left='0px';
    objImage.style.top='0px';
  }

//detects key press from html and checks which key
document.onkeydown = function(e) {
    switch(e.keyCode){
      case 37: //left arrow key
        moveLeft();
        break;
      case 38: //Up arrow key
        moveUp();
        break;
      case 39: //right arrow key
        moveRight();
        break;
      case 40: //down arrow key
        moveDown();
        break;
      case 32: //space key
        change();

    }
  }

  //number changes speed
  function moveLeft(){
    objImage.style.left=parseInt(objImage.style.left)-7.5 +'px';
  }
  function moveUp(){
    objImage.style.top=parseInt(objImage.style.top)-7.5 +'px';
  }
  function moveRight(){
    objImage.style.left=parseInt(objImage.style.left)+7.5+'px';
  }
  function moveDown(){
    objImage.style.top=parseInt(objImage.style.top)+7.5 +'px';
  }
  function change(){
    //changes box colour
    objImage.style.background = "blue";
    //waits for 500ms then changes back into original colour
    setTimeout(function(){objImage.style.background = "red"}, 500);
  }


  //as soon as window is loaded will initialise
  window.onload=init;
