//Main unit class
class Unit {

    constructor(game, x, y, name) {
        this.game = game;
        this.name = name;
        this.image = document.getElementById("blue_idle_right");
        this.width = 80;
        this.height = 100;
        this.speed = 5;
        this.side = true;  //True = right, False = left
        this.moving = false;
        this.alive = true;
        this.count = 0;     //Used for running animation
        this.count2 = 0;   //Used for power up timer
        this.count3 = 0;  //Used for respawn time
        this.idleRight = document.getElementById("blue_idle_right");
        this.idleLeft = document.getElementById("blue_idle_left");
        this.goRight = document.getElementById("blue_right");
        this.goLeft = document.getElementById("blue_left");
        this.strikeLeft = document.getElementById("blue_strike_left");
        this.strikeRight = document.getElementById("blue_strike_right");
        this.maxHealth = 5;
        this.health = 1;
        this.nameTag = new NameTag(this);
        this.healthBar = new HealthBar(this);
        this.shield = new Power(this);
        //respawn coordinates
        this.respawn = {
            x: x,
            y: y
        }
        //Speed of a unit
        this.movement = {
            x: 0,
            y: 0,
        };
        //Position in the game
        this.position = {
            x: x,
            y: y
        };
        //Position on the screen
        this.actual = {
            x:0,
            y:0
        };

        this.poweredUp = false;

    }
    //Check for standing still, changes running animation back to being idle
    check() {  
        if (this.movement.x === 0 && this.movement.y === 0) {
            this.moving = false;
            if(this.side) {
                this.image = this.idleRight;
            } else {
                this.image = this.idleLeft;
            }
        }
    }
    //Used to animate a unit during movement
    animate() {
        if(this.count>6) {
            this.count = 0;
            if(this.side) { //True = right
                if(this.image===this.idleRight) { //Idle changed to a moving sprite
                    this.image = this.goRight;   //Moving - to idle
                } else {
                    this.image = this.idleRight;
                }
            } else {
                if (this.image===this.idleLeft) {
                    this.image = this.goLeft;
                } else {
                    this.image = this.idleLeft;
                }
            }
        }
    }


    move() {
        this.moving = true;
    }
    //Update function, draws a unit
    update(ctx) {
        if (this.alive) {
        this.count++;  //Counts are used for animations
        if (this.moving) {  //If true, animates the unit and checks for collisions
            this.animate();
            this.game.gameObjects.forEach((gameObject) => this.detectCollisions(gameObject));
        }
        //draw command, uses actual x and y
        ctx.drawImage(this.image, this.actual.x, this.actual.y, this.width, this.height);
        this.nameTag.update(ctx);
        this.healthBar.update(ctx);
        if(this.poweredUp) { //Shield power up timer
            this.shield.update(ctx);
            this.count2++;
            if (this.count2 > 300) {
                this.poweredUp = false;
            }
        }
        } else { //Respawn timer basically
            if(this.count3>100) {
                this.health = this.maxHealth;
                this.alive = true;
                this.count3 = -1;
                this.position = {
                    x: this.respawn.x,
                    y: this.respawn.y
                }
            }
            this.count3++
          }
    }

    detectCollisions(gameObject) {
        if (collisionDetector(this, gameObject)) {
        //complicated check which side of wall was touched
        if (gameObject instanceof Wall) {
            //top
            if (this.position.y > gameObject.position.y-this.height
                && this.position.y+this.height < gameObject.position.y+this.speed+1) {
                this.position.y = gameObject.position.y-this.height;
            }
            //bottom
            if (this.position.y < gameObject.position.y+gameObject.height
                && this.position.y > gameObject.position.y+gameObject.height-(this.speed+1)) {
                this.position.y = gameObject.position.y+gameObject.height;
            } 
            //right side
            if (this.position.x > gameObject.position.x-this.width
                && this.position.x < gameObject.position.x+this.speed+1
                && this.position.y + this.height > gameObject.position.y+this.speed+1
                && this.position.y < gameObject.position.y+gameObject.height-(this.speed+1) ) {
                this.position.x = gameObject.position.x-this.width;
            }
            //left side
            if (this.position.x < gameObject.position.x+gameObject.width
                && this.position.x > gameObject.position.x-this.speed+1
                && this.position.y + this.height > gameObject.position.y+this.speed+1
                && this.position.y < gameObject.position.y+gameObject.height-(this.speed+1)) {
                this.position.x = gameObject.position.x+gameObject.width;
            }
           }
           if (gameObject instanceof Shield) {
                this.poweredUp = true;  //Makes the unit go super saiyan
                this.count2 = 0;
           }
           if (gameObject instanceof HealthPot) {
                this.health = this.maxHealth;
           }
        }
    }

    moveUp() {
        this.movement.y = -this.speed;
        this.move();
    }

    stopUp() {
        if(this.movement.y < 0) //Changes speed to 0 only when unit goes up
        this.movement.y = 0;
        this.check();
    }

    moveDown() {
        this.movement.y = this.speed;
        this.move();
    }

    stopDown() {
        if(this.movement.y > 0) 
        this.movement.y = 0;
        this.check();
    }
    
    moveLeft() {
        this.movement.x = -this.speed;
        this.side = false;
        this.move();
    }

    stopLeft() {
        if(this.movement.x < 0) 
        this.movement.x = 0;
        this.check();
    }
    
    moveRight() {
        this.movement.x = this.speed;
        this.side = true;
        this.move();
    }

    stopRight() {
        if(this.movement.x > 0) 
        this.movement.x = 0;
        this.check();
    }
    //Attack is only possible when unit is standing still
    attack() {
        if (this.movement.x !== 0 || this.movement.y !== 0) return;

        if (this.side) {
        this.image = this.strikeRight;
        } else {
            this.image = this.strikeLeft;
        }
        let attack = new Attack(this.game, this); //Creates a new attack object
        attack.hit();                            //And checks if it hit
    }
    //Changes unit position in the game
    changePos() {
        this.position.y += this.movement.y;
        this.position.x += this.movement.x;
        //Restricts walkable zone
        this.checkBorder();

        if(!this.alive) {
            this.position.y = -100;
        }
    }

    checkBorder() {
        if (this.position.y < this.game.border.position.y) {
            this.position.y = this.game.border.position.y;
        }
        if (this.position.y > this.game.border.height-this.height) {
            this.position.y = this.game.border.height-this.height;
        }
        if (this.position.x < this.game.border.position.x) {
            this.position.x = this.game.border.position.x;
        }
        if (this.position.x > this.game.border.width-this.width) {
            this.position.x = this.game.border.width-this.width;
        }
    }
    //Updates unit position on the screen
    updateCamera() {
        this.actual = {
            x: this.position.x - this.game.camera.position.x,
            y: this.position.y - this.game.camera.position.y
        };
    }
}