class Chat {
    constructor(game) {
        this.game = game;
        this.messages = ["", "", "", "", "","","",""];
        this.message = "";
        this.typing = false;
        new MessageReader(this);
    }

    addCharacter(char) {
        if(this.message.length < 50) {
            this.message = this.message+char;
        }
    }

    backspace() {
        this.message = this.message.substring(0, this.message.length-1);
    }

    enterPressed() {
        if (this.message != "") {
            for(var i = 0; i < this.messages.length; i++) {
                if (i === this.messages.length-1) {
                    this.messages[i] = this.game.player.name+": "+ this.message;
                    this.message = "";
                } else {
                    this.messages[i] = this.messages[i+1];
                }
            }
        }   else {
            this.typing = !this.typing;
        }
    }

    update(ctx) {
        ctx.fillStyle = "Red";
        ctx.font = "15px Arial";
        ctx.beginPath();
        ctx.lineWidth = "1";
        ctx.strokeStyle = "Red";
        ctx.fillText(this.message, 15, document.documentElement.clientHeight-300+this.messages.length*30);
        ctx.rect(10, document.documentElement.clientHeight+this.messages.length*30-320, 650, 35);
        ctx.stroke();
        if(this.typing) {
            for (var i = 0; i<this.messages.length; i++) {
                ctx.fillText(this.messages[i], 15, document.documentElement.clientHeight-300+i*30);
            }
            ctx.rect(10, document.documentElement.clientHeight-325, 650, this.messages.length*30+5);
            ctx.stroke();
        } else {
            for (var i = this.messages.length-2; i<this.messages.length; i++) {
                ctx.fillText(this.messages[i], 15, document.documentElement.clientHeight-300+i*30);
            }
        }
    }
}