/*
 * Solver for system of linear ODE 
 * in the form of dyᵢ/dt = fun(t,yᵢ)
 * from t = a to t = b with step dt = h
 * with initial value y = y0
 */
const Solver = {
    euler : function(fun, a, b, y0,h) {
        var n = Math.ceil((b-a)/h);

        // prepare array
        var T = new Array(n+1).fill(0);
        var Y = new Array(n+1);

        //initial condition
        T[0] = a;
        Y[0] = y0;

        //algorithm
        for (var i = 0; i < n; i++){
            T[i+1] = T[i] + h;
            Y[i+1] = v_add(Y[i], v_scale(fun(T[i],Y[i]),h));
        }

        return { T : T, Y : Y };
    },
    RK4 : function(fun, a, b, y0,h) {
        var n = Math.ceil((b-a)/h);

        // prepare array
        var T = new Array(n+1).fill(0);
        var Y = new Array(n+1);

        //initial condition
        T[0] = a;
        Y[0] = y0;

        //algorithm
        for (var i = 0; i < n+1; i++){
            T[i+1] = T[i] + h;
        }
    },
}
