class Game {
    constructor(canvas) {
        //This object is passed to every other so they can freely access game data
        this.gameObjects = [];    //Array for game objects e.g. walls and power ups
        this.otherPlayers = [];  //Array for all other players
        this.enemies = [];      //Array solely for player enemies
        this.canvas = canvas;
        this.unit = new RedUnit(this, 550, 550);
        this.player = new ActivePlayer(this.unit, this);
        this.un = new BlueUnit(this, 200, 500);
        this.otherPlayers.push(this.un);
        for(var i = 0; i < 10 ; i++) {
            var uno = new BlueUnit(this, i*100+500, 1000);
            this.otherPlayers.push(uno);
            this.enemies.push(uno);
        }
        this.enemies.push(this.un);
        this.powerUp = new PowerUp(this, 800, 150);
        this.gameObjects.push(this.powerUp);
        this.gameObjects.push(new Wall(this, 750, 0, 50, 500))
        this.gameObjects.push(new Wall(this, 1250, 0, 50, 500))
        this.gameObjects.push(new Wall(this, 750, 1500, 50, 500))
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
        this.player.update(ctx);
        this.otherPlayers.forEach((player) => player.update(ctx));
        this.gameObjects.forEach((gameObject) => gameObject.update(ctx));
        this.border.update(ctx);
        this.interface.update(ctx);
    }
}