//Player class, used to centre camera on a specific unit
class Player {
    constructor(unit, game) {
        this.game = game;
        this.unit = unit;
        this.name = this.unit.name;
        this.position = {
            x: 0,
            y: 0
        };
        //Sets unit position at the middle of the screen
        this.unit.actual.x = document.documentElement.clientWidth/2 - this.unit.width/2;
        this.unit.actual.y = document.documentElement.clientHeight/2 - this.unit.height/2;
    }
    //Updates x and y positions stored in the spectator class, used for camera
    updatePos() {
        //This keeps unit in the middle even if screen size changes
        this.unit.actual.x = document.documentElement.clientWidth/2 - this.unit.width/2;
        this.unit.actual.y = document.documentElement.clientHeight/2 - this.unit.height/2;

        //controls camera near edges of the map
        if(this.unit.position.x < this.unit.actual.x) {
            this.unit.actual.x = this.unit.position.x;
        }
        if(this.unit.position.y < this.unit.actual.y) {
            this.unit.actual.y = this.unit.position.y;
        }
        if(this.unit.position.x > this.game.border.width-this.unit.actual.x-this.unit.width) {
            this.unit.actual.x = document.documentElement.clientWidth - (this.game.border.width-this.unit.position.x);
        }
        if(this.unit.position.y > this.game.border.height-this.unit.actual.y-this.unit.height) {
            this.unit.actual.y = document.documentElement.clientHeight - (this.game.border.height-this.unit.position.y);
        }
        this.position = {
            x: this.unit.position.x,
            y: this.unit.position.y
        };
        this.game.camera.update();
    }

    update(ctx) {
        this.unit.update(ctx);
    }
}