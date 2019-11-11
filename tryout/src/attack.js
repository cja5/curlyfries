class Attack {
    //Creates a dot presumably at the tip of the blade
    constructor(game) {
        this.game = game;
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
        game.enemies.forEach((enemy) => this.checkHit(enemy));
        }

    checkHit(enemy) {
        if (this.x >= enemy.position.x 
            && this.x <= enemy.position.x + enemy.width
            && this.y >= enemy.position.y 
            && this.y <= enemy.position.y + enemy.height) {
                enemy.alive = false;
                this.game.score+=1;
            }
        }
    }