function gen_equation_matrix(nodes, conns, flux){
    // dNᵢ/dt = Σₖ βₖᵢλₖNₖ + Σⱼ βⱼᵢσⱼφNⱼ + (-λᵢ-σᵢϕ)Nᵢ
    // initialize matrix
    var matrix = [];
    for (var i in nodes) {
        matrix[i] = [];
        for (var j in nodes) matrix[i][j] = 0;
    }
    for (var k in conns){
        var conn = conns[k];
        if (conn.mode.transType == transType.capture){
            console.log(k);
            var i    = conn.parentNode.nuclide.nodeId;
            var crossSect = conn.mode.crossSect;
            matrix[i][i] += -crossSect * flux;
        }
    }
    for (var i in nodes){
        var nuclide = nodes[i].nuclide;
        // reduce 
        matrix[i][i] += -nuclide.parseHalfLife()
        // increase
        for (var pid in nuclide.parentModes){
            var mode          = nuclide.parentModes[pid];
            var parentNuclide = mode.nuclide;
            var j             = parentNuclide.nodeId;
            // decay
            if (mode.transType == transType.decay){
                matrix[i][j] += mode.percentage * parentNuclide.parseHalfLife();
            }
            else if (mode.transType == transType.capture){
                matrix[i][j] += mode.percentage * mode.crossSect * flux;
            }
        }
    }
    return matrix;
}

function get_initial_value(nodes){
    return nodes.map((node) => { return node.nuclide.initialCount; });
}

function gen_diff_equation_function(nodes, conns, flux){
    var matrix = gen_equation_matrix(nodes, conns, flux);
    var n = nodes.length;

    return function(t,N){
        var dNdt = new Array(n).fill(0);
        if (N.length != n) console.warn("length of N is inconsistent");
        for (var i = 0; i < n; i++){
            for (var j = 0; j < n; j++){
                // dNᵢ/dt = M[i,j] Nⱼ
                dNdt[i] += matrix[i][j] * N[j];
            }
        }
        return dNdt;
    };
}

var g_neutronFlux = 0;
var g_dt = 0.1;
var g_t0 = 0;
var g_tend = 10;

function solve(){
    const fun = gen_diff_equation_function(g_nodes, g_connections, g_neutronFlux);
    var N0    = get_initial_value(g_nodes);
    var result = Solver.euler(fun, g_t0, g_tend, N0, g_dt);
    var T = result.T;
    var N = m_transpose(result.Y);
    g_Plotter.plotN(T,N);

    var nuclideNames = g_nodes.map((node) => { return node.nuclide.name; });
    g_Plotter.displayLegend(nuclideNames);
    // plot(result.T, m_transpose(result.Y)[0], null, null, true);
    // plot(result.T, m_transpose(result.Y)[1]);
}

document.getElementById("evaluateButton").onclick = solve;
