document.addEventListener("DOMcontentLoaded", () => {
    let citas=JSON.parse(localStorange.getItem("citasSalon"));
    const formulario=document.getElementById("form-agenda");
    const listacitas=document.getElementById("lista-citas");
    function mostrarCitas(){
        listacitas.innerHTML="";
        if (citas.length===0){
            listacitas.innerHTML=`<p class="sin-citas">No hay citas programadas para hoy.</p>`;
            return;
            } 
            citas.forEach((cita, index)=>{
                const divCita=document.createElement("div");
                divCita.className="targeta-cita";
                divCita.innerHTML=`
                <div class="info-cita">
                <p><strong>cliente:</strong>${cita.cliente}</p>
                <p><strong>servicio:</strong>${cita.servicio}</p>
                <p><strong>fecha/hora:</strong>${formatearFecha(citas.fecha)}</p>
                </div>
                `;
                listacitas.appendChild(divCita);   
            });
            }
            mostrarCitas();
             });