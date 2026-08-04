let numeroCotizacionGlobal = null;

function obtenerNumeroCotizacion() {

    if (numeroCotizacionGlobal) return numeroCotizacionGlobal;

    let guardado = localStorage.getItem("numeroCotizacionActual");

    if (guardado) {
        numeroCotizacionGlobal = guardado;
        return numeroCotizacionGlobal;
    }

    // NO generar automáticamente aquí
    return null;
}

// GENERAR NUEVA COTIZACION

function generarNuevaCotizacion() {

    const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numeros = "0123456789";

    let codigo = "";

    for (let i = 0; i < 3; i++) {
        codigo += letras.charAt(Math.floor(Math.random() * letras.length));
    }

    for (let i = 0; i < 2; i++) {
        codigo += numeros.charAt(Math.floor(Math.random() * numeros.length));
    }

    numeroCotizacionGlobal = "COT-LABSUPPLY-" + codigo;

    localStorage.setItem("numeroCotizacionActual", numeroCotizacionGlobal);

    // Mostrar en pantalla
    document.getElementById("numeroCotizacionVista").textContent =
        "N° " + numeroCotizacionGlobal;

    mostrarToast("Nueva cotización generada");
}

function asegurarCotizacionActiva() {

    let numeroGuardado = localStorage.getItem("numeroCotizacionActual");

    if (!numeroGuardado) {

        // Generar nueva cotización automáticamente
        generarNuevaCotizacion();

    } else {

        numeroCotizacionGlobal = numeroGuardado;

        const vista = document.getElementById("numeroCotizacionVista");
        if (vista) {
            vista.textContent = "N° " + numeroGuardado;
        }
    }
}

// cotizacion.js
console.log("COTIZACION JS CARGADO");

// ==============================
// OBTENER Y GUARDAR CARRITO
// ==============================
function obtenerCarrito() {
    return JSON.parse(localStorage.getItem("cotizacion")) || [];
}

function guardarCarrito(carrito) {
    carrito.forEach(p => {
        if (!p.cantidad || p.cantidad < 1) p.cantidad = 1;
    });
    localStorage.setItem("cotizacion", JSON.stringify(carrito));
    actualizarResumenCotizacion();
}

// ==============================
// MOSTRAR TABLA PRINCIPAL
// ==============================
function mostrarCotizacion() {
    const carrito = obtenerCarrito();
    renderTablaPrincipal(carrito);
    actualizarPasoProductos();
    actualizarResumenCotizacion();
    renderDetalleFlotante();

    // Escuchar el evento de escritura en el buscador
document.getElementById("buscarCotizacion")?.addEventListener("input", (e) => {
    const texto = e.target.value.toLowerCase();
    const carrito = obtenerCarrito(); // Función definida en cotizacion.js

    // Filtrar los productos que coincidan con el nombre, marca o categoría
    const productosFiltrados = carrito.filter(p => 
        p.nombre.toLowerCase().includes(texto) || 
        p.marca.toLowerCase().includes(texto) ||
        p.categoria.toLowerCase().includes(texto)
    );

    // Volver a dibujar la tabla solo con los resultados filtrados
    renderTablaPrincipal(productosFiltrados); // Función definida en cotizacion.js
});

}

// Tabla principal
// Localiza y reemplaza la función renderTablaPrincipal en cotizacion.js
function renderTablaPrincipal(lista) {
    const contenedor = document.getElementById("listaCotizacion");
    if (!contenedor) return;
    contenedor.innerHTML = "";

    if (lista.length === 0) {
        contenedor.innerHTML = `<tr><td colspan="7" class="text-center">No hay productos</td></tr>`;
        return;
    }

    lista.forEach((p, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td><img src="${p.imagen}" class="img-mini"></td>
            <td class="td-nombre"><strong>${p.nombre}</strong></td>
            <td class="ocultar-movil">${p.marca}</td>
            <td class="ocultar-movil">${p.codigo || p.categoria}</td>
            <td>
                <div class="control-cantidad">
                    <button onclick="decrementarCantidad(${p.id})" class="btn-qty">-</button>
                    <input type="number" min="1" value="${p.cantidad}" 
                        class="input-tabla-cantidad" 
                        onchange="cambiarCantidad(${p.id}, this.value)">
                    <button onclick="incrementarCantidad(${p.id})" class="btn-qty">+</button>
                </div>
            </td>
            <td>
                <button onclick="eliminarProducto(${p.id})" class="btn-borrar">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;
        contenedor.appendChild(tr);
    });
}

