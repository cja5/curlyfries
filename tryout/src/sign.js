//Game object sign, used just for texts on the map
class Sign extends GameObject {
    constructor(game, x, y, colour, text) {
        super(game, x, y);
        this.fillStyle = colour;
        this.text = text;
    }
    //Draws sings
    update(ctx) {
        ctx.fillStyle = this.fillStyle;
        ctx.font = "100px Arial";
        ctx.fillText(this.text, this.actual.x, this.actual.y);
    }
}