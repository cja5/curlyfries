//Wall class, draws an interactive wall
class Wall extends GameObject {
    constructor(game, x, y, width, height) {
        super(game, x, y);
        this.width = width;
        this.height = height;
    }

    update(ctx) {
        ctx.fillStyle = "black";
        ctx.fillRect(this.actual.x, this.actual.y, this.width, this.height);
    }
}