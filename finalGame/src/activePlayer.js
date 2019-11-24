//Active player class, gives player features to a specific unit
//Extends player to gain access to camera control
class ActivePlayer extends Player{
    constructor(unit, game, socket) {
        super(unit, game);
        //Adds an input listener to a unit
        new InputListener(this.unit);
        this.respawnStarted = false;       //On false respawn time gets replaces with current time, on true it is compared to current time
        this.socket = socket;             //Multiplayer!
        this.respawnTimer = -1;          //Responsible for visible countdown during respawn
        this.respawnTime = 0;           //Holds respawn starting time
        this.shieldTimer = 0;          //Holds shield buff starting time
    }
    //Mouse click
    click(x, y) {
        this.unit.moveToClicked(x, y);
    }
    //Updates player unit's position
    updatePos(delta) {
        this.unit.changePos(delta);
        super.updatePos();
    }
    //Draws player unit or respawn screen
    update(ctx) {
        this.unit.update(ctx);
         //Respawn timer basically
         if(!this.unit.alive) {
            this.socket.emit('Respawn start', this.respawnStarted);
            this.respawnStarted = true;
            ctx.globalAlpha = 0.2;
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, document.documentElement.clientWidth, document.documentElement.clientHeight);
            ctx.globalAlpha = 1;
            ctx.fillStyle = "gray";
            ctx.font = "100px Arial";
            ctx.fillText(this.respawnTimer, document.documentElement.clientWidth/2, document.documentElement.clientHeight/2);
         }
       }
    //Used upon respawning
    respawned() {
        this.respawnStarted = false;
        this.unit.respawned();
    }
}