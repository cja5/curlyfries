//Map border
class Border {
    constructor(game) {
        this.game = game;
        this.width = 4000;   //Game width
        this.height = 2000;  //Game heigth
        //position on the map
        this.position = {
            x:0,
            y:100
        }
        //position on the screen
        this.actual = {
            x:0,
            x:0
        }
    }
    //draw method, draws a rectangle around playable map
    update(ctx) {
        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.rect(this.actual.x, this.actual.y, this.width, this.height);
        ctx.stroke();
    }
    //updates it's position on screen
    updateCamera() {
        this.actual = {
            x: this.position.x - this.game.camera.position.x,
            y: this.position.y - this.game.camera.position.y
        };
    }
}