// Agrega estas dos funciones al final de tu archivo cotizacion.js
function incrementarCantidad(id) {
    let carrito = obtenerCarrito();
    const producto = carrito.find(p => p.id == id);
    if (producto) {
        producto.cantidad = (Number(producto.cantidad) || 1) + 1;
        guardarCarrito(carrito);
        mostrarCotizacion();
        actualizarContador();
    }
}

function decrementarCantidad(id) {
    let carrito = obtenerCarrito();
    const producto = carrito.find(p => p.id == id);
    if (producto && producto.cantidad > 1) {
        producto.cantidad = (Number(producto.cantidad) || 1) - 1;
        guardarCarrito(carrito);
        mostrarCotizacion();
        actualizarContador();
    }
}

// ==============================
// CAMBIAR CANTIDAD / ELIMINAR
// ==============================
function cambiarCantidad(id, cantidad) {
    let carrito = obtenerCarrito();
    const producto = carrito.find(p => p.id == id);
    if (producto) producto.cantidad = Math.max(1, parseInt(cantidad));
    localStorage.setItem("cotizacion", JSON.stringify(carrito));
    mostrarCotizacion();
    actualizarContador();
}

function eliminarProducto(id) {
    let carrito = obtenerCarrito().filter(p => p.id != id);
    localStorage.setItem("cotizacion", JSON.stringify(carrito));
    mostrarCotizacion();
    actualizarContador();
}

// ==============================
// RESUMEN VENTANA FLOTANTE
// ==============================
function renderDetalleFlotante() {
    const lista = obtenerCarrito();
    const contenedor = document.getElementById("detalleCarrito");
    if (!contenedor) return;
    contenedor.innerHTML = "";

    if (lista.length === 0) {
        contenedor.innerHTML = "<p>Sin productos</p>";
        return;
    }

    lista.forEach((p, index) => {
        const cantidad = Number(p.cantidad) || 1;
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("itemCarrito");
        itemDiv.innerHTML = `
            <span class="itemNombre">${index + 1}. ${p.nombre}</span>
            <span class="itemCantidad">x${cantidad}</span>
        `;
        contenedor.appendChild(itemDiv);
    });
}

// ==============================
// ACTUALIZAR CONTADOR / RESUMEN
// ==============================
function actualizarContador() {
    const lista = obtenerCarrito();

    let totalItems = lista.reduce(
        (acc, p) => acc + (Number(p.cantidad) || 1), 0
    );

    document.getElementById("contadorCotizacion").textContent = totalItems;
}

function actualizarResumenCotizacion() {
    const lista = obtenerCarrito();
    let totalItems = 0;
    lista.forEach(p => {
        totalItems += Number(p.cantidad) || 1;
    });
    document.getElementById("resumenProductos").textContent = lista.length;
    document.getElementById("resumenItems").textContent = totalItems;
    document.getElementById("totalProductos").textContent = lista.length;
    document.getElementById("totalItems").textContent = totalItems;
}

// ==============================
// VALIDACION CLIENTE Y BOTONES
// ==============================
function validarDatosCliente() {
    const nombre = document.getElementById("nombreCliente");
    const empresa = document.getElementById("empresaCliente");
    const correo = document.getElementById("correoCliente");
    const telefono = document.getElementById("telefonoCliente");

    let valido = true;

    if (nombre.value.trim().length < 3) { marcarError(nombre); valido = false; } else { marcarOk(nombre); }
    if (empresa.value.trim().length < 2) { marcarError(empresa); valido = false; } else { marcarOk(empresa); }
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexCorreo.test(correo.value.trim())) { marcarError(correo); valido = false; } else { marcarOk(correo); }
    const regexTel = /^[0-9+\-\s]+$/;
    if (telefono.value.trim().length < 7 || !regexTel.test(telefono.value.trim())) { marcarError(telefono); valido = false; } else { marcarOk(telefono); }

    document.getElementById("btnWhatsapp").disabled = !valido;
    document.getElementById("btnPDF").disabled = !valido;
    //document.getElementById("btnCorreo").disabled = !valido;

    return valido;
}

