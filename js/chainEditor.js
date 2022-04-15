class node {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.radius = 20;
        this.isDragged = false;
        this.isHovered = false;
        this.clickOffset = { x : 0, y : 0 };
    }

    update(params, id){
        this.checkDrag(params, id);
        this.doDrag(params.mousePos);
        this.display(params, id);
    }

    display(params, id) {
        var ctx = params.ctx;

        ctx.fillStyle   = "#ffffff";
        // if (id == g_active_id) ctx.strokeStyle = "#0000ff";
        ctx.strokeStyle = (id == g_active_id) ? "#0000ff" : "#000000";
        ctx.lineWidth   = 5;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }

    checkDrag(params, id) {
        this.isHovered = this.checkHover(params.mousePos);
        if (this.isDragged){
            g_active_id = id;
            if (!params.mouseDown) this.isDragged = false;
            return;
        }
        if (this.isHovered && params.mouseDown) {
            g_active_id = id;
            this.isDragged = true;
            this.clickOffset = {
                x : this.x - params.mousePos.x,
                y : this.y - params.mousePos.y,
            }
        }
    }

    doDrag(mousePos) {
        if (this.isDragged) {
            this.x = mousePos.x + this.clickOffset.x;
            this.y = mousePos.y + this.clickOffset.y;
        }
    }

    checkHover(mouse){
        var dist2 = (this.x - mouse.x)*(this.x - mouse.x) + (this.y - mouse.y)*(this.y - mouse.y);
        return dist2 < this.radius * this.radius;
    }
}

var nodes = [new node(50,50)]
var g_active_id = -1;

function chainEditor_update(params){
    if (params.mouseDown) g_active_id = -1;
    for (var i in nodes){
        nodes[i].update(params, i);
    }
}
