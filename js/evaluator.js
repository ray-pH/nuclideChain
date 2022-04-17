function gen_equation_matrix(nodes){
    // dNᵢ/dt = Σₖ βₖᵢλₖNₖ + Σⱼ βⱼᵢσⱼφNⱼ + (-λᵢ-σᵢϕ)Nᵢ
    // initialize matrix
    var matrix = [];
    for (var i in nodes) {
        matrix[i] = [];
        for (var j in nodes) matrix[i][j] = 0;
    }
    for (var i in nodes){
        var nuclide = nodes[i].nuclide;
        // reduce 
        matrix[i][i] = -nuclide.parseHalfLife()
        // increase
        for (var pid in nuclide.parentModes){
            var parentMode    = nuclide.parentModes[pid];
            var parentNuclide = parentMode.nuclide;
            var j             = parentNuclide.nodeId;
            if (parentMode.parentType == parentType.decay){
                matrix[i][j] += parentMode.percentage * parentNuclide.parseHalfLife();
            }
        }
    }
    return matrix;
}

function gen_diff_equation_function(nodes){
    var matrix = gen_equation_matrix(nodes);
    var n = nodes.length;

    return function(t,N){
        var dNdt = new Array(n);
        if (N.length != n) console.log("length of N is inconsistent");
        for (var i = 0; i < n; i++){
            for (var j = 0; j < n; j++){
                // dNᵢ/dt = M[i,j] Nⱼ
                dNdt[i] = matrix[i][j] * N[j];
            }
        }
        return dNdt;
    };
}

var g_dt = 0.1;
var g_t0 = 0;
var g_tend = 10;
