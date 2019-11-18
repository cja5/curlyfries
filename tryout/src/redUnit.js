//Same as blue unit, yet red
class RedUnit extends Unit {
    constructor(game) {
        super(game, 100, 950);
        this.image = document.getElementById("red_idle_right");
        this.idleRight = document.getElementById("red_idle_right");
        this.idleLeft = document.getElementById("red_idle_left");
        this.goRight = document.getElementById("red_right");
        this.goLeft = document.getElementById("red_left");
        this.strikeLeft = document.getElementById("red_strike_left");
        this.strikeRight = document.getElementById("red_strike_right");
    }
 }