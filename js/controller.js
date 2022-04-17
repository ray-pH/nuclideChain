g_prevActiveId = null

function updateController(){
    if (g_active_id == g_prevActiveId) return;
    // active id changed
    if (g_active_id < 0) g_ctrlDiv.innerHTML = "-1";
    else {
        g_ctrlDiv.innerHTML = genNuclideInnerHTML(g_active_id);
        setupNuclideController(g_active_id);
    }

    g_prevActiveId = g_active_id;
}

function funChangeNuclideAttribute(nuclide, inp_name, inp_halfLife, inp_initialCount){
    return function() {
        nuclide.name         = inp_name.value;
        nuclide.halfLife     = Number(inp_halfLife.value);
        nuclide.initialCount = Number(inp_initialCount.value);
    }
}

function setupNuclideController(id){
    var nuclide = g_nodes[id].nuclide;
    var inp_name = document.getElementById('inp_name');
    var inp_halfLife = document.getElementById('inp_halfLife');
    var inp_initialCount = document.getElementById('inp_initialCount');
    var inps = [inp_name, inp_halfLife, inp_initialCount];
    for (var i in inps){
        inps[i].addEventListener('change', funChangeNuclideAttribute(nuclide, inp_name, inp_halfLife, inp_initialCount));
    }
}

/*
 * Return a string for innerHTML
 */
function genNuclideInnerHTML(id){
    var nuclide = g_nodes[id].nuclide;
    var str = `
    name :
    <input id="inp_name" value="${nuclide.name}"><br>
    halfLife :
    <input id="inp_halfLife" value="${nuclide.halfLife}"><br>
    <select name="halfLifeUnit" id="inp_halfLifeUnit">
    <option value="s">s</option>
    <option value="min">min</option>
    </select><br>
    initialCount:
    <input id="inp_initialCount" value="${nuclide.initialCount}"><br>
    `
    return str;
}

