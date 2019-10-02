//move right code with right arrow
$(document).keydown(function(e){
if (e.keyCode==39)
    myMove();
});

$(document).keydown(function(e){
if (e.keyCode==37)
    $("body").append("<p>move left</p>");
});

$(document).keydown(function(e){
if (e.keyCode==38)
    $("body").append("<p>up up</p>");
});

$(document).keydown(function(e){
if (e.keyCode==32)
    $("body").append("<p>space</p>");
});

/*function from w3schools javascript animation tutorial, i'm editing it to work out
what it all means */

function myMove() {
  //gets the element from html document called "animate"
  var elem = document.getElementById("animate");
  //ensures it flows naturally from the top corner
  var pos = 0;
  //sets speed at which the box flows
  var id = setInterval(frame, 5);
  function frame() {
      //makes box move VERY IMPORTANT
      pos++;
      //make it move, decides where it starts
      elem.style.top = pos + "px";
      elem.style.left = pos + "px";
      if (pos > 4) {
      clearInterval(id);
    }

  }
}
