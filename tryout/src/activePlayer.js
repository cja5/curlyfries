//Active player class, gives player features to a specific unit
//Extends player to gain access to camera control
class ActivePlayer extends Player{
    constructor(unit, game) {
        super(unit, game);
        //Adds an input listener to a unit
        new InputListener(this.unit);
    }

    click(x, y) {
        this.unit.moveToClicked(x, y);
    }

    updatePos() {
        this.unit.changePos();
        super.updatePos();
    }
}