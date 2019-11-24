class PowerUp extends GameObject{
    constructor(game, x, y, number) {
        super(game, x, y);
        this.width = 50;
        this.height = 50;
        this.fillStyle = "#00FF00";
        this.active = true;     //If false, powerup is not being drawn
        this.number = number;
    }
    //Draws an object, uses actual x and y values
    update(ctx) {
        if (this.active) {
            ctx.fillStyle = this.fillStyle;
            ctx.fillRect(this.actual.x, this.actual.y, this.width, this.height);
        }
    }
}
//Gives temporary invulnerability
class Shield extends PowerUp {
    constructor(game, x, y, number) {
        super(game, x, y, number);
        this.fillStyle = "Blue";
    }
}
//Restores hp
class HealthPot extends PowerUp {
    constructor(game, x, y, number) {
        super(game, x, y, number);
        this.fillStyle = "Green";
    }
}