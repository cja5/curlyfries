class PowerUp {
    constructor(game) {
        this.game = game;
        this.width = 50;
        this.height = 50;
        this.fillStyle = "#00FF00";

        //Position in the game
        this.position = {
            x: 900,
            y: 50
        };
        //Position on the screen
        this.actual = {
            x:0,
            y:0
        };
    }
    //Draws an object, uses actual x and y values
    update(ctx) {
        ctx.fillStyle = this.fillStyle;
        ctx.fillRect(this.actual.x, this.actual.y, this.width, this.height);
    }
    //Updates an actual values
    updateCamera() {
        this.actual = {
            x: this.position.x - this.game.camera.position.x,
            y: this.position.y - this.game.camera.position.y
        };
    }
}