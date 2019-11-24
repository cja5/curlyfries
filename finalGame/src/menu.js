//Starting menu
class Menu {
    constructor(socket) {
        this.socket = socket;
        this.game = null; //Create future game variable
        this.gameStarted = false; //Game state
        this.text1 = "Join game as:";
        this.text2 = "Red team";
        this.text3 = "Blue team";
        this.text4 = "Spectator";
        this.text5 = "#1";
        this.text6 = "Epic Victory Royale";
        this.text7 = "Red Victory";
        this.text8 = "Blue Victory";
        this.text9 = "Tap anywhere to continue";
        this.x = 0; //Mouse x
        this.y = 0; //Mouse y
        this.state = 0;  //Menu state
        this.winner = true;
    
    }

    update(ctx, x, y) {
        this.x = x; //update mouse x
        this.y = y; //update mouse y
        if(this.state === 0) {
            if(!this.gameStarted) { //If game has started, update game only instead
                //A bunch of stuff to draw
                ctx.fillStyle = "black";
                ctx.font = "30px Arial";
                ctx.fillText(this.text1, document.documentElement.clientWidth/2-ctx.measureText(this.text1).width/2, 70);
                ctx.fillStyle = "Red";
                if(this.checkMouse(x, y, 100)) {
                        ctx.fillStyle = "Green";
                    }
                ctx.fillRect(document.documentElement.clientWidth/2-150, 100, 300, 50);
                ctx.fillStyle = "Blue";
                if(this.checkMouse(x, y, 200)) {
                    ctx.fillStyle = "Green";
                }
                ctx.fillRect(document.documentElement.clientWidth/2-150, 200, 300, 50);
                ctx.fillStyle = "Gray";
                if(this.checkMouse(x, y, 300)) {
                    ctx.fillStyle = "Green";
                }
                ctx.fillRect(document.documentElement.clientWidth/2-150, 300, 300, 50);
                ctx.fillStyle = "White";
                ctx.fillText(this.text2, document.documentElement.clientWidth/2-ctx.measureText(this.text2).width/2, 135);
                ctx.fillText(this.text3, document.documentElement.clientWidth/2-ctx.measureText(this.text3).width/2, 235);
                ctx.fillText(this.text4, document.documentElement.clientWidth/2-ctx.measureText(this.text4).width/2, 335);
            } else { //If gameStarted == true, then everything above is skipped
                this.game.changePos();
                this.game.update(ctx);
            }
        } else if (this.state == 1 || this.state == 2) {
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, document.documentElement.clientWidth, document.documentElement.clientHeight);
            ctx.fillStyle = "white";
            ctx.font = "100px Arial";
            if (this.state == 1) {
                ctx.fillText(this.text5, document.documentElement.clientWidth/2, 200);
                ctx.fillText(this.text6, document.documentElement.clientWidth/2-ctx.measureText(this.text6).width/2, 300);
            } else {
                if(this.winner) {
                    ctx.fillText(this.text7, document.documentElement.clientWidth/2-ctx.measureText(this.text7).width/2, 300);
                } else {
                    ctx.fillText(this.text8, document.documentElement.clientWidth/2-ctx.measureText(this.text8).width/2, 300);
                }
            }
            ctx.font = "30px Arial";
            ctx.fillText(this.text9, document.documentElement.clientWidth/2-ctx.measureText(this.text9).width/2, 400);
        }
    }
    //Mouse click function
    click() {
        if (this.state === 0) {
            if(this.gameStarted) {
                this.game.click(this.x, this.y);
            }
            else { //If game has started, this is not required
                if(this.checkMouse(this.x, this.y, 100)) {
                    this.red();
                } else if(this.checkMouse(this.x, this.y, 200)) {
                    this.blue();
                } else if(this.checkMouse(this.x, this.y, 300)) {
                    this.spectator();
                }
            }
        } else {
            this.state = 0;
        }
    }

    checkMouse(x, y, posY) {
        return x >= document.documentElement.clientWidth/2-150 &&
          x <= document.documentElement.clientWidth/2-150 + 300 && 
          y >= posY &&
          y <= posY + 50;
    }

    red() { //Start as a red boi
        this.game = new Game(1, this.socket);
        this.socket.emit('New player', 'Red boi', 1, 100, 950, 5);
        this.gameStarted = true;
    }

    blue() { //Start as a blue boi
        this.game = new Game(2, this.socket);
        this.socket.emit('New player', 'Blue boi', 2, 3800, 950, 5);
        this.gameStarted = true;
    }

    spectator() { //Start as a spectator
        this.game = new Game(3, this.socket);
        this.socket.emit('New player', 'Spectator', 3, -1, -1, 5);
        this.gameStarted = true;
    }
}