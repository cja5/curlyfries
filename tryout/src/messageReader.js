//Message reader designed specifically for chat
class MessageReader {
    constructor(chat) {
        this.chat = chat;

        document.addEventListener("keydown", event => {
            //Enter
            if(event.keyCode === 13) {
                this.chat.enterPressed();
            }
            if(this.chat.typing) {
                switch(event.keyCode) {
                    //Backspace
                    case 8:
                        this.chat.backspace();
                        break;
                    //Allowed stuff
                    case 188:
                        if(event.shiftKey) {
                            this.chat.addCharacter("<");
                        } else {
                            this.chat.addCharacter(",");
                        }
                        break;
                    case 191:
                        if(event.shiftKey) {
                            this.chat.addCharacter("?");
                        }
                        break;
                    case 49:
                        if(event.shiftKey) {
                            this.chat.addCharacter("!");
                        } else {
                            this.chat.addCharacter("1");
                        }
                        break;
                    case 50:
                        if (event.shiftKey) {
                            this.chat.addCharacter("@")
                        } else {
                            this.chat.addCharacter("2");
                        }
                        break;
                    case 51:
                            this.chat.addCharacter("3");
                        break;
                    case 52:
                        if (event.shiftKey) {
                            this.chat.addCharacter("$")
                        } else {
                            this.chat.addCharacter("4");
                        }
                        break;
                    case 53:
                        if (event.shiftKey) {
                            this.chat.addCharacter("%")
                        } else {
                            this.chat.addCharacter("5");
                        }
                        break;
                    case 54:
                        if (event.shiftKey) {
                            this.chat.addCharacter("^")
                        } else {
                            this.chat.addCharacter("6");
                        }
                        break;
                    case 55:
                        if (event.shiftKey) {
                            this.chat.addCharacter("&")
                        } else {
                            this.chat.addCharacter("7");
                        }
                        break;
                    case 56:
                        if (event.shiftKey) {
                            this.chat.addCharacter("*")
                        } else {
                            this.chat.addCharacter("8");
                        }
                        break;
                    case 57:
                        if (event.shiftKey) {
                            this.chat.addCharacter("(")
                        } else {
                            this.chat.addCharacter("9");
                        }
                        break;
                    case 48:
                        if (event.shiftKey) {
                            this.chat.addCharacter(")")
                        } else {
                            this.chat.addCharacter("0");
                        }
                        break;
                    case 189:
                        if (event.shiftKey) {
                            this.chat.addCharacter("_")
                        } else {
                            this.chat.addCharacter("-");
                        }
                        break;
                    case 187:
                        if (event.shiftKey) {
                            this.chat.addCharacter("+")
                        } else {
                            this.chat.addCharacter("=");
                        }
                        break;
                    case 190:
                        if(event.shiftKey) {
                            this.chat.addCharacter(">");
                        } else {
                            this.chat.addCharacter(".");
                        }
                        break;
                    case 186:
                        if(event.shiftKey) {
                            this.chat.addCharacter(":");
                        }
                        break;
                    case 32:
                        this.chat.addCharacter(" ");
                        break;
                    //Letters
                    default:
                        var char = String.fromCharCode(event.keyCode);
                        if (char.match(/[a-z]/i)) { //Checks if this is a letter
                            if (char === char.toUpperCase()) {
                                char = char.toLowerCase(); //Assigns upper case letters to lower case
                            }
                            if (event.getModifierState("CapsLock")) { //Checks for CAPS
                                if(!event.shiftKey) {                //Checks for Shift
                                    char = char.toUpperCase();
                                }
                            } else if(event.shiftKey) {
                                char = char.toUpperCase();
                            }
                            this.chat.addCharacter(char); //Adds a character to the message
                        }
                    } 
            }
        });
    }
}