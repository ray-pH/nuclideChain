

function gen_diff_equation_matrix(nodes){
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

