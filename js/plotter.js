var plot_canvas = document.getElementById("plotCanvas");
var plot_ctx = plot_canvas.getContext("2d");

const hsvcolors = [
    '#eb3434',
    '#34cdeb',
    '#ebe534',
    '#68eb34',
    '#8634eb',
    '#eb3486',
]

function plot(X,Y, color='black', xrange=null, yrange=null, clear=false){
    if (clear) plot_ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (xrange == null) xrange = { min : Math.min(...X), max : Math.max(...X), };
    if (yrange == null) yrange = { min : Math.min(...Y), max : Math.max(...Y), };
    if (X.length != Y.length) console.warn("[plot] length of X and Y is different");

    var n = X.length;
    var Xscaled = X.map((x) => { return linmap(x, xrange.min, xrange.max, 0, plot_canvas.width); });
    var Yscaled = Y.map((y) => { return linmap(y, yrange.min, yrange.max, plot_canvas.height, 0); });

    plot_ctx.strokeStyle = color;
    plot_ctx.lineWidth = 2;
    plot_ctx.beginPath();
    plot_ctx.moveTo(Xscaled[0], Yscaled[0]);
    for (var i = 1; i < n; i++) plot_ctx.lineTo(Xscaled[i], Yscaled[i]);
    plot_ctx.stroke();

}

function plotN(X, Ys, xrange=null, yrange=null){
    if (xrange == null) xrange = { min : Math.min(...X), max : Math.max(...X), };
    if (yrange == null) yrange = { min : Math.min(...Ys.flat()), max : Math.max(...Ys.flat()), };
    plot(X,Ys[0], 'black', xrange, yrange, true);
    for (var i = 1; i < Ys.length; i++) 
        plot(X,Ys[i], hsvcolors[(i-1) % hsvcolors.length], xrange, yrange);
}
