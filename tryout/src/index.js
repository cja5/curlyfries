let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let CANVAS_HEIGHT = 800;
let CANVAS_LENGTH = 1000;


let game = new Game(CANVAS_LENGTH, CANVAS_HEIGHT);
game.start();

 function loop() {

    ctx.clearRect(0, 0, CANVAS_LENGTH, CANVAS_HEIGHT);
    game.changePos();
    game.update(ctx);
    requestAnimationFrame(loop);
  }

  loop();
