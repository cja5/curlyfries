//Chat class, used for server or players to communicate with other players
class Chat {
    constructor(game, socket) {
        this.socket = socket;         //Multiplayer!
        this.game = game;            //Messages array below, holds 8 messages max
        this.messages = ["", "", "", "", "","","","Welcome! Press ESC for instructions"];
        this.message = "";         //Current message
        this.typing = false;      //Changed upon pressing Enter
        new MessageReader(this); //Reads player input when typing or pressing Enter
    }
    //Adds one char to the current message
    addCharacter(char) {
        if(this.message.length < 50) {        //Max message length is 50
            this.message = this.message+char;//Concatenates current message with a fresh char
        }
    }
    //Removes last char
    backspace() {
        this.message = this.message.substring(0, this.message.length-1);
    }
    //Outputs a message to client's screen
    outputMessage(msg) {
        for(var i = 0; i < this.messages.length; i++) {    //Refreshes messages Array
            if (i === this.messages.length-1) {           
                this.messages[i] = msg;                  //Last message in the array is replaces by new one
            } else {
                this.messages[i] = this.messages[i+1]; //Shift every message by -1
            }
        }
    }
    //What happens when Enter is pressed
    enterPressed() {
        if (this.message != "") {  //If message is not empty, outputs it
            this.outputMessage(this.game.player.name+": "+ this.message); //Adds a player name to the message
            this.socket.emit('Send message',this.game.player.name+": "+ this.message); //Sends this message to server
            this.message = "";  //Message is back to being an empty string
        }   else {
            this.typing = !this.typing; //If message is empty, start or finish typing
        }
    }
    //Draws chat
    update(ctx) {
        ctx.fillStyle = "Red";
        ctx.font = "15px Arial";
        ctx.beginPath();
        ctx.lineWidth = "1";
        ctx.strokeStyle = "Red"; //Draws player's message and chat border
        ctx.fillText(this.message, 15, document.documentElement.clientHeight-300+this.messages.length*30);
        ctx.rect(10, document.documentElement.clientHeight+this.messages.length*30-320, 650, 35);
        ctx.stroke();
        if(this.typing) {  //If player is currently typing or reading, chat window is bigger
            for (var i = 0; i<this.messages.length; i++) {  //Output all messages in the array
                ctx.fillText(this.messages[i], 15, document.documentElement.clientHeight-300+i*30);
            }
            ctx.rect(10, document.documentElement.clientHeight-325, 650, this.messages.length*30+5);
            ctx.stroke();
        } else {  //If player is not typing, draws only 2 last messages
            for (var i = this.messages.length-2; i<this.messages.length; i++) {
                ctx.fillText(this.messages[i], 15, document.documentElement.clientHeight-300+i*30);
            }
        }
    }
}