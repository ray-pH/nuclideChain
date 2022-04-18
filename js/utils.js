function drawArrow(ctx, fromx, fromy, tox, toy, arrowWidth, color){
    //variables to be used when creating the arrow
    var headlen = 10;
    var angle = Math.atan2(toy-fromy,tox-fromx);
 
    ctx.save();
    ctx.strokeStyle = color;
 
    //starting path of the arrow from the start square to the end square
    //and drawing the stroke
    ctx.beginPath();
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.lineWidth = arrowWidth;
    ctx.stroke();
 
    //starting a new path from the head of the arrow to one of the sides of
    //the point
    ctx.beginPath();
    ctx.moveTo(tox, toy);
    ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),
               toy-headlen*Math.sin(angle-Math.PI/7));
 
    //path from the side point of the arrow, to the other side point
    ctx.lineTo(tox-headlen*Math.cos(angle+Math.PI/7),
               toy-headlen*Math.sin(angle+Math.PI/7));
 
    //path from the side point back to the tip of the arrow, and then
    //again to the opposite side point
    ctx.lineTo(tox, toy);
    ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),
               toy-headlen*Math.sin(angle-Math.PI/7));
 
    //draws the paths created above
    ctx.stroke();
    ctx.restore();
}

/*
 * Map x linearly from [a,b] to [A,B]
 */
function linmap(x, a,b, A,B){ return A + ((x-a) * (B-A)/(b-a)); }

function V2(x,y){ return {x:x, y:y}; }
function v2add(a,b){ return { x : a.x + b.x, y : a.y + b.y, }; }
function v2sub(a,b){ return { x : a.x - b.x, y : a.y - b.y, }; }
function v2mul(a,b){ return { x : a.x * b.x, y : a.y * b.y, }; }
function v2scale(v,s){ return { x : s * v.x, y : s * v.y, }; }
function inRect(v, p0,p1) {
    var inX = (p0.x <= v.x) && (v.x <= p1.x);
    var inY = (p0.y <= v.y) && (v.y <= p1.y);
    return inX && inY;
}

function v2len2(v){ return v.x*v.x + v.y*v.y; }
function v2len(v) { return Math.sqrt(v2len2(v)); }

function v_scale(v,s){
    // TODO use map
    var result = new Array(v.length);
    for (var i = 0; i < v.length; i++) result[i] = v[i] * s;
    return result;
}
function v_add(a,b) { 
    if (a.length != b.length) return null;
    var result = new Array(a.length);
    for (var i = 0; i < a.length; i++) result[i] = a[i] + b[i];
    return result;
}

/*
 * Transpose 2d matrix (m x n) -> (n x m)
 */
function m_transpose(M){
    var m = M.length;
    var n = M[0].length;
    // generate empty array
    var Mt = new Array(n);
    for (var i = 0; i < n; i++) Mt[i] = new Array(m);
    // fill values
    for (var i = 0; i < m; i++){
        for (var j = 0; j < n; j++){
            Mt[j][i] = M[i][j];
        }
    }
    return Mt;
}
