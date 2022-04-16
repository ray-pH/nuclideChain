var g_canvas = document.getElementById("canvas");
var g_ctx = canvas.getContext("2d");
g_canvas.width = window.innerWidth;

var g_mousePos = {x : 0, y : 0};
var g_mouseDown = false;
var g_isDragging = false;

canvas.addEventListener("mousemove", function(e) {
    g_mousePos = {
        x : e.offsetX,
        y : e.offsetY
    }
});
window.addEventListener("resize", function() {
    g_canvas.width = window.innerWidth;
});
function setMouseState(e) {
    var flags = e.buttons !== undefined ? e.buttons : e.which;
    g_mouseDown = (flags & 1) === 1;
}
g_canvas.addEventListener("mousedown", setMouseState);
g_canvas.addEventListener("mousemove", setMouseState);
g_canvas.addEventListener("mouseup", setMouseState);

function loop() {
    g_ctx.fillStyle = "#0e0e0e";
    g_ctx.fillRect(0, 0, g_canvas.width, g_canvas.height);

    var params = {
        ctx       : g_ctx,
        mousePos  : g_mousePos,
        mouseDown : g_mouseDown,
    }
    chainEditor_update(params);
    setTimeout(loop, 10);
}
loop();
