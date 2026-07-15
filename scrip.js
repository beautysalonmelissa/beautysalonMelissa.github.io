document.addEventListener("DOMcontentLoaded", () => {
    //correccion: fallback con || [] si no existen citas guardadas
    let citas=JSON.parse(localStorange.getItem("citasSalon")) || [];
    const formulario= document.getElementById("form-agenda");
    const listacitas= document.getElementById("lista-citas");
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
            function formatearFecha(fechaString){
                if (!fechaString) return "no asignada";
                const opciones= { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"};
                return new date(fechaString). tolocaleDateString("es-Es", opciones);
                }
                //ejecucion inicial
            mostrarCitas();
             });