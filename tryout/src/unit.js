class Unit {

    constructor(game, x, y) {
        this.game = game;
        this.canvasHeight = game.canvasHeight;
        this.canvasLength = game.canvasLength;
        this.image = document.getElementById("blue_idle_right");
        this.width = 75;
        this.height = 100;
        this.speed = 5;
        this.side = true;
        this.movement = {
            x: 0,
            y: 0,
        };
        
        this.position = {
            x: x,
            y: y
        };

    }

    check() {  
        if (this.movement.x === 0 && this.movement.y === 0) {
            if(this.side) {
                this.image = document.getElementById("blue_idle_right");
            } else {
                this.image = document.getElementById("blue_idle_left");
            }
        }
    }


    move() {
        if(this.side) {
            this.image = document.getElementById("blue_right");
        } else {
            this.image = document.getElementById("blue_left");
        }
    }

    update(ctx) {
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }

    moveUp() {
        this.movement.y = -this.speed;
        this.move();
    }

    stopUp() {
        if(this.movement.y < 0) 
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

    attack() {
        if (this.movement.x !== 0 || this.movement.y !== 0) return;

        if (this.side) {
        this.image = document.getElementById("blue_strike_right");
        } else {
            this.image = document.getElementById("blue_strike_left");
        }
        let attack = new Attack(game);
        attack.hit();
    }

    changePos() {
        this.position.y += this.movement.y;
        this.position.x += this.movement.x;

        if (this.position.y < 0) {
            this.position.y = 0;
        }
        if (this.position.y > this.canvasHeight-this.height) {
            this.position.y = this.canvasHeight-this.height;
        }
        if (this.position.x < 0) {
            this.position.x = 0;
        }
        if (this.position.x > this.canvasLength-this.width) {
            this.position.x = this.canvasLength-this.width;
        }
    }
}