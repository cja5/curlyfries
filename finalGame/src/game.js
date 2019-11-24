class Game {
    constructor(num, socket) {
        //This object is passed to every other so they can freely access game data
        this.gameObjects = [];                      //Array for game objects e.g. walls and power ups
        this.otherPlayers = [];                    //Array for all other players
        this.blueTeam = [];                       //Array for blue team
        this.redTeam = [];                       //Array for red team
        this.spectate = false;                  //Passed to interface
        this.socket = socket;                  //Multiplayer socket!
        this.deltaTime = new Date().getTime();//For constant operation time
        if(num===1) { //1 - red team
            this.unit = new RedUnit(this, "Red boi", this.socket);
            this.redTeam.push(this.unit);  
            this.player = new ActivePlayer(this.unit, this, this.socket);
        } else if(num===2) { //2 - blue team
            this.unit = new BlueUnit(this, "Blue boi", this.socket);
            this.blueTeam.push(this.unit); 
            this.player = new ActivePlayer(this.unit, this, this.socket);
        } else if(num===3) { //3 - spectator
            this.unit = new RedUnit(this, 'Dummy', this.socket);
            this.player = new Spectator(this.unit, this);
            this.spectate = true; //enables spectator interface
        }
        this.addObjects();
        this.camera = new Camera(this.player);
        this.interface = new Interface(this, this.spectate, this.socket);
        this.border = new Border(this);

        this.redScore = 0;
        this.blueScore = 0;
    }
    //Changes position of every object, updates the camera
    changePos() {
        var time = new Date();
        var delta = time.getTime()-this.deltaTime;
        this.player.updatePos(delta);
        this.gameObjects.forEach((gameObject) => gameObject.updateCamera());
        this.otherPlayers.forEach((player) => player.changePos(delta));
        this.otherPlayers.forEach((player) => player.updateCamera());
        this.border.updateCamera();
        this.deltaTime = time.getTime();
    }
    //Draws all objects
    update(ctx) {
        this.otherPlayers.forEach((player) => player.update(ctx));
        this.gameObjects.forEach((gameObject) => gameObject.update(ctx));
        if (!(this.player instanceof Spectator)) {
            this.player.update(ctx);
        }
        this.border.update(ctx);
        this.interface.update(ctx);
    }
    //creates all the objects on the map
    addObjects() {
        this.gameObjects.push(new Wall(this, 0, 750, 500, 25));
        this.gameObjects.push(new Wall(this, 0, 1250, 500, 25));
        this.gameObjects.push(new Wall(this, 500, 750, 25, 150));
        this.gameObjects.push(new Wall(this, 500, 1125, 25, 150));
        this.gameObjects.push(new Wall(this, 3500, 750, 500, 25));
        this.gameObjects.push(new Wall(this, 3500, 1250, 500, 25));
        this.gameObjects.push(new Wall(this, 3475, 750, 25, 150));
        this.gameObjects.push(new Wall(this, 3475, 1125, 25, 150));
        this.gameObjects.push(new Wall(this, 1000, 0, 50, 700));
        this.gameObjects.push(new Wall(this, 1000, 1300, 50, 700));
        this.gameObjects.push(new Wall(this, 3000, 0, 50, 700));
        this.gameObjects.push(new Wall(this, 3000, 1300, 50, 700));
        this.gameObjects.push(new Wall(this, 1300, 700, 50, 600));
        this.gameObjects.push(new Wall(this, 2700, 700, 50, 600));
        this.gameObjects.push(new Wall(this, 1700, 400, 600, 50));
        this.gameObjects.push(new Wall(this, 1700, 1500, 600, 50));
        this.gameObjects.push(new Shield(this, 0, 100, 0));
        this.gameObjects.push(new Shield(this, 3950, 100, 1));
        this.gameObjects.push(new Shield(this, 0, 1950, 2));
        this.gameObjects.push(new Shield(this, 3950, 1950, 3));
        this.gameObjects.push(new HealthPot(this, 1050, 100, 4));
        this.gameObjects.push(new HealthPot(this, 2950, 100, 5));
        this.gameObjects.push(new HealthPot(this, 2950, 1950, 6));
        this.gameObjects.push(new HealthPot(this, 1050, 1950, 7));
    }

    click(x, y) {
        this.player.click(x, y);
    }
}