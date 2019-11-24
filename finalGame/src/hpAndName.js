//Class that draws a name tag above unit's head
class NameTag {
    constructor(unit) {
        this.unit = unit;
        this.name = unit.name;
    }
    //Draws a name tag
    update(ctx) {
        ctx.fillStyle = "black";
        ctx.font = "15px Arial";
        ctx.fillText(this.name, this.unit.actual.x-ctx.measureText(this.name).width/2+this.unit.width/2, this.unit.actual.y-15);
    }
}
//Class that draws a healthbar
class HealthBar {
    constructor(unit) {
        this.unit = unit;
        this.hp = this.unit.maxHealth;
        this.width = this.unit.width/this.hp;
        this.height = 10;
    }
    //Draws a health bar
    update(ctx) {
        var index = 0;
        while (index < this.hp) {
            if (index >= this.unit.health) {
                ctx.fillStyle = "red";
            } else {
                ctx.fillStyle = "green";
            }
            ctx.fillRect(this.unit.actual.x+index*this.width, this.unit.actual.y-12, this.width+1, this.height);
            index++;
        }
    }
}
//Class that draws a shield power up if picked up
class Power{
    constructor(unit) {
        this.unit = unit;
    }
    //Draws a power up if active
    update(ctx) {
        ctx.fillStyle = "Blue";
        ctx.fillRect(this.unit.actual.x, this.unit.actual.y, 10, this.unit.height);
        ctx.fillRect(this.unit.actual.x+this.unit.width-10, this.unit.actual.y, 10, this.unit.height);
    }
}