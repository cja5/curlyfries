class Game {
    constructor() {
        //This object is passed to every other so they can freely access game data
        this.gameObjects = [];    //Array for game objects e.g. walls and power ups
        this.otherPlayers = [];  //Array for all other players
        this.enemies = [];      //Array solely for player enemies
        this.unit = new RedUnit(this);
        this.player = new ActivePlayer(this.unit, this);
        this.un = new BlueUnit(this);
        this.otherPlayers.push(this.un);
        for(var i = 0; i < 10 ; i++) {
            var uno = new BlueUnit(this);
            this.otherPlayers.push(uno);
            this.enemies.push(uno);
        }
        this.enemies.push(this.un);
        this.addObjects();
        this.camera = new Camera(this.player);
        this.interface = new Interface(this);
        this.border = new Border(this);

        this.score = 0;
    }
    //Changes position of every object, updates the camera
    changePos() {
        this.player.updatePos();
        this.gameObjects.forEach((gameObject) => gameObject.updateCamera());
        this.otherPlayers.forEach((player) => player.changePos());
        this.otherPlayers.forEach((player) => player.updateCamera());
        this.border.updateCamera();
    }
    //Draws all objects
    update(ctx) {
        this.otherPlayers.forEach((player) => player.update(ctx));
        this.gameObjects.forEach((gameObject) => gameObject.update(ctx));
        this.player.update(ctx);
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
        this.gameObjects.push(new Shield(this, 0, 775));
        this.gameObjects.push(new HealthPot(this, 0, 1200));
    }
}