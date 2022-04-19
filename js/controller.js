g_prevActiveNodeId = null
g_prevActiveConnId = null

function updateController(){
    var idChanged = (g_active_node_id != g_prevActiveNodeId) || (g_active_conn_id != g_prevActiveConnId)
    if (!idChanged) return;
    // id changed
    if (g_active_node_id >= 0 && g_active_node_id < g_nodes.length) {
        g_ctrlDiv.innerHTML = genNuclideInnerHTML(g_active_node_id);
        setupNuclideController(g_active_node_id);
    }
    else if (g_active_conn_id >= 0 && g_active_conn_id < g_connections.length) {
        g_ctrlDiv.innerHTML = genConnectionInnerHTML();
        setupConnectionController(g_active_conn_id);
    }
    else{
        g_ctrlDiv.innerHTML = "-1";
    }

    g_prevActiveNodeId = g_active_node_id;
    g_prevActiveConnId = g_active_conn_id;
}

function funChangeNuclideAttribute(nuclide, inp_name, inp_halfLife, inp_halfLifeUnit, inp_initialCount){
    return function() {
        nuclide.name         = inp_name.value;
        nuclide.halfLife     = Number(inp_halfLife.value);
        nuclide.halfLifeUnit = inp_halfLifeUnit.value;
        nuclide.initialCount = Number(inp_initialCount.value);
    }
}

function funChangeConnectionAttribute(mode, inp_type, inp_decayMode, inp_percentage){
    return function() {
        mode.parentType = inp_type.value;
        mode.decayMode  = inp_decayMode.value;
        mode.percentage = Number(inp_percentage.value);
    }
}

/*
 * Setup value and listener
 */
function setupNuclideController(id){
    var nuclide          = g_nodes[id].nuclide;
    var inp_name         = document.getElementById('inp_name');
    var inp_halfLife     = document.getElementById('inp_halfLife');
    var inp_halfLifeUnit = document.getElementById('inp_halfLifeUnit');
    var inp_initialCount = document.getElementById('inp_initialCount');

    inp_name.value         = nuclide.name;
    inp_halfLife.value     = nuclide.halfLife;
    inp_halfLifeUnit.value = nuclide.halfLifeUnit;
    inp_initialCount.value = nuclide.initialCount;
    var inps = [inp_name, inp_halfLife, inp_halfLifeUnit, inp_initialCount];
    inps.forEach((inp) => {
        inp.addEventListener('change', funChangeNuclideAttribute(nuclide, ...inps))});

    var btn_delete = document.getElementById('btn_delete');
    btn_delete.onclick = () => { deleteNode(g_active_node_id); };
}

function setupConnectionController(id){
    var mode           = g_connections[id].mode;
    var inp_type       = document.getElementById('inp_type');
    var inp_decayMode  = document.getElementById('inp_decayMode');
    var inp_percentage = document.getElementById('inp_percentage');

    inp_type.value       = mode.parentType;
    inp_decayMode.value  = mode.decayMode;
    inp_percentage.value = mode.percentage;

    var inps = [inp_type, inp_decayMode, inp_percentage];
    inps.forEach((inp) => {
        inp.addEventListener('change', funChangeConnectionAttribute(mode, ...inps))});

    var btn_delete = document.getElementById('btn_delete');
    btn_delete.onclick = () => { deleteConnection(g_active_conn_id); };
}

/*
 * Return a string for innerHTML
 */
function genNuclideInnerHTML(id){
    var nuclide = g_nodes[id].nuclide;
    return `
    name :
    <input id="inp_name" value=""><br>
    halfLife :
    <input id="inp_halfLife" value="-1"><br>
    <select name="halfLifeUnit" id="inp_halfLifeUnit">
        <option value="s"  > s   </option>
        <option value="min"> min </option>
        <option value="h"  > h   </option>
        <option value="day"> day </option>
        <option value="mo" > mo  </option>
        <option value="yr" > yr  </option>
    </select><br>
    initialCount:
    <input id="inp_initialCount" value="-1"><br>
    <button id="btn_delete">deleteNode</button>
    `;
}

function genConnectionInnerHTML(){
    return `
    type :
    <select name="type" id="inp_type">
        <option value="${parentType.decay}">  ${parentType.decay}  </option>
        <option value="${parentType.capture}">${parentType.capture}</option>
    </select><br>
    decayMode :
    <select name="decayMode" id="inp_decayMode">
        <option value="${decayMode.misc}">misc</option>
        <option value="${decayMode.alpha}">${decayMode.alpha} (alpha)</option>
        <option value="${decayMode.betaPos}">${decayMode.betaPos} (beta+)</option>
        <option value="${decayMode.betaNeg}">${decayMode.betaNeg} (beta-)</option>
        <option value="${decayMode.proton}">${decayMode.proton} (proton)</option>
        <option value="${decayMode.neutron}">${decayMode.neutron} (neutron)</option>
        <option value="${decayMode.EC}">${decayMode.EC} (electron capture)</option>
        <option value="${decayMode.SF}">${decayMode.SF} (self fission)</option>
    </select><br>
    percentage :
    <input id="inp_percentage" value="-1"><br>
    <button id="btn_delete">deleteConnection</button>
    `;
}
