//Spectator class, used for a different interface and unique input options
class Spectator extends Player {
    constructor(unit, game, name) {
        super(unit, game);
        this.game = game;
        this.playerNum = 0; //Current spectated player
        this.name = name;  //Player name
        
        new SpectatorListener(this);
    }
    //moves to the next player
    moveLeft() {
        if (this.game.otherPlayers.length !== 0) { //If there are no active players
            this.playerNum += 1;                  //Then restricts any actions
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
    //Mouse click switches to the next player
    click(x, y) {
        this.moveLeft();
    }
}