function marcarError(input){ input.classList.remove("input-ok"); input.classList.add("input-error"); }
function marcarOk(input){ input.classList.remove("input-error"); input.classList.add("input-ok"); }

// ==============================
// GUARDAR / CARGAR DATOS CLIENTE
// ==============================
function guardarAutomatico() {
    const datos = {
        nombre: document.getElementById("nombreCliente").value,
        empresa: document.getElementById("empresaCliente").value,
        correo: document.getElementById("correoCliente").value,
        telefono: document.getElementById("telefonoCliente").value
    };
    localStorage.setItem("datosCliente", JSON.stringify(datos));
}

function borrarDatosCliente() {
    localStorage.removeItem("datosCliente");
    document.getElementById("nombreCliente").value = "";
    document.getElementById("empresaCliente").value = "";
    document.getElementById("correoCliente").value = "";
    document.getElementById("telefonoCliente").value = "";
    validarDatosCliente();
    mostrarToast("Datos eliminados");
}

function cargarDatosCliente() {
    const datos = JSON.parse(localStorage.getItem("datosCliente"));
    if (datos) {
        document.getElementById("nombreCliente").value = datos.nombre || "";
        document.getElementById("empresaCliente").value = datos.empresa || "";
        document.getElementById("correoCliente").value = datos.correo || "";
        document.getElementById("telefonoCliente").value = datos.telefono || "";
    }
    validarDatosCliente();
}

// ==============================
// EVENTOS INPUTS
// ==============================
document.querySelectorAll("#nombreCliente, #empresaCliente, #correoCliente, #telefonoCliente")
.forEach(input => input.addEventListener("input", () => {
    validarDatosCliente();
    guardarAutomatico();
}));

document.addEventListener("DOMContentLoaded", () => {

    mostrarCotizacion();
    actualizarResumenCotizacion();
    cargarDatosCliente();

    let numeroGuardado = localStorage.getItem("numeroCotizacionActual");

    if (numeroGuardado) {
        numeroCotizacionGlobal = numeroGuardado;
        document.getElementById("numeroCotizacionVista").textContent = "N° " + numeroGuardado;
    }
});

// ==============================
// BOTONES ACCIÓN
// ==============================
/*
function generarNumeroCotizacion() {

    const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");

    let random = "";
    for (let i = 0; i < 2; i++) {
        random += letras.charAt(Math.floor(Math.random() * letras.length));
    }

    return `COT-LABSUPPLY-${dia}${mes}-${random}`;
}
*/

