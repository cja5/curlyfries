    //Main unit class
    class Unit {

        constructor(game, x, y, name, socket) {
            this.socket = socket;
            this.number = 0;  //unit's own player number
            this.game = game;
            this.name = name;
            this.image = document.getElementById("blue_idle_right");
            this.width = 80;
            this.height = 100;
            this.speed = 5;
            this.side = true;  //True = right, False = left
            this.moving = false;
            this.alive = true;
            this.mouseMovement = false;
            this.count = 0;     //Used for running animation
            this.idleRight = document.getElementById("blue_idle_right");
            this.idleLeft = document.getElementById("blue_idle_left");
            this.goRight = document.getElementById("blue_right");
            this.goLeft = document.getElementById("blue_left");
            this.strikeLeft = document.getElementById("blue_strike_left");
            this.strikeRight = document.getElementById("blue_strike_right");
            this.maxHealth = 5;
            this.health = 5;
            this.nameTag = new NameTag(this);
            this.healthBar = new HealthBar(this);
            this.shield = new Power(this);
            //respawn coordinates
            this.respawn = {
                x: x,
                y: y
            };
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
            //required for mouse movement
            this.movingTo = {
                x:0,
                y:0
            };

            this.poweredUp = false;
            this.playerPoweredUp = false;

        }
        //Check for standing still, changes running animation back to being idle
        check() {  
            if (this.movement.x === 0 && this.movement.y === 0) {
                if(this.game.player.unit === this) {
                    this.socket.emit('Desync check', this.number, 0, 0, this.side);
                }
                this.moving = false;
                this.mouseMovement = false;
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
            }
            }
            if(this.mouseMovement) {
                this.mouseCheck();
            }
            if (this.playerPoweredUp) {
                this.socket.emit('Shield timer', this.number, this.game.player.shieldTimer);
            }
        }

        respawned() {
            this.health = this.maxHealth;
            this.alive = true;
            this.position = {
                x: this.respawn.x,
                y: this.respawn.y
            };
        }

        detectCollisions(gameObject) {
            if (collisionDetector(this, gameObject)) {
            //complicated check which side of wall was touched
            if (gameObject instanceof Wall) {
                //top
                if (this.position.y > gameObject.position.y-this.height &&
                    this.position.y+this.height < gameObject.position.y+this.speed*2) {
                    this.position.y = gameObject.position.y-this.height;
                }
                //bottom
                if (this.position.y < gameObject.position.y+gameObject.height &&
                    this.position.y > gameObject.position.y+gameObject.height-(this.speed*2)) {
                    this.position.y = gameObject.position.y+gameObject.height;
                } 
                //right side
                if (this.position.x > gameObject.position.x-this.width &&
                    this.position.x < gameObject.position.x+this.speed*2 &&
                    this.position.y + this.height > gameObject.position.y+this.speed*2 &&
                    this.position.y < gameObject.position.y+gameObject.height-(this.speed*2) ) {
                    this.position.x = gameObject.position.x-this.width;
                }
                //left side
                if (this.position.x < gameObject.position.x+gameObject.width &&
                    this.position.x > gameObject.position.x-this.speed*2 &&
                    this.position.y + this.height > gameObject.position.y+this.speed*2 &&
                    this.position.y < gameObject.position.y+gameObject.height-(this.speed*2)) {
                    this.position.x = gameObject.position.x+gameObject.width;
                }
            }
            if (gameObject instanceof Shield) {
                if (this === this.game.player.unit) {
                        this.poweredUp = true;  //Makes the unit go super saiyan
                        this.playerPoweredUp = true;
                        gameObject.active = false;
                        this.socket.emit('Shield taken', this.number, gameObject.number);
                }
            }
            if (gameObject instanceof HealthPot) {
                if (this === this.game.player.unit) {
                    this.health = this.maxHealth;
                    this.socket.emit('Health', this.number, this.maxHealth);
                    gameObject.active = false;
                    this.socket.emit('Health taken', this.number, gameObject.number);
                }
            }
            }
        }
        //After mouse click
        moveToClicked(x, y) {
            this.movingTo.x = this.position.x+(x-this.actual.x);
            this.movingTo.y = this.position.y+(y-this.actual.y);
            this.socket.emit('Click move', this.number, this.movingTo.x, this.movingTo.y);
            this.moveToClick(this.movingTo.x, this.movingTo.y);
        }
        moveToClick(x, y) {
            this.movingTo.x = x;
            this.movingTo.y = y;
            this.mouseMovement = true;
            this.moveTo();
        }
        //Method for mouse movement
        moveTo() {
            this.move();
            if(this.position.x+this.width/2 > this.movingTo.x) {
                this.movement.x = -this.speed;
                this.side = false;
            } if(this.position.x+this.width/2 < this.movingTo.x) {
                this.movement.x = this.speed;
                this.side = true;
            }
            if(this.position.y+this.height/2 > this.movingTo.y) {
                this.movement.y = -this.speed;
            } if(this.position.y+this.height/2 < this.movingTo.y) {
                this.movement.y = this.speed;
            }
        }
        //Stops the unit when needed
        mouseCheck() {
            if(this.position.x+this.width/2 > this.movingTo.x-5 && 
            this.position.x+this.width/2 < this.movingTo.x+5) {
                    this.movement.x = 0;
                    this.check();
                    this.socket.emit('Desync check', this.number, this.movement.x, this.movement.y, this.side);
            } if (this.position.y+this.height/2 > this.movingTo.y-5 && 
                this.position.y+this.height/2 < this.movingTo.y+5) {
                this.movement.y = 0;
                this.check();
                this.socket.emit('Desync check', this.number, this.movement.x, this.movement.y, this.side);
            }
        }

        moveUpNext() {
            this.movement.y = -this.speed;
            this.move();
        }

        moveUp() {
            this.socket.emit('Move up', this.number);
            this.moveUpNext();
        }

        stopUpNext() {
            if(this.movement.y < 0) //Changes speed to 0 only when unit goes up
            this.movement.y = 0;
            this.check();
        }

        stopUp() {
            this.socket.emit('Stop up', this.number);
            this.stopUpNext();
        }

        moveDownNext() {
            this.movement.y = this.speed;
            this.move();
        }

        moveDown() {
            this.socket.emit('Move down', this.number);
            this.moveDownNext();
        }

        stopDownNext() {
            if(this.movement.y > 0) 
            this.movement.y = 0;
            this.check();
        }

        stopDown() {
            this.socket.emit('Stop down', this.number);
            this.stopDownNext();
        }
        
        moveLeftNext() {
            this.movement.x = -this.speed;
            this.side = false;
            this.move();
        }

        moveLeft() {
            this.socket.emit('Move left', this.number);
            this.moveLeftNext();
        }

        stopLeftNext() {
            if(this.movement.x < 0) 
            this.movement.x = 0;
            this.check();
        }

        stopLeft() {
            this.socket.emit('Stop left', this.number);
            this.stopLeftNext();
        }
        
        moveRightNext() {
            this.movement.x = this.speed;
            this.side = true;
            this.move();
        }

        moveRight() {
            this.socket.emit('Move right', this.number);
            this.moveRightNext();
        }

        stopRightNext() {
            if(this.movement.x > 0) 
            this.movement.x = 0;
            this.check();
        }

        stopRight() {
            this.socket.emit('Stop right', this.number);
            this.stopRightNext();
        }
        //Attack is only possible when unit is standing still
        attackNext() {
            if (this.movement.x !== 0 || this.movement.y !== 0) return 0;

            if (this.side) {
            this.image = this.strikeRight;
            } else {
                this.image = this.strikeLeft;
            }
            let attack = new Attack(this.game, this, this.socket); //Creates a new attack object
            return attack.hit();                                  //And checks if it hit
        }

        attack() {
            this.socket.emit('Attack', this.number);
            var scoreChange = this.attackNext();
            if(scoreChange !== 0) {
                this.socket.emit('Score change', this.number, scoreChange);
            }
        }

        checkAttack() {
            this.socket.emit('Check attack', this.number);
            this.check();
        }
        //Changes unit position in the game
        changePos(delta) {
            var deltaTime = delta/20;
            this.position.y += this.movement.y*deltaTime;
            this.position.x += this.movement.x*deltaTime;
            if(this.game.player.unit === this && this.moving) {
                this.socket.emit('Change position', this.number, this.position.x, this.position.y);
            }
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