//Map border
class Border {
    constructor(game) {
        this.game = game;
        this.width = 4000;
        this.height = 2000;
        
        this.position = {
            x:0,
            y:100
        }

        this.actual = {
            x:0,
            x:0
        }
    }

    update(ctx) {
        ctx.beginPath();
        ctx.rect(this.actual.x, this.actual.y, this.width, this.height);
        ctx.stroke();
    }

    updateCamera() {
        this.actual = {
            x: this.position.x - this.game.camera.position.x,
            y: this.position.y - this.game.camera.position.y
        };
    }
}