function enviarWhatsApp() {

    if (!obtenerNumeroCotizacion()) {
        mostrarToast("Genera una cotización primero");
        return;
    }

    if (!validarDatosCliente()) {
        mostrarToast("Completa correctamente los datos");
        return;
    }

    const carrito = obtenerCarrito();

    if (carrito.length === 0) {
        mostrarToast("No hay productos en la cotización");
        return;
    } 

    const numeroCotizacion = obtenerNumeroCotizacion();

    // =========================
    // DATOS CLIENTE
    // =========================
    const nombre = document.getElementById("nombreCliente").value;
    const empresa = document.getElementById("empresaCliente").value;
    const correo = document.getElementById("correoCliente").value;
    const telefonoCliente = document.getElementById("telefonoCliente").value;

    // =========================
    // FECHA Y HORA
    // =========================
    const ahora = new Date();
    const fecha = ahora.toLocaleDateString();
    const hora = ahora.toLocaleTimeString();

    // =========================
    // MENSAJE
    // =========================
    let mensaje = `SOLICITUD DE COTIZACIÓN\n\n`;

    mensaje += `Número: ${numeroCotizacion}\n`;
    mensaje += `Fecha: ${fecha}\n`;
    mensaje += `Hora: ${hora}\n\n`;

    mensaje += `DATOS DEL CLIENTE\n`;
    mensaje += `Nombre: ${nombre}\n`;
    mensaje += `Empresa: ${empresa}\n`;
    mensaje += `Correo: ${correo}\n`;
    mensaje += `Teléfono: ${telefonoCliente}\n\n`;

    mensaje += `PRODUCTOS\n`;

    let totalItems = 0;

    carrito.forEach((p, index) => {
        const cantidad = Number(p.cantidad) || 1;
        totalItems += cantidad;

        mensaje += `${index + 1}. ${p.nombre}\n`;
        mensaje += `Cantidad: ${cantidad}\n\n`;
    });

    mensaje += `RESUMEN\n`;
    mensaje += `Total productos: ${carrito.length}\n`;
    mensaje += `Total ítems: ${totalItems}\n`;

    // CLAVE
    const mensajeCodificado = encodeURIComponent(mensaje);

    const telefonoEmpresa = "593991793261";

    const url = `https://wa.me/${telefonoEmpresa}?text=${mensajeCodificado}`;

    console.log("URL WhatsApp:", url); 

    window.open(url, "_blank");
}

//==============
// GENERAR PDF 
//==============

function generarPDF(descargar = true) {

    if (!obtenerNumeroCotizacion()) {
        mostrarToast("Genera una cotización primero");
        return;
    }

    if (!validarDatosCliente()) {
        mostrarToast("Completa correctamente los datos");
        return;
    }

    const numeroCotizacion = obtenerNumeroCotizacion();
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const carrito = obtenerCarrito();

    if (carrito.length === 0) {
        mostrarToast("No hay productos");
        return;
    }

    // =========================
    // LOGO
    // =========================
    const img = new Image();
    img.src = "img/logo labsupply.png";
    doc.addImage(img, "PNG", 150, 10, 40, 20);

    // =========================
    // ENCABEZADO
    // =========================
    const ahora = new Date();
    const fecha = ahora.toLocaleDateString();
    const hora = ahora.toLocaleTimeString();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("LabSupply", 20, 20);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Cotización de Productos", 20, 28);

    doc.line(20, 32, 190, 32);

    // =========================
    // INFO DERECHA
    // =========================
    doc.setFontSize(10);
    doc.text(`N°: ${numeroCotizacion}`, 140, 40);
    doc.text(`Fecha: ${fecha}`, 140, 46);
    doc.text(`Hora: ${hora}`, 140, 52);

    // =========================
    // DATOS CLIENTE
    // =========================
    const nombre = document.getElementById("nombreCliente").value;
    const empresa = document.getElementById("empresaCliente").value;
    const correo = document.getElementById("correoCliente").value;
    const telefono = document.getElementById("telefonoCliente").value;

    doc.setFont("helvetica", "bold");
    doc.text("DATOS DEL CLIENTE", 20, 40);

    doc.setFont("helvetica", "normal");
    doc.text(`Nombre: ${nombre}`, 20, 46);
    doc.text(`Empresa: ${empresa}`, 20, 52);
    doc.text(`Correo: ${correo}`, 20, 58);
    doc.text(`Teléfono: ${telefono}`, 20, 64);

    doc.line(20, 68, 190, 68);

    // =========================
    // TABLA PRODUCTOS
    // =========================
    let y = 78;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("#", 20, y);
    doc.text("Código", 30, y);      
    doc.text("Producto", 60, y);    
    doc.text("Marca", 135, y);
    doc.text("Cant.", 175, y);

    y += 3;
    doc.setLineWidth(0.5);
    doc.line(20, y, 190, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9); 

    let totalItems = 0;

    carrito.forEach((p, index) => {
        const cantidad = Number(p.cantidad) || 1;
        totalItems += cantidad;

        const codigo = String(p.codigo || "N/A"); 
        const nombreProducto = String(p.nombre || "Sin nombre");
        const marcaProducto = String(p.marca || "N/A");

        // Ajuste de texto para el nombre del producto (ancho max 70)
    const lineasNombre = doc.splitTextToSize(nombreProducto, 70);
    const altoFila = (lineasNombre.length * 5) + 2;

    if (y + altoFila > 270) {
        doc.addPage();
        y = 20;
    }

        y += 7; 

    doc.text(String(index + 1), 20, y); // También convertimos el índice por seguridad
    doc.text(codigo, 30, y);           // Ahora 'codigo' es garantizadamente un string
    doc.text(lineasNombre, 60, y); 
    doc.text(marcaProducto, 135, y);
    doc.text(String(cantidad), 185, y, { align: "right" }); // Cantidad a string

        // Ajustar 'y' basado en la cantidad de líneas del nombre
        y += (lineasNombre.length - 1) * 5;

        // Línea divisoria sutil
        y += 2; 
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.1);
        doc.line(20, y, 190, y);
        doc.setDrawColor(0, 0, 0); 
    });

    // =========================
    // TOTALES
    // =========================
    if (y > 250) { doc.addPage(); y = 20; }
    
    y += 15;
    doc.line(120, y, 190, y);
    y += 8;
    doc.setFont("helvetica", "bold");
    doc.text("RESUMEN", 120, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.text(`Total productos: ${carrito.length}`, 120, y);
    y += 6;
    doc.text(`Total ítems: ${totalItems}`, 120, y);

    // =========================
    // FOOTER
    // =========================
    doc.setFontSize(9);
    doc.text("Gracias por su solicitud. Nos pondremos en contacto a la brevedad.", 20, 285);
    /*
    // =========================
    // SALIDA
    // =========================
    if (descargar) {
        doc.save(`cotizacion_${numeroCotizacion}.pdf`);
    } else {
        return doc.output("blob");
    }
        */

    // =========================
    // SALIDA (REEMPLAZO)
    // =========================
    if (descargar) {
        const pdfBlob = doc.output('blob');
        const url = URL.createObjectURL(pdfBlob);

        // Detectar si es un dispositivo móvil
        const esMovil = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        if (esMovil) {
            // En móviles, abrir en pestaña nueva para que el visor nativo lo muestre
            window.open(url, '_blank');
            mostrarToast("Abriendo cotización...");
        } else {
            // En PC, forzar la descarga con nombre de archivo
            const link = document.createElement('a');
            link.href = url;
            link.download = `cotizacion_${numeroCotizacion}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            mostrarToast("Descarga iniciada");
        }

        // Limpiar la URL después de un tiempo para liberar memoria
        setTimeout(() => URL.revokeObjectURL(url), 5000);
    } else {
        return doc.output("blob");
    }
}

// ==============================
// TOAST
// ==============================
function mostrarToast(mensaje) {
    const container = document.getElementById("toastContainer");
    if (!container) return;
    const toast = document.createElement("div");
    toast.classList.add("toast");
    toast.textContent = mensaje;
    container.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 3000);
}

// ==============================
// PASO PRODUCTOS
// ==============================
function actualizarPasoProductos() {
    const carrito = obtenerCarrito();
    const paso1 = document.getElementById("paso1");
    const paso2 = document.getElementById("paso2");
    if (!paso1 || !paso2) return;
    if (carrito.length > 0) { paso1.classList.add("completo"); paso2.classList.add("activo"); }
}

//VACIAR COTIZACION

function vaciarCotizacion() {

    if (!confirm("¿Deseas iniciar una nueva cotización?")) return;

    // Borrar productos
    localStorage.removeItem("cotizacion");

    mostrarCotizacion();
    actualizarContador();

    // 🔥 GENERAR NUEVO NÚMERO
    generarNuevaCotizacion();

    mostrarToast("Nueva cotización iniciada");
}

function copiarCotizacion() {

    const numero = generarNumeroCotizacion();

    navigator.clipboard.writeText(numero)
    .then(() => mostrarToast("Número copiado"))
    .catch(() => mostrarToast("Error al copiar"));
}

// Agregar al final de cotizacion.js
document.getElementById("menuToggle").addEventListener("click", () => {
    document.getElementById("menu").classList.toggle("active");
});