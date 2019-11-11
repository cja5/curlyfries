class Wall extends GameObject {
    constructor(game, x, y) {
        super(game, x, y);
        this.width = 50;
        this.height = 500;
    }

    update(ctx) {
        ctx.fillStyle = "black";
        ctx.fillRect(this.actual.x, this.actual.y, this.width, this.height);
    }
}