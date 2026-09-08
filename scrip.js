document.addEventListener("DOMContentLoaded", () => {
    // Corrección / fallback con || [] si no existen citas guardadas
    let citas = JSON.parse(localStorage.getItem("citassalon")) || [];
    const formulario = document.getElementById("form-agenda");
    const listacitas = document.getElementById("lista-citas");

    function mostrarcitas() {
        if (!listacitas) return; // Validación por si no estamos en la página de agenda
        listacitas.innerHTML = "";
        
        if (citas.length === 0) {
            listacitas.innerHTML = "<p class='sin-citas'>No hay citas programadas para hoy.</p>";
            return;
        }

        citas.forEach((cita, index) => {
            const divcita = document.createElement("div");
            divcita.className = "tarjeta-cita";
            divcita.innerHTML = `
                <div class="info-cita">
                    <p><strong>Cliente:</strong> ${cita.cliente}</p>
                    <p><strong>Servicio:</strong> ${cita.servicio}</p>
                    <p><strong>Fecha/Hora:</strong> ${formatearFecha(cita.fecha)}</p>
                </div>
            `;
            listacitas.appendChild(divcita);
        });
    }

    function formatearFecha(fechaString) {
        if (!fechaString) return "no asignada";
        const opciones = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
        return new Date(fechaString).toLocaleDateString("es-Es", opciones);
    }

    // Ejecución inicial de citas
    mostrarcitas();

    // ==========================================
    // CÓDIGO NUEVO PARA EL SISTEMA DE PAGOS
    // ==========================================

    // Buscamos si hay servicios guardados para pagar en el carrito, si no, empezamos vacío
    let carrito = JSON.parse(localStorage.getItem('carritoSalon')) || [];

    // Esta función se activa al dar clic en los botones "Pagar Servicio" de servicios.html
    function agendar(nombreServicio, precioServicio) {
        carrito.push({ nombre: nombreServicio, precio: precioServicio });
        localStorage.setItem('carritoSalon', JSON.stringify(carrito));
        
        // CORREGIDO: Uso correcto de comillas invertidas para variables
     alert(`¡${nombreServicio} añadido al carrito! Ve a la pestaña 'Pagos' para finalizar.`);
        mostrarListaEnPantalla();
    }

    // Función que dibuja la lista de precios en tu pantalla
    function mostrarListaEnPantalla() {
        const listaPagos = document.getElementById('lista-pagos');
        const elementoTotal = document.getElementById('total');
        const seccionPagos = document.getElementById('pagos');

        if (!listaPagos || !elementoTotal || !seccionPagos) return;

        listaPagos.innerHTML = "";
        let sumaTotal = 0;

        if (carrito.length === 0) {
            listaPagos.innerHTML = "<li>No hay servicios seleccionados para pagar.</li>";
            elementoTotal.textContent = "Total a Pagar: $0";
            // Si el botón ya existía de un proceso anterior, lo removemos
            const botonExistente = document.getElementById('btn-pagar-pasarela');
            if (botonExistente) botonExistente.remove();
            return;
        }

        // Recorremos el carrito para poner los servicios elegidos en la lista
        carrito.forEach((item) => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${item.nombre}</strong> - $${item.precio.toLocaleString(`es-CO`)}`;
            listaPagos.appendChild(li);
            sumaTotal += item.precio;
        });

        // Mostramos el precio total en la pantalla
        elementoTotal.textContent = `Total a Pagar: ${sumaTotal.toLocaleString(`es-CO`)}`;

        // CORREGIDO: Evaluamos si el carrito tiene elementos usando .length y si el botón no se ha creado
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
            botonPagar.style.fontWeight = 'bold';

            // Acción al presionar el botón verde
            botonPagar.onclick = ()=>procesarpagocarrito(sumaTotal);
            
            // CORREGIDO: Variable con nombre exacto
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
    mostrarListaEnPantalla();
    // 1. Función que conecta con el archivo PHP puente para XAMPP
async function procesarPagoCarrito(sumaTotal) {
    if (sumaTotal <= 0) return;

    // Generamos la referencia única requerida por tu tabla PAGOS en phpMyAdmin
    const referenciaUnica ='SALON-${Date.now()}';

    try {
        const respuesta = await fetch('guardar_pago.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ referencia: referenciaUnica })
        });

        const resultado = await respuesta.json();

        // Si se guardó con éxito en MySQL, procedemos a abrir el Widget de Wompi
        if (resultado.success) {
            console.log("¡Registrado en MySQL con éxito!");
            
            // Limpiamos el carrito local
            localStorage.removeItem('carritoSalon');
            carrito = [];
            
            // Creamos el botón oficial de Wompi
            renderizarBotonWompi(referenciaUnica, sumaTotal * 100); 
        } else {
            alert("Error al registrar en la base de datos: " + resultado.message);
        }
    } catch (error) {
        console.error("No se pudo conectar con guardar_pago.php:", error);
    }
}

// 2. Función que renderiza el botón azul oficial de Wompi
function renderizarBotonWompi(referencia, montoCentavos) {
    // Apunta exactamente al div contenedor que pusimos en tu index.html/pagos.html
    const seccionWompi = document.getElementById('contenedor-Wompi-real'); 
    if (!seccionWompi) return;

    // Si ya existía un botón anterior, lo removemos para actualizar el total
    const botonExistente = document.getElementById('btn-pagos-wompi');
    if (botonExistente) {
        botonExistente.parentElement.remove();
    }

    const formularioWompi = document.createElement('form');
    const scriptWompi = document.createElement('script');
    
    scriptWompi.src = "https://wompi.co";
    scriptWompi.setAttribute('data-render', 'button');
    scriptWompi.setAttribute('data-public-key', 'pub_test_Q5Yl496v60CDZg69E89yv8L2626Ff289');
    scriptWompi.setAttribute('data-currency', 'COP');
    scriptWompi.setAttribute('data-amount-in-cents', montoCentavos.toString());
    scriptWompi.setAttribute('data-reference', referencia);

    formularioWompi.appendChild(scriptWompi);
    seccionWompi.appendChild(formularioWompi);

    // El MutationObserver cambia el botón gris estándar de Wompi por el azul personalizado
    const observer = new MutationObserver((mutations, obs) => {
        const botonWompi = formularioWompi.querySelector('button');
        if (botonWompi) {
            botonWompi.id = 'btn-pagos-wompi';
            botonWompi.textContent = 'Pagar de forma Segura con Wompi (Nequi/PSE)';
            
            Object.assign(botonWompi.style, {
                backgroundColor: '#00c3de',
                color: '#fff',
                padding: '12px 25px',
                border: 'none',
                cursor: 'pointer',
                marginTop: '15px',
                borderRadius: '5px',
                fontWeight: 'bold',
                width: '100%'
            });
            obs.disconnect();
        }
    });
    observer.observe(formularioWompi, { childList: true });
}

}); // Cierre definitivo del DOMContentLoaded de la línea 1