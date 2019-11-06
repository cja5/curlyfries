//Player class, used to give player features to a specific unit
class Player {
    constructor(unit, game) {
        this.game = game;
        this.unit = unit;
        this.position = {
            x: 0,
            y: 0
        };
        //Sets unit position at the middle of the screen
        this.unit.actual.x = 800;
        this.unit.actual.y = 400;
        //Adds an input listener to a unit
        new InputListener(this.unit);
    }
    //Updates x and y positions stored in the player class, used for camera
    updatePos() {
        this.position = {
            x: this.unit.position.x,
            y: this.unit.position.y
        };
    }
}