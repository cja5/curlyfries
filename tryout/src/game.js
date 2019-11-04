class Game {
    constructor(canvasLength, canvasHeight) {
        this.canvasLength = canvasLength;
        this.canvasHeight = canvasHeight;
    }

    start() {
        this.unit = new Unit(this, 100, 100);
        this.un = new Unit(this, 200, 500);
        new InputListener(this.unit);
    }

    changePos() {
        this.unit.changePos();
        this.un.changePos();
        
    }

    update(ctx) {
        this.unit.update(ctx);
        this.un.update(ctx);
    }
}