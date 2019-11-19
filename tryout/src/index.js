let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let menu = new Menu();
let mouse = {
  x:0,
  y:0
}
window.onmousemove = mouseMovement;
window.onmousedown = mouseClick;
//Gets current height and width of a client
let height = document.documentElement.clientHeight;
let width = document.documentElement.clientHeight;

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
