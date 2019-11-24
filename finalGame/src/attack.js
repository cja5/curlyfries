class Attack {
    //Creates a dot presumably at the tip of the blade
    constructor(game, unit, socket) {
        this.unit = unit;                                      //Attacking unit
        this.game = game;                                     //Game
        this.socket = socket;                                //Multiplayer socket
        this.side = this.unit.side;                         //Side of the attacking unit
        this.y = this.unit.position.y+50;                  //Middle of attacker's height
        if (this.side) {                                  //Check for attacker's side
            this.x = this.unit.position.x+75;            
        } else {
            this.x = this.unit.position.x-5;
        }
        this.swing = document.getElementById("swing"); //Audio
        this.swing.volume = 0.1;                      //Audio volume, cause it's quite loud
        this.score = 0;                              //Value to return, holds amount of players killed in one swing
    }
    //Checks if this dot collides with another unit
    hit () {
        this.score = 0;
        if(this.unit instanceof RedUnit) { //Check the team
            this.swing.play();            //Play the audio upon swing
            this.game.blueTeam.forEach((enemy) => this.checkHit(enemy));
        }else if(this.unit instanceof BlueUnit) { //Check the team
            this.swing.play();                   //Play the audio upon swing
            this.game.redTeam.forEach((enemy) => this.checkHit(enemy));
        } return this.score;               //Returns number of kills
    }
    //Checks for actual collisions
    checkHit(enemy) {
        if (this.x >= enemy.position.x 
            && this.x <= enemy.position.x + enemy.width
            && this.y >= enemy.position.y 
            && this.y <= enemy.position.y + enemy.height) {
                if(enemy.poweredUp === false && enemy.alive === true) { //If enemy is powered up or dead, negate all damage
                    enemy.health--;            //If not, remove 1 hp
                    this.socket.emit('Health', enemy.number, enemy.health); //Sync hp loss on every client
                }
                if(enemy.health <= 0) { //If enemy has 0 health, they die
                    enemy.alive = false;
                    this.socket.emit('Death', enemy.number); //Sync death on every client
                    this.score++;                           //Add to kill count
                }
            }
        }
    }