let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");


let game = new Game(canvas);

//Gets current height and width of a client
let height = document.documentElement.clientHeight;
let width = document.documentElement.clientHeight;

 function loop() {
    //Updates it in case any changes occur
    let height = document.documentElement.clientHeight;
    let width = document.documentElement.clientWidth;

    ctx.canvas.height = height;
    ctx.canvas.width = width;
    //Clears the canvas and updates everything on it
    ctx.clearRect(0, 0, width, height);
    game.changePos();
    game.update(ctx);
    
    requestAnimationFrame(loop);  //Basically a redraw function
  }

  loop();
