var plot_canvas = document.getElementById("plotCanvas");
var plot_ctx = plot_canvas.getContext("2d");

function plot(X,Y, xrange=null, yrange=null){
    if (xrange == null) xrange = { min : Math.min(...X), max : Math.max(...X), };
    if (yrange == null) yrange = { min : Math.min(...Y), max : Math.max(...Y), };
    if (X.length != Y.length) console.warn("[plot] length of X and Y is different");

    var n = X.length;
    var Xscaled = X.map((x) => { return linmap(x, xrange.min, xrange.max, 0, plot_canvas.width); });
    var Yscaled = Y.map((y) => { return linmap(y, yrange.min, yrange.max, plot_canvas.height, 0); });

    plot_ctx.strokeStyle = 'black';
    plot_ctx.lineWidth = 2;
    plot_ctx.beginPath();
    plot_ctx.moveTo(Xscaled[0], Yscaled[0]);
    for (var i = 1; i < n; i++) plot_ctx.lineTo(Xscaled[i], Yscaled[i]);
    plot_ctx.stroke();

}
