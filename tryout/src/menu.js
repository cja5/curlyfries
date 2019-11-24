//Starting menu
class Menu {
    constructor(socket) {
        this.socket = socket;
        this.game = null; //Create future game variable
        this.gameStarted = false; //Game state
        this.text1 = "Join game as:"
        this.text2 = "Red team";
        this.text3 = "Blue team";
        this.text4 = "Spectator";
        this.text5 = "#1";
        this.text6 = "Epic Victory Royale";
        this.text7 = "Red Victory";
        this.text8 = "Blue Victory";
        this.text9 = "Tap anywhere to continue";
        this.text10 = "Instructions";
        this.text11 = "Or check this out:";
        this.x = 0; //Mouse x
        this.y = 0; //Mouse y
        this.state = 0;  //Menu state  0 - menu and game, 1 - victory screen, 2 - defeat screen, 3 - instructions
        this.winner = true; //Used for defeat screen true - Red, false - Blue
    
    }

    update(ctx, x, y) {
        this.x = x; //update mouse x
        this.y = y; //update mouse y
        if(this.state === 0) {
            if(!this.gameStarted) { //If game has started, update game only instead
                //A bunch of stuff to draw
                ctx.fillStyle = "black";
                ctx.font = "30px Arial"; //Text
                ctx.fillText(this.text1, document.documentElement.clientWidth/2-ctx.measureText(this.text1).width/2, 30);
                ctx.fillText(this.text11, document.documentElement.clientWidth/2-ctx.measureText(this.text11).width/2, 260);
                ctx.fillStyle = "Red";
                if(this.checkMouse(x, y, 60)) { //Highlightes rectangle if moused over
                        ctx.fillStyle = "Green";
                    }  //Draws a button for joining red team
                ctx.fillRect(document.documentElement.clientWidth/2-150, 60, 300, 50);
                ctx.fillStyle = "Blue";
                if(this.checkMouse(x, y, 120)) {
                    ctx.fillStyle = "Green";
                }    //Draws a button for joining blue team
                ctx.fillRect(document.documentElement.clientWidth/2-150, 120, 300, 50);
                ctx.fillStyle = "Gray";
                if(this.checkMouse(x, y, 180)) {
                    ctx.fillStyle = "Green";
                }   //Draws a button for joining spectators
                ctx.fillRect(document.documentElement.clientWidth/2-150, 180, 300, 50);
                ctx.fillStyle = "Black";
                if(this.checkMouse(x, y, 275)) {
                    ctx.fillStyle = "Green";
                }  //Draws a button for instructions
                ctx.fillRect(document.documentElement.clientWidth/2-150, 275, 300, 50);
                ctx.fillStyle = "White"; //Draws text for buttons
                ctx.fillText(this.text2, document.documentElement.clientWidth/2-ctx.measureText(this.text2).width/2, 95);
                ctx.fillText(this.text3, document.documentElement.clientWidth/2-ctx.measureText(this.text3).width/2, 155);
                ctx.fillText(this.text4, document.documentElement.clientWidth/2-ctx.measureText(this.text4).width/2, 215);
                ctx.fillText(this.text10, document.documentElement.clientWidth/2-ctx.measureText(this.text10).width/2, 310);
            } else { //If gameStarted == true, then everything above is skipped
                this.game.changePos(); //Upon game start, draws game only
                this.game.update(ctx);
            }
        } else if (this.state === 1 || this.state === 2) { //Draws game end screen
            ctx.fillStyle = "black"; //Makes screen turn black
            ctx.fillRect(0, 0, document.documentElement.clientWidth, document.documentElement.clientHeight);
            ctx.fillStyle = "white";
            ctx.font = "100px Arial";
            if (this.state == 1) { //Victory screen
                ctx.fillText(this.text5, document.documentElement.clientWidth/2, 200);
                ctx.fillText(this.text6, document.documentElement.clientWidth/2-ctx.measureText(this.text6).width/2, 300);
            } else {  //Defeat/spectator screen
                if(this.winner) {  //Red won
                    ctx.fillText(this.text7, document.documentElement.clientWidth/2-ctx.measureText(this.text7).width/2, 300);
                } else {           //Blue won
                    ctx.fillText(this.text8, document.documentElement.clientWidth/2-ctx.measureText(this.text8).width/2, 300);
                }
            }
            ctx.font = "30px Arial"; //"Tap anywhere to continue"
            ctx.fillText(this.text9, document.documentElement.clientWidth/2-ctx.measureText(this.text9).width/2, 400);
        } else if (this.state === 3) {  //Inscturctions screen
            ctx.font = "25px Arial";
            ctx.fillText(this.text9, document.documentElement.clientWidth/2-ctx.measureText(this.text9).width/2, 50);
            ctx.font = "22px Arial";
            var instructions = "Movement: WASD, arrowkeys or mouse";
            ctx.fillText(instructions, document.documentElement.clientWidth/2-ctx.measureText(instructions).width/2, 100);
            var instructions2 = "Attack: Spacebar";
            ctx.fillText(instructions2, document.documentElement.clientWidth/2-ctx.measureText(instructions).width/2, 120);
            var instructions3 = "Each kill grants your team a point.";
            ctx.fillText(instructions3, document.documentElement.clientWidth/2-ctx.measureText(instructions3).width/2, 150);
            var instructions4 = "If a team scores 50 points, they win.";
            ctx.fillText(instructions4, document.documentElement.clientWidth/2-ctx.measureText(instructions4).width/2, 175);
            var instructions5 = "You have only 5 hit points, be careful.";
            ctx.fillText(instructions5, document.documentElement.clientWidth/2-ctx.measureText(instructions5).width/2, 200);
            var instructions6 = "Shields give you invulnerability for 10 seconds.";
            ctx.fillText(instructions6, document.documentElement.clientWidth/2-ctx.measureText(instructions6).width/2, 225);
            var instructions7 = "Health packs restore your hit points to max.";
            ctx.fillText(instructions7, document.documentElement.clientWidth/2-ctx.measureText(instructions7).width/2, 250);
            var instructions8 = "Good luck!";
            ctx.fillText(instructions8, document.documentElement.clientWidth/2-ctx.measureText(instructions8).width/2, 285);
            ctx.fillStyle = "blue";
            ctx.fillRect(document.documentElement.clientWidth/2-ctx.measureText(instructions6).width/2-25, 200, 25, 25);
            ctx.fillStyle = "green";
            ctx.fillRect(document.documentElement.clientWidth/2-ctx.measureText(instructions7).width/2-25, 225, 25, 25);
        }
    }
    //Mouse click function
    click() {
        if (this.state === 0) { //If current state is Menu / Game
            if(this.gameStarted) { //If current state is Game
                this.game.click(this.x, this.y); //Sends information further in
            }
            else { //If game has started, this is not required
                if(this.checkMouse(this.x, this.y, 60)) {
                    this.red(); //Starts the game as red
                } else if(this.checkMouse(this.x, this.y, 120)) {
                    this.blue(); //Starts a game as blue
                } else if(this.checkMouse(this.x, this.y, 180)) {
                    this.spectator(); //Starts a game as a spectator
                } else if(this.checkMouse(this.x, this.y, 275)) {
                    this.state = 3; //Opens instructions screen
                }
            }
        } else { //If player is on instruction screen, sets everything back to Menu / Game
            this.state = 0;
        }
    }
    //Check where cursor is, designed specifically for buttons
    checkMouse(x, y, posY) {
        return x >= document.documentElement.clientWidth/2-150 
            && x <= document.documentElement.clientWidth/2-150 + 300
            && y >= posY 
            && y <= posY + 50
    }

    red() { //Start as a red boi
        this.game = new Game(1, this.socket, this);  //Creates a game
        this.socket.emit('New player', 'Red boi', 1, 100, 950, 5); //Sends a new player info to the server
        this.gameStarted = true;  //Starts a game
    }

    blue() { //Start as a blue boi
        this.game = new Game(2, this.socket, this);
        this.socket.emit('New player', 'Blue boi', 2, 3800, 950, 5);
        this.gameStarted = true;
    }

    spectator() { //Start as a spectator
        this.game = new Game(3, this.socket, this);
        this.socket.emit('New player', 'Spectator', 3, -1, -1, 5);
        this.gameStarted = true;
    }
}