g_prevActiveId = null

function updateController(){
    if (g_active_id != g_prevActiveId){
        g_ctrlDiv.innerHTML = g_active_id;
        g_prevActiveId = g_active_id;
    }
}
