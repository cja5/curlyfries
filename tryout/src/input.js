class InputListener {

    constructor(unit) {
        this.unit = unit;
        document.addEventListener("keydown", event => {
            
            if(this.unit.game.interface.chat.typing === false) {

                switch(event.keyCode) {
                    //Space
                    case 32: 
                        unit.attack();
                        break;
                    //Up
                    case 38: 
                        unit.moveUp();
                        break;
                    //W
                    case 87: 
                        unit.moveUp();
                        break;
                    //Down
                    case 40: 
                        unit.moveDown();
                        break;
                    //S
                    case 83: 
                        unit.moveDown();
                        break;
                    //Left
                    case 37: 
                        unit.moveLeft();
                        break;
                    //A
                    case 65: 
                        unit.moveLeft();
                        break;
                    //Right
                    case 39: 
                        unit.moveRight();
                        break;
                    //D
                    case 68: 
                        unit.moveRight();
                        break;
                    //Esc
                    case 27:
                        unit.game.menu.state = 3;
                        break;

                }
            }
        })
            document.addEventListener("keyup", event => {

                if(this.unit.game.interface.chat.typing === false) {

                    switch(event.keyCode) {
                        //Space
                        case 32: 
                            unit.checkAttack();
                            break;
                        //Up
                        case 38: 
                            unit.stopUp();
                            break;
                        //W
                        case 87: 
                            unit.stopUp();
                            break;
                        //Down
                        case 40: 
                            unit.stopDown();
                            break;
                        //S
                        case 83: 
                            unit.stopDown();
                            break;
                        //Left
                        case 37: 
                            unit.stopLeft();
                            break;
                        //A
                        case 65: 
                            unit.stopLeft();
                            break;
                        //Right
                        case 39: 
                            unit.stopRight();
                            break;
                        //D
                        case 68: 
                            unit.stopRight();
                            break;
                    }
    
                }
            })
    }
}
//Listener class created for spectators
class SpectatorListener {
    constructor(player) {
        this.player = player;
        document.addEventListener("keydown", event => {
            
            if(this.player.game.interface.chat.typing === false) {

                switch(event.keyCode) {
                    //Left
                    case 37: 
                        this.player.moveLeft();
                        break;
                    //A
                    case 65: 
                        this.player.moveLeft();
                        break;
                    //Right
                    case 39: 
                        this.player.moveRight();
                        break;
                    //D
                    case 68: 
                        this.player.moveRight();
                        break;
                    //Esc
                    case 27:
                        this.player.game.menu.state = 3;
                        break;

                }
            }
        })
    }
}