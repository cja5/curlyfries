
//Function to detect collision between 2 objects
function collisionDetector(object, object2) {
        if (object.position.x < object2.position.x + object2.width  
            && object.position.x + object.width  > object2.position.x 
            && object.position.y < object2.position.y + object2.height 
            && object.position.y + object.height > object2.position.y) {
                return true;
            } else {
                return false;
            }
}