class Connection {
    constructor(parentNode, childNode, parentMode){
        this.parentNode = parentNode;
        this.childNode = childNode;
        this.parentMode = parentMode;
        this.size = V2(0,0);
        this.pos  = V2(0,0);
    }

    update(params, id){
        this.display(params, id);
        this.checkHover(params, id);
    }

    checkHover(params, id){
        if (!params.mouseDown) return;
        if (inRect(params.mousePos, this.pos, v2add(this.pos, this.size))) g_active_conn_id = id;
    }

    display(params, id) {
        var ctx = params.ctx;
        this.displayArrows(ctx, id);
        this.displayText(ctx, id);
    }

    displayArrows(ctx, id){
        var child     = this.childNode;
        var pare      = this.parentNode;
        var direction = v2sub(child.pos, pare.pos);
        var normal    = v2scale(direction, 1/v2len(direction));
        var displace  = v2scale(normal, pare.radius + 10);
        var posA      = v2add(pare.pos , displace);
        var posB      = v2sub(child.pos, displace);
        drawArrow(ctx, posA.x, posA.y, posB.x, posB.y, 2, "#ffffff");
    }

    displayText(ctx, id){
        const text_dy  = 14;
        const text_pad = 5;
        var child     = this.childNode;
        var pare      = this.parentNode;
        var direction = v2sub(child.pos, pare.pos);
        var posText   = v2add(pare.pos, v2scale(direction, 0.5));
        var padSize   = V2(text_pad, text_pad)

        var textLabel = this.getTransLabel();
        ctx.textBaseline = "middle";
        ctx.font = "10px Arial";
        var textSize  = V2(ctx.measureText(textLabel).width, 10)
        this.size     = v2add(textSize, v2scale(padSize,2));
        var halfsize  = v2scale(this.size, 0.5);
        this.pos      = v2add(v2sub(posText, halfsize) , V2(0, -text_dy));

        // background
        // ctx.fillStyle   = "#333333cc";
        ctx.fillStyle = (id == g_active_conn_id) ? "#0000ff" : "#333333cc";
        ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);

        ctx.fillStyle   = "#ffffff";
        ctx.fillText(textLabel, posText.x, posText.y - text_dy);

    }

    getTransLabel(){
        var percentage = this.parentMode.percentage;
        var parentMode = this.parentMode;
        var parentNuclide = parentMode.nuclide;
        if (percentage == 1)
            return `${parentMode.decayMode} ${parentNuclide.halfLife} ${parentNuclide.halfLifeUnit}`;
        else
            return `${parentMode.decayMode} (${parentMode.percentage*100}%) ${parentNuclide.halfLife} ${parentNuclide.halfLifeUnit}`;
    }
}

class Node {
    constructor(x,y, nuclide) {
        this.pos = { x : x, y : y };
        this.nuclide = nuclide;
        // this.nuclide.setNode(this);
        this.connections = [];
        // this.childs = [];

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
        ctx.strokeStyle = (id == g_active_node_id) ? "#0000ff" : "#333333";
        ctx.lineWidth   = 5;

        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.textAlign = "center";
        ctx.lineWidth   = 2;
        ctx.textBaseline = "middle";
        ctx.font = "20px Arial";
        ctx.fillStyle   = "#0e0e0e";
        ctx.fillText(this.nuclide.name, this.pos.x, this.pos.y);
    }


    checkDrag(params, id) {
        this.isHovered = this.checkHover(params.mousePos);
        if (this.isDragged){
            g_active_node_id = id;
            if (!params.mouseDown) {
                this.isDragged = false;
                g_isDragging = false;
            }
            return;
        }
        if (this.isHovered && params.mouseDown) {
            g_active_node_id = id;
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
}


/*
 * assuming parentNode already exist in nodes
 * childNode will be added into nodes afterward
 */
function setChild(parentNode, childNode){
    g_nodes.push(childNode);
    parentNode.nuclide.halfLife = 1.0;
    var mode = new ParentMode(parentNode.nuclide, parentType.decay, decayMode.alpha, 1.0);
    childNode.nuclide.addParent(mode);
    g_connections.push(new Connection(parentNode, childNode, mode));
}

function newChildActive(){
    if (g_active_node_id < 0) return;
    var activeNode = g_nodes[g_active_node_id];
    var newNode    = new Node(activeNode.pos.x + 100,activeNode.pos.y, new Nuclide("X"));
    setChild(activeNode, newNode);
}

var g_active_node_id  = -1;
var g_active_conn_id  = -1;
var g_isDragging = false;

var nuclide0 = new Nuclide("A", 100);
var g_nodes = [new Node(150,150,nuclide0)];
var g_connections = [];

var nuclide1 = new Nuclide("B");
setChild(g_nodes[0], new Node(300,100,nuclide1));


function chainEditor_update(params){
    if (params.mouseDown) {
        g_active_node_id = -1;
        g_active_conn_id = -1;
    }
    for (var i in g_nodes){ g_nodes[i].nuclide.nodeId = i; }
    for (var i in g_nodes){ g_nodes[i].update(params, i); }
    for (var i in g_connections){ g_connections[i].update(params, i); }
}

document.getElementById("addChildButton").onclick = newChildActive;
