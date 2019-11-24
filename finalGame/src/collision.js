
//Function to detect collision between 2 objects
function collisionDetector(unit, object) {
    if (unit.position.x < object.position.x + object.width && 
        unit.position.x + unit.width  > object.position.x && 
        unit.position.y < object.position.y + object.height && 
        unit.position.y + unit.height > object.position.y) {
            return true;
        } else {
            return false;
        }
}