class Game {
    constructor(num, socket, menu, name) {
        //This object is passed to every other so they can freely access game data
        this.gameObjects = [];                      //Array for game objects e.g. walls and power ups
        this.otherPlayers = [];                    //Array for all other players
        this.blueTeam = [];                       //Array for blue team
        this.redTeam = [];                       //Array for red team
        this.spectate = false;                  //Passed to interface
        this.socket = socket;                  //Multiplayer socket!
        this.deltaTime = new Date().getTime();//For constant operation time
        this.menu = menu;                    //For easy menu access
        this.touchDevice = false;           //True if client is using touch screen
        if(num===1) { //1 - red team
            this.unit = new RedUnit(this, name, this.socket);
            this.redTeam.push(this.unit);  
            this.player = new ActivePlayer(this.unit, this, this.socket);
        } else if(num===2) { //2 - blue team
            this.unit = new BlueUnit(this, name, this.socket);
            this.blueTeam.push(this.unit); 
            this.player = new ActivePlayer(this.unit, this, this.socket);
        } else if(num===3) { //3 - spectator
            this.unit = new RedUnit(this, 'Dummy', this.socket);
            this.player = new Spectator(this.unit, this, name);
            this.spectate = true; //enables spectator interface
        }
        this.addObjects();   //Creates the map
        this.camera = new Camera(this.player);  
        this.interface = new Interface(this, this.spectate, this.socket);
        this.border = new Border(this);

        this.redScore = 0;
        this.blueScore = 0;
    }
    //Changes position of every object, updates the camera
    changePos() {
        var time = new Date();    //Fetch new time
        var delta = time.getTime()-this.deltaTime;  //Compare new time to stored one
        this.player.updatePos(delta);  //update player's position using delta time
        this.gameObjects.forEach((gameObject) => gameObject.updateCamera());
        this.otherPlayers.forEach((player) => player.changePos(delta));
        this.otherPlayers.forEach((player) => player.updateCamera());
        this.border.updateCamera();
        this.deltaTime = time.getTime(); //Store new time
    }
    //Draws all objects
    update(ctx) {
        this.gameObjects.forEach((gameObject) => gameObject.update(ctx));
        this.otherPlayers.forEach((player) => player.update(ctx));
        if (!(this.player instanceof Spectator)) { //Draws player only if
            this.player.update(ctx);              //Player is not a spectator
        }
        this.border.update(ctx);
        this.interface.update(ctx);

        //Draws "ATTACK!" on touch screens
        if (this.touchDevice && !(this.player instanceof Spectator)) {
            ctx.fillStyle = "Red";
            ctx.font = "80px Arial";
            ctx.fillText("ATTACK!", document.documentElement.clientWidth-350, document.documentElement.clientHeight-75);
        }
    }
    //creates all the objects on the map, ugly, yet it doesn't hold a pattern
    addObjects() {
        this.gameObjects.push(new Wall(this, 0, 725, 500, 50));
        this.gameObjects.push(new Wall(this, 0, 1250, 500, 50));
        this.gameObjects.push(new Wall(this, 500, 725, 50, 175));
        this.gameObjects.push(new Wall(this, 500, 1125, 50, 175));
        this.gameObjects.push(new Wall(this, 3500, 725, 500, 50));
        this.gameObjects.push(new Wall(this, 3500, 1250, 500, 50));
        this.gameObjects.push(new Wall(this, 3475, 725, 50, 175));
        this.gameObjects.push(new Wall(this, 3475, 1125, 50, 175));
        this.gameObjects.push(new Wall(this, 1000, 0, 50, 700));
        this.gameObjects.push(new Wall(this, 1000, 1300, 50, 700));
        this.gameObjects.push(new Wall(this, 3000, 0, 50, 700));
        this.gameObjects.push(new Wall(this, 3000, 1300, 50, 700));
        this.gameObjects.push(new Wall(this, 1300, 700, 50, 600));
        this.gameObjects.push(new Wall(this, 2700, 700, 50, 600));
        this.gameObjects.push(new Wall(this, 1700, 400, 600, 50));
        this.gameObjects.push(new Wall(this, 1700, 1500, 600, 50));
        this.gameObjects.push(new Sign(this, 100, 1050, "red", "RED"));
        this.gameObjects.push(new Sign(this, 3650, 1050, "blue", "BLUE"));
        this.gameObjects.push(new Shield(this, 0, 100, 0));
        this.gameObjects.push(new Shield(this, 3950, 100, 1));
        this.gameObjects.push(new Shield(this, 0, 1950, 2));
        this.gameObjects.push(new Shield(this, 3950, 1950, 3));
        this.gameObjects.push(new HealthPot(this, 1050, 100, 4));
        this.gameObjects.push(new HealthPot(this, 2950, 100, 5));
        this.gameObjects.push(new HealthPot(this, 2950, 1950, 6));
        this.gameObjects.push(new HealthPot(this, 1050, 1950, 7));
    }
    //Mouse click
    click(x, y) { //If clicked on the chat prompt
        if (x >= 10 
            && x <= 10 + 650
            && y >= document.documentElement.clientHeight+this.interface.chat.messages.length*30-320 
            && y <= document.documentElement.clientHeight+this.interface.chat.messages.length*30-320 + 35) {
                if (this.touchDevice && this.interface.chat.typing && this.interface.chat.message === "") {
                    this.interface.chat.message = prompt("Enter your message"); //Chat usage for touch devices
                    this.interface.chat.enterPressed();
                } else {
                    this.interface.chat.typing = !this.interface.chat.typing
                }
            } else {
        if (this.touchDevice &&
            x > document.documentElement.clientWidth - 400 &&
            y > document.documentElement.clientHeight - 125 &&
            !(this.player instanceof Spectator)) {  //Special attack for touch screen
                this.player.unit.attack();
                this.player.unit.checkAttack();
        } else {
            this.player.click(x, y);
        }
    }
    }
}