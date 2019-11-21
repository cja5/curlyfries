class MessageReader {
    constructor(chat) {
        this.chat = chat;

        document.addEventListener("keydown", event => {
            switch(event.keyCode) {
                //Enter
                case 13: 
                    this.chat.enterPressed();
                    break;
                //Backspace
                case 8:
                    this.chat.backspace();
                    break;
                //Allowed stuff
                default:
                    if(this.chat.typing) {
                        if(event.keyCode === 188) {
                            if(event.shiftKey) {
                                this.chat.addCharacter("<");
                            } else {
                                this.chat.addCharacter(",");
                            }
                        
                        } if(event.keyCode === 191) {
                            if(event.shiftKey) {
                                this.chat.addCharacter("?");
                            }
                        } if(event.keyCode === 49) {
                            if(event.shiftKey) {
                                this.chat.addCharacter("!");
                            } else {
                                this.chat.addCharacter("1");
                            }
                        } if(event.keyCode === 50) {
                            if (event.shiftKey) {
                                this.chat.addCharacter("@")
                            } else {
                                this.chat.addCharacter("2");
                            }
                        } if(event.keyCode === 51) {
                            if (event.shiftKey) {
                                this.chat.addCharacter("£")
                            } else {
                                this.chat.addCharacter("3");
                            }
                        } if(event.keyCode === 52) {
                            if (event.shiftKey) {
                                this.chat.addCharacter("$")
                            } else {
                                this.chat.addCharacter("4");
                            }
                        } if(event.keyCode === 53) {
                            if (event.shiftKey) {
                                this.chat.addCharacter("%")
                            } else {
                                this.chat.addCharacter("5");
                            }
                        } if(event.keyCode === 54) {
                            if (event.shiftKey) {
                                this.chat.addCharacter("^")
                            } else {
                                this.chat.addCharacter("6");
                            }
                        } if(event.keyCode === 55) {
                            if (event.shiftKey) {
                                this.chat.addCharacter("&")
                            } else {
                                this.chat.addCharacter("7");
                            }
                        } if(event.keyCode === 56) {
                            if (event.shiftKey) {
                                this.chat.addCharacter("*")
                            } else {
                                this.chat.addCharacter("8");
                            }
                        } if(event.keyCode === 57) {
                            if (event.shiftKey) {
                                this.chat.addCharacter("(")
                            } else {
                                this.chat.addCharacter("9");
                            }
                        } if(event.keyCode === 48) {
                            if (event.shiftKey) {
                                this.chat.addCharacter(")")
                            } else {
                                this.chat.addCharacter("0");
                            }
                        } if(event.keyCode === 189) {
                            if (event.shiftKey) {
                                this.chat.addCharacter("_")
                            } else {
                                this.chat.addCharacter("-");
                            }
                        } if(event.keyCode === 187) {
                            if (event.shiftKey) {
                                this.chat.addCharacter("+")
                            } else {
                                this.chat.addCharacter("=");
                            }
                        }  if(event.keyCode === 190) {
                            if(event.shiftKey) {
                                this.chat.addCharacter(">");
                            } else {
                                this.chat.addCharacter(".");
                            }
                        }
                        var char = String.fromCharCode(event.keyCode);
                        if (char === String.fromCharCode(32)) {
                            this.chat.addCharacter(" ");
                        }
                        if (char.match(/[a-z]/i)) {
                            if (char === char.toUpperCase()) {
                                char = char.toLowerCase();
                            }
                            if (event.getModifierState("CapsLock")) {
                                if(!event.shiftKey) {
                                    char = char.toUpperCase();
                                }
                            } else if(event.shiftKey) {
                                char = char.toUpperCase();
                            }
                            this.chat.addCharacter(char);
                        }
                    } 
            }
        
        
        
        });
    }
}