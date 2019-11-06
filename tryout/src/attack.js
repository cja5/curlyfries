class Attack {
    //Creates a dot presumably at the tip of the blade
    constructor(game) {
        this.side = game.unit.side;
        this.y = game.unit.position.y+50;
        if (this.side) {
            this.x = game.unit.position.x+70;
        } else {
            this.x = game.unit.position.x-5;
        }
    }
    //Checks if this dot collides with another unit
    hit () {
        if (this.x >= game.un.position.x 
            && this.x <= game.un.position.x + game.un.width
            && this.y >= game.un.position.y 
            && this.y <= game.un.position.y + game.un.height) {
                alert("HIT");
        }
    }
}