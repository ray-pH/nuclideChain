class Node {
    constructor(x,y, nuclide) {
        this.pos = { x : x, y : y };
        this.nuclide = nuclide;
        // this.nuclide.setNode(this);
        this.childs = [];

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
        ctx.strokeStyle = (id == g_active_id) ? "#0000ff" : "#333333";
        ctx.lineWidth   = 5;

        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.textAlign = "center";
        ctx.lineWidth   = 2;
        ctx.font = "20px Arial";
        ctx.fillStyle   = "#0e0e0e";
        ctx.fillText(this.nuclide.name, this.pos.x, this.pos.y + 8);

        this.displayArrows(ctx, id);
    }

    displayArrows(ctx, id){
        if (this.childs.length <= 0) return;
        for (var i in this.childs){
            var child     = this.childs[i];
            var direction = v2sub(child.pos, this.pos);
            var normal    = v2scale(direction, 1/v2len(direction));
            var displace  = v2scale(normal, this.radius + 10);
            var posA      = v2add(this.pos , displace);
            var posB      = v2sub(child.pos, displace);
            drawArrow(ctx, posA.x, posA.y, posB.x, posB.y, 2, "#ffffff");

            var textLabel = this.getTransLabel(i, id);
            var posText   = v2add(this.pos, v2scale(direction, 0.5));
            ctx.font = "10px Arial";
            ctx.fillStyle   = "#ffffff";
            ctx.fillText(textLabel, posText.x, posText.y - 10);
        }
    }

    checkDrag(params, id) {
        this.isHovered = this.checkHover(params.mousePos);
        if (this.isDragged){
            g_active_id = id;
            if (!params.mouseDown) {
                this.isDragged = false;
                g_isDragging = false;
            }
            return;
        }
        if (this.isHovered && params.mouseDown) {
            g_active_id = id;
            this.isDragged = true;
            g_isDragging = true;
            this.clickOffset = v2sub(this.pos, params.mousePos);
        }
    }

    doDrag(mousePos) {
        if (this.isDragged) {
            this.pos = v2add(mousePos, this.clickOffset);
        }
    }

    checkHover(mouse){
        if (!this.isDragged && g_isDragging) return false;
        var dist2 = v2len2( v2sub(this.pos, mouse) );
        return dist2 < this.radius * this.radius;
    }

    addChild(childNode){
        // childNode.nuclide.addParent(this.nuclide, parentType.decay, decayMode.misc, 1.0);
        childNode.nuclide.addParent(this.nuclide, parentType.decay, decayMode.alpha, 1.0);
        this.childs.push(childNode);
    }

    getTransLabel(childId, id){
        var parentMode = this.childs[childId].nuclide.getTransInfo(id);
        if(parentMode == null) return "error";
        var percentage = parentMode.percentage;
        if (percentage == 1)
            return `${parentMode.decayMode} ${this.nuclide.halfLife} ${this.nuclide.halfLifeUnit}`;
        else
            return `${parentMode.decayMode} (${parentMode.percentage*100}%) ${this.nuclide.halfLife} ${this.nuclide.halfLifeUnit}`;
    }
}

/*
 * assuming parentNode already exist in nodes
 * childNode will be added into nodes afterward
 */
function newChild(nodes, parentNode, childNode){
    nodes.push(childNode);
    parentNode.nuclide.halfLife = 1.0;
    parentNode.addChild(childNode);
}

function newChildActive(){
    if (g_active_id < 0) return;
    var newNode    = new Node(100,100, new Nuclide("X"));
    newChild(g_nodes, g_nodes[g_active_id], newNode);
}

var g_active_id  = -1;
var g_isDragging = false;

var nuclide0 = new Nuclide("A", 100);
var g_nodes = [new Node(150,150,nuclide0)];

var nuclide1 = new Nuclide("B");
newChild(g_nodes, g_nodes[0], new Node(300,100,nuclide1));


function chainEditor_update(params){
    if (params.mouseDown) g_active_id = -1;
    for (var i in g_nodes){
        g_nodes[i].nuclide.nodeId = i;
    }
    for (var i in g_nodes){
        g_nodes[i].update(params, i);
    }
}

document.getElementById("addChildButton").onclick = newChildActive;
