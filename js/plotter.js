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
    plotGetArea(){
        var plot_origin = V2(this.pad, this.pad);
        var plot_size   = V2(plot_canvas.width - 2*this.pad, plot_canvas.height - 2*this.pad);
        return [plot_origin, v2add(plot_origin,plot_size)];
    }
    // plotDrawAxes(){

    // }
    plot(X,Y, color='black', xrange=null, yrange=null, clear=false){
        if (clear) this.plotClear();
        if (xrange == null) xrange = { min : Math.min(...X), max : Math.max(...X), };
        if (yrange == null) yrange = { min : Math.min(...Y), max : Math.max(...Y), };
        if (X.length != Y.length) console.warn("[plot] length of X and Y is different");

        var n = X.length;
        var [origin, opposite] = this.plotGetArea();
        // var Xscaled = X.map((x) => { return linmap(x, xrange.min, xrange.max, 0, plot_canvas.width); });
        // var Yscaled = Y.map((y) => { return linmap(y, yrange.min, yrange.max, plot_canvas.height, 0); });
        var Xscaled = X.map((x) => { return linmap(x, xrange.min, xrange.max, origin.x, opposite.x); });
        var Yscaled = Y.map((y) => { return linmap(y, yrange.min, yrange.max, origin.y, opposite.y); });

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
    }
}
