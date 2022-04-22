var g_canvas    = document.getElementById("canvas");
var g_ctrlDiv   = document.getElementById("div_controller");
var g_noticeDiv = document.getElementById("div_notice");
var g_warnDiv   = document.getElementById("div_warn");
var g_ctx = canvas.getContext("2d");
g_canvas.width = window.innerWidth - g_ctrlDiv.clientWidth - 100;

// TODO proper object
var plot_canvas = document.getElementById("plotCanvas");
var plot_legend_canvas = document.getElementById("legendCanvas");
var plot_pad = 50;
var g_Plotter = new Plot(plot_canvas, plot_legend_canvas, plot_pad);

var g_mousePos = {x : 0, y : 0};
var g_mouseDown = false;
var g_debug = null;

canvas.addEventListener("mousemove", function(e) {
    g_mousePos = {
        x : e.offsetX,
        y : e.offsetY
    }
});
window.addEventListener("resize", function() {
    g_canvas.width = window.innerWidth - g_ctrlDiv.clientWidth - 100;
});
function setMouseState(e) {
    var flags = e.buttons !== undefined ? e.buttons : e.which;
    g_mouseDown = (flags & 1) === 1;
}
g_canvas.addEventListener("mousedown", setMouseState);
g_canvas.addEventListener("mousemove", setMouseState);
g_canvas.addEventListener("mouseup", setMouseState);

function setNotice(message, imp=0){
    g_noticeDiv.innerHTML = message;
}

function loop() {
    g_ctx.fillStyle = "#0e0e0e";
    g_ctx.fillRect(0, 0, g_canvas.width, g_canvas.height);

    var params = {
        ctx       : g_ctx,
        mousePos  : g_mousePos,
        mouseDown : g_mouseDown,
    }
    chainEditor_update(params);
    updateController();
    setTimeout(loop, 10);
}
loop();
