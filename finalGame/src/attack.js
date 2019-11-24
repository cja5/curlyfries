class Attack {
    //Creates a dot presumably at the tip of the blade
    constructor(game, unit, socket) {
        this.unit = unit;
        this.game = game;
        this.socket = socket;
        this.side = this.unit.side;
        this.y = this.unit.position.y+50;
        if (this.side) {
            this.x = this.unit.position.x+70;
        } else {
            this.x = this.unit.position.x-5;
        }
        this.swing = document.getElementById("swing");
        this.swing.volume = 0.1;
        this.score = 0;
    }
    //Checks if this dot collides with another unit
    hit () {
        this.score = 0;
        if(this.unit instanceof RedUnit) { //Check the team
            this.swing.play();
            this.game.blueTeam.forEach((enemy) => this.checkHit(enemy));
        }else if(this.unit instanceof BlueUnit) { //Check the team
            this.swing.play();
            this.game.redTeam.forEach((enemy) => this.checkHit(enemy));
        } return this.score;
    }

    checkHit(enemy) {
        if (this.x >= enemy.position.x && 
            this.x <= enemy.position.x + enemy.width && 
            this.y >= enemy.position.y &&
            this.y <= enemy.position.y + enemy.height) {
                if(enemy.poweredUp === false) { //If enemy is powered up, negate all damage
                    enemy.health--;
                    this.socket.emit('Health', enemy.number, enemy.health);
                }
                if(enemy.health <= 0) { //If enemy has 0 health, they die
                    enemy.alive = false;
                    this.socket.emit('Death', enemy.number);
                    this.score++;
                }
            }
        }
    }