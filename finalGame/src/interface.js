//Class that draws an interface for players
class Interface {
    constructor(game, mode, socket)  {
        this.game = game;
        this.spectateMode = mode;  //enables spectator mode interface
        this.chat = new Chat(this.game, socket); //Draws a chat too (chat is interactive at least)
    }
    //draws a bunch of stuff on top of the screen
    update(ctx) {
        ctx.fillStyle = "black"; //Outlines interface area
        ctx.fillRect(0, 0, document.documentElement.clientWidth-15, 100);
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        if (this.spectateMode) { //Only for spectator mode
            ctx.fillText("previous player", 50, 50); 
            ctx.fillText("next player", document.documentElement.clientWidth-150, 50);
            ctx.font = "35px Arial";
            if (this.game.otherPlayers.length !== 0) {
                var name = this.game.otherPlayers[this.game.player.playerNum].name;
                ctx.fillText(name, document.documentElement.clientWidth/2-ctx.measureText(name).width/2, 30);
            }
        }
        ctx.font = "30px Arial";  //Draws team scores
        var score = this.game.redScore+" :: "+this.game.blueScore;
        ctx.fillText(score, document.documentElement.clientWidth/2-ctx.measureText(score).width/2, 70);
        ctx.font = "40px Arial";
        var text = "Red";
        var text2 = "Blue";
        ctx.fillStyle = "red";
        ctx.fillText(text, document.documentElement.clientWidth/2-ctx.measureText(score).width-ctx.measureText(text).width/2-5, 70);
        ctx.fillStyle = "blue";
        ctx.fillText(text2, document.documentElement.clientWidth/2+ctx.measureText(score).width-ctx.measureText(text2).width/2+5, 70);

        this.chat.update(ctx);
    }
}