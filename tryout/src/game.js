class Game {
    constructor() {
        //This object is passed to every other so they can freely access game data
        this.unit = new Unit(this, 100, 100);
        this.player = new Player(this.unit, this);
        this.un = new Unit(this, 200, 500);
        this.powerUp = new PowerUp(this);
        this.camera = new Camera(this.player);
    }
    //Changes position of every object, updates the camera
    changePos() {
        this.unit.changePos();
        this.player.updatePos();
        this.camera.update();
        this.un.changePos();
        this.powerUp.updateCamera();
        this.un.updateCamera();
    }
    //Draws all objects
    update(ctx) {
        this.unit.update(ctx);
        this.un.update(ctx);
        this.powerUp.update(ctx);
    }
}