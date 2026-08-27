document.addEventListener("DOMcontentLoaded", () => {
    //correccion: fallback con || [] si no existen citas guardadas
    let citas=JSON.parse(loCalStorage.getItem("citasSalon")) || [];
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
                divCita.classname="targeta-cita";
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
             // ==========================================
// CÓDIGO NUEVO PARA EL SISTEMA DE PAGOS
// ==========================================

// Buscamos si hay servicios guardados para pagar, si no, empezamos vacío
let carrito = JSON.parse(localStorage.getItem('carritoSalon')) || [];

// Esta función se activa al dar clic en los botones "Pagar Servicio" de servicios.html
function agendar(nombreServicio, precioServicio) {
    // Añadimos el servicio al carrito para cobrarlo
    carrito.push({ nombre: nombreServicio, precio: precioServicio });
    
    // Lo guardamos en la memoria
    localStorage.setItem('carritoSalon', JSON.stringify(carrito));
    
    alert(¡${nombreServicio} añadido al carrito! Ve a la pestaña 'Ver Pagos' para finalizar.);
}

// Función que dibuja la lista de precios en tu pantalla pagos.html
function mostrarListaEnPantalla() {
    const listaPagos = document.getElementById('lista-pagos'); // ID corregido sin espacios
    const elementoTotal = document.getElementById('total');
    const seccionPagos = document.getElementById('pagos');

    // Si el usuario no está en la página de pagos, la función se detiene para no causar errores
    if (!listaPagos) return;

    listaPagos.innerHTML = "";
    let sumaTotal = 0;

    // Recorremos el carrito para poner los servicios elegidos en la lista
    carrito.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = ${item.nombre} - $${item.precio.toLocaleString('es-CO')};
        listaPagos.appendChild(li);
        sumaTotal += item.precio;
    });

    // Mostramos el precio total en la pantalla
    elementoTotal.textContent = Total a Pagar: $${sumaTotal.toLocaleString('es-CO')};

    // Si hay cosas por pagar y el botón verde no existe, lo creamos de una vez
    if (carrito.length > 0 && !document.getElementById('btn-pagar-pasarela')) {
        const botonPagar = document.createElement('button');
        botonPagar.id = 'btn-pagar-pasarela';
        botonPagar.textContent = 'Pagar de forma Segura (Mercado Pago)';
        
        // Estilos para que el botón resalte en verde
        botonPagar.style.backgroundColor = '#2ecc71';
        botonPagar.style.color = 'white';
        botonPagar.style.padding = '12px 25px';
        botonPagar.style.border = 'none';
        botonPagar.style.cursor = 'pointer';
        botonPagar.style.marginTop = '15px';
        botonPagar.style.borderRadius = '5px';

        // Acción al presionar el botón verde
        botonPagar.onclick = procesarTransaccionFinal;
        seccionPagos.appendChild(botonPagar);
    }
}

// Función para simular o conectar la pasarela bancaria
function procesarTransaccionFinal() {
    alert("Conectando de forma segura con la pasarela de pagos colombiana... Por favor espera.");
    
    // Limpiamos el carrito porque el pago ya se procesó
    localStorage.removeItem('carritoSalon');
    carrito = [];
    
    alert("¡Pago realizado con éxito! Tu cita en Beauty Salon Melissa ha sido confirmada.");
    window.location.href = "index.html"; // Regresa al inicio de la página
}

// Hacemos que la lista de pagos se intente dibujar solita apenas cargue la página
document.addEventListener('DOMContentLoaded', mostrarListaEnPantalla);