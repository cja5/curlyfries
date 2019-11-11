class GameObject {
    constructor(game, x, y) {
        this.game = game;
        //Position in the game
        this.position = {
            x: x,
            y: y
        };

        //Position on the screen
        this.actual = {
            x:0,
            y:0
        };
    }

    update(ctx) {

    }

    //Updates actual values
    updateCamera() {
        this.actual = {
            x: this.position.x - this.game.camera.position.x,
            y: this.position.y - this.game.camera.position.y
        };
    }
}