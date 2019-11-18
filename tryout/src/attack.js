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
        this.swing = document.getElementById("swing");
        this.swing.volume = 0.1;
    }
    //Checks if this dot collides with another unit
    hit () {
        this.swing.play();
        game.enemies.forEach((enemy) => this.checkHit(enemy));
        }

    checkHit(enemy) {
        if (this.x >= enemy.position.x 
            && this.x <= enemy.position.x + enemy.width
            && this.y >= enemy.position.y 
            && this.y <= enemy.position.y + enemy.height) {
                if(enemy.poweredUp === false) { //If enemy is powered up, negate all damage
                    enemy.health--;
                }
                if(enemy.health === 0) { //If enemy has 0 health, they die
                    enemy.alive = false;
                    this.game.score+=1;
                }
            }
        }
    }