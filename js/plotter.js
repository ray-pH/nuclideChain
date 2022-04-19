const hsvcolors = [
    '#0e0e0e',
    '#eb3434',
    '#34cdeb',
    '#ebe534',
    '#68eb34',
    '#8634eb',
    '#eb3486',
]

class Plot {

constructor(canvas, context, pad){
    this.canvas = canvas;
    this.ctx = context;
    this.pad = pad;
}

plotClear(){ this.ctx.clearRect(0, 0, plot_canvas.width, plot_canvas.height); }
getPlotArea(){
    var plot_origin   = V2(this.pad, this.pad);
    var plot_size     = V2(plot_canvas.width - 2*this.pad, plot_canvas.height - 2*this.pad);
    var plot_opposite = v2add(plot_origin, plot_size)
    return [plot_origin, plot_size, plot_opposite];
}

// drawAxes(xrange, yrange, xticks = null, ytickx = null){
drawAxes(xrange, yrange, xtickstep = null, ytickstep = null){
    var optimal_nticks = 10;
    // if (xtickstep == null) xtickstep = Math.pow(10,Math.round(Math.log10(( xrange.max - xrange.min)/optimal_nticks )));
    // if (ytickstep == null) ytickstep = Math.pow(10,Math.round(Math.log10(( yrange.max - yrange.min)/optimal_nticks )));
    if (xtickstep == null) xtickstep = Math.round(( xrange.max - xrange.min)/optimal_nticks );
    if (ytickstep == null) ytickstep = Math.round(( yrange.max - yrange.min)/optimal_nticks );

    var xticks = [xrange.min]
    while (xticks[xticks.length-1] + xtickstep <= xrange.max)
        xticks.push(xticks[xticks.length-1] + xtickstep);
    var yticks = [yrange.min]
    while (yticks[yticks.length-1] + ytickstep <= yrange.max)
        yticks.push(yticks[yticks.length-1] + ytickstep);

    var ctx = this.ctx;
    var [plot_origin, plot_size, plot_opposite] = this.getPlotArea();

    ctx.strokeStyle = '#222222';
    ctx.lineWidth = 1;
    ctx.strokeRect(plot_origin.x, plot_origin.y, plot_size.x, plot_size.y);

    var din  = 0;
    var dout = 5;
    ctx.strokeStyle = '#222222';
    ctx.fillStyle   = '#222222';
    var dticktext = 4;
    ctx.lineWidth = 1;
    ctx.font = "10px Arial";

    ctx.textBaseline = 'top';
    ctx.textAlign    = 'center';
    for (var i in xticks){
        var Xscaled = linmap(xticks[i], xrange.min, xrange.max, plot_origin.x, plot_opposite.x);
        ctx.beginPath();
            ctx.moveTo(Xscaled, plot_opposite.y - din);
            ctx.lineTo(Xscaled, plot_opposite.y + dout);
        ctx.stroke();
        ctx.fillText(xticks[i], Xscaled, plot_opposite.y + dout + dticktext);
    }
    ctx.textBaseline = 'middle';
    ctx.textAlign    = 'right';
    for (var i in yticks){
        var Yscaled = linmap(yticks[i], yrange.min, yrange.max, plot_opposite.y, plot_origin.y);
        ctx.beginPath();
            ctx.moveTo(plot_origin.x - dout , Yscaled);
            ctx.lineTo(plot_origin.x + din  , Yscaled);
        ctx.stroke();
        ctx.fillText(yticks[i], plot_origin.x - dout - dticktext, Yscaled);
    }
}

plot(X,Y, color='black', xrange=null, yrange=null, clear=false){
    if (clear) this.plotClear();
    if (xrange == null) xrange = { min : Math.min(...X), max : Math.max(...X), };
    if (yrange == null) yrange = { min : Math.min(...Y), max : Math.max(...Y), };
    if (X.length != Y.length) console.warn("[plot] length of X and Y is different");


    var n = X.length;
    var [origin, size, opposite] = this.getPlotArea();
    // var Xscaled = X.map((x) => { return linmap(x, xrange.min, xrange.max, 0, plot_canvas.width); });
    // var Yscaled = Y.map((y) => { return linmap(y, yrange.min, yrange.max, plot_canvas.height, 0); });
    var Xscaled = X.map((x) => { return linmap(x, xrange.min, xrange.max, origin.x, opposite.x); });
    var Yscaled = Y.map((y) => { return linmap(y, yrange.min, yrange.max, opposite.y, origin.y); });

    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(Xscaled[0], Yscaled[0]);
    for (var i = 1; i < n; i++) this.ctx.lineTo(Xscaled[i], Yscaled[i]);
    this.ctx.stroke();

}

plotN(X, Ys, xrange=null, yrange=null){
    if (xrange == null) xrange = { min : Math.min(...X), max : Math.max(...X), };
    if (yrange == null) yrange = { min : Math.min(...Ys.flat()), max : Math.max(...Ys.flat()), };
    this.plotClear();
    for (var i = 0; i < Ys.length; i++) 
        this.plot(X,Ys[i], hsvcolors[i % hsvcolors.length], xrange, yrange);
    this.drawAxes(xrange, yrange);
}

}
