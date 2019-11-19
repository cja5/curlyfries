class Interface {
    constructor(game, mode)  {
        this.game = game;
        this.spectateMode = mode;  //enables spectator mode interface
    }
    //draws a bunch of stuff on top of the screen
    update(ctx) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, document.documentElement.clientWidth-15, 100);
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        if (this.spectateMode) {
            ctx.fillText("previous player", 50, 50);
            ctx.fillText("next player", document.documentElement.clientWidth-150, 50);
            ctx.font = "35px Arial";
            var name = this.game.otherPlayers[this.game.player.playerNum].name;
            ctx.fillText(name, document.documentElement.clientWidth/2-ctx.measureText(name).width/2, 30);
        }
        ctx.font = "30px Arial";
        var score = this.game.redScore+" :: "+this.game.blueScore;
        ctx.fillText(score, document.documentElement.clientWidth/2-ctx.measureText(score).width/2, 70);
    }
}