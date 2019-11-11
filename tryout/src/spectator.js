//Spectator class, used for a different interface and unique input options
class Spectator extends Player {
    constructor(unit, game) {
        super(unit, game);
        this.game = game;
        this.playerNum = 0;
        
        new InputListener(this);
    }
    //moves to the next player
    moveLeft() {
        this.playerNum += 1;
        if(this.playerNum >= this.game.otherPlayers.length) {
            this.playerNum = 0;
        }
        this.unit = this.game.otherPlayers[this.playerNum];
    }
    //moves to the previous player
    moveRight() {
        this.playerNum -= 1;
        if(this.playerNum < 0) {
            this.playerNum = this.game.otherPlayers.length-1;
        }
        this.unit = this.game.otherPlayers[this.playerNum];
    }
}