//Spectator class, used for a different interface and unique input options
class Spectator extends Player {
    constructor(unit, game) {
        super(unit, game);
        this.game = game;
        this.playerNum = 0;
        
        this.spectatorListener = new SpectatorListener(this);
    }
    //moves to the next player
    moveLeft() {
        if (this.game.otherPlayers.length !== 0) {
            this.playerNum += 1;
            if(this.playerNum >= this.game.otherPlayers.length) {
                this.playerNum = 0;
            }
            this.unit = this.game.otherPlayers[this.playerNum];
        }
    }
    //moves to the previous player
    moveRight() {
        if (this.game.otherPlayers.length !== 0) {
            this.playerNum -= 1;
            if(this.playerNum < 0) {
                this.playerNum = this.game.otherPlayers.length-1;
            }
            this.unit = this.game.otherPlayers[this.playerNum];
        }
    }

    click(x, y) {
        this.moveRight();
    }
}