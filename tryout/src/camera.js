//Camera class, currently used to store values of x and y, which are used to shift
//every object that is not player
class Camera {
    constructor(player) {
        this.player = player;
        this.position = {
            x:0,
            y:0
        }

    }
    //function that updates these x and y values regarding the position of a player
    update() {
        this.position.x = this.player.position.x - this.player.unit.actual.x;
        this.position.y = this.player.position.y - this.player.unit.actual.y;
        }
}