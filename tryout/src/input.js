class InputListener {

    constructor(unit) {
        this.unit = unit;
        document.addEventListener("keydown", event => {

            switch(event.keyCode) {

                case 32: 
                    unit.attack();
                    break;

                case 38: 
                    unit.moveUp();
                    break;

                case 87: 
                    unit.moveUp();
                    break;

                case 40: 
                    unit.moveDown();
                    break;

                case 83: 
                    unit.moveDown();
                    break;

                case 37: 
                    unit.moveLeft();
                    break;

                case 65: 
                    unit.moveLeft();
                    break;

                case 39: 
                    unit.moveRight();
                    break;

                case 68: 
                    unit.moveRight();
                    break;

            }
        })
            document.addEventListener("keyup", event => {

                switch(event.keyCode) {

                    case 32: 
                    unit.check();
                    break;
    
                    case 38: 
                        unit.stopUp();
                        break;
    
                    case 87: 
                        unit.stopUp();
                        break;
    
                    case 40: 
                        unit.stopDown();
                        break;
    
                    case 83: 
                        unit.stopDown();
                        break;
    
                    case 37: 
                        unit.stopLeft();
                        break;
    
                    case 65: 
                        unit.stopLeft();
                        break;
    
                    case 39: 
                        unit.stopRight();
                        break;
    
                    case 68: 
                        unit.stopRight();
                        break;
    
                }
            })
    }
}