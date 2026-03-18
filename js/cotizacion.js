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
}

// Tabla principal
function renderTablaPrincipal(lista) {
    const contenedor = document.getElementById("listaCotizacion");
    if (!contenedor) return;
    contenedor.innerHTML = "";

    if (lista.length === 0) {
        contenedor.innerHTML = `<tr><td colspan="6">No hay productos en la cotización</td></tr>`;
        return;
    }

    lista.forEach((p, index) => {
    contenedor.innerHTML += `
    <tr>
        <td>${index + 1}</td>
        <td><img src="${p.imagen}" width="60"></td>
        <td>${p.nombre}</td>
        <td>${p.marca}</td>
        <td>${p.categoria}</td>
        <td>
            <input type="number" min="1" value="${p.cantidad}" 
            class="inputCantidad" 
            onchange="cambiarCantidad(${p.id},this.value)">
        </td>
        <td>
            <button onclick="eliminarProducto(${p.id})" 
            class="btn btn-danger btn-icon">
                <i class="fa-solid fa-trash"></i>
            </button>
        </td>
    </tr>`;
});
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
    document.getElementById("btnCorreo").disabled = !valido;

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
});

// ==============================
// BOTONES ACCIÓN
// ==============================
function enviarWhatsApp() {
    if (!validarDatosCliente()) { mostrarToast("Completa correctamente los datos"); return; }
    const carrito = obtenerCarrito();
    if (carrito.length === 0) { mostrarToast("No hay productos en la cotización"); return; }
    let mensaje = "Hola, deseo cotizar:%0A%0A";
    carrito.forEach(p => { mensaje += `- ${p.nombre} | Cantidad: ${p.cantidad}%0A`; });
    const telefono = "593982996860";
    window.open(`https://wa.me/${telefono}?text=${mensaje}`, "_blank");
}

function generarPDF() {

    if (!validarDatosCliente()) {
        mostrarToast("Completa correctamente los datos");
        return;
    }

    if (!window.jspdf) {
        alert("Error cargando PDF");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const carrito = obtenerCarrito();
    if (carrito.length === 0) {
        mostrarToast("No hay productos");
        return;
    }
    // LOGO
    const img = new Image();
    img.src = "img/logo labsupply.png";
    doc.addImage(img, "PNG", 150, 10, 40, 20);

    //FECHA ACTUAL
    const fecha = new Date().toLocaleDateString();
    doc.text(`Fecha: ${fecha}`, 150, 40);

    // =========================
    // DATOS CLIENTE
    // =========================
    const nombre = document.getElementById("nombreCliente").value;
    const empresa = document.getElementById("empresaCliente").value;
    const correo = document.getElementById("correoCliente").value;
    const telefono = document.getElementById("telefonoCliente").value;

    // =========================
    // ENCABEZADO
    // =========================
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("LAB SUPPLY", 20, 20);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Cotización de Productos", 20, 28);

    // Línea separadora
    doc.line(20, 32, 190, 32);

    // =========================
    // DATOS CLIENTE
    // =========================
    doc.setFontSize(10);
    doc.text(`Nombre: ${nombre}`, 20, 40);
    doc.text(`Empresa: ${empresa}`, 20, 46);
    doc.text(`Correo: ${correo}`, 20, 52);
    doc.text(`Teléfono: ${telefono}`, 20, 58);

    // =========================
    // TABLA PRODUCTOS
    // =========================
    let y = 70;

    doc.setFont("helvetica", "bold");
    doc.text("#", 20, y);
    doc.text("Producto", 30, y);
    doc.text("Cantidad", 150, y);

    y += 5;
    doc.line(20, y, 190, y);

    doc.setFont("helvetica", "normal");

    let totalItems = 0;

    carrito.forEach((p, index) => {
        y += 8;

        // Salto de página automático
        if (y > 270) {
            doc.addPage();
            y = 20;
        }

        const cantidad = Number(p.cantidad) || 1;
        totalItems += cantidad;

        // Corte de texto largo
        let nombreProducto = p.nombre;
        if (nombreProducto.length > 60) {
            nombreProducto = nombreProducto.substring(0, 57) + "...";
        }

        doc.text(`${index + 1}`, 20, y);
        doc.text(nombreProducto, 30, y);
        doc.text(`x${cantidad}`, 150, y);
    });

    // =========================
    // TOTALES
    // =========================
    y += 15;

    doc.setFont("helvetica", "bold");
    doc.text("Resumen:", 20, y);

    y += 8;

    doc.setFont("helvetica", "normal");
    doc.text(`Total productos: ${carrito.length}`, 20, y);
    y += 6;
    doc.text(`Total ítems: ${totalItems}`, 20, y);

    // =========================
    // FOOTER
    // =========================
    doc.setFontSize(9);
    doc.text(
        "Gracias por su solicitud. Nos pondremos en contacto a la brevedad.",
        20,
        285
    );

    // =========================
    // DESCARGA
    // =========================
    doc.save("cotizacion_lab_supply.pdf");
}

function enviarCorreo() {
    if (!validarDatosCliente()) { mostrarToast("Completa correctamente los datos"); return; }
    const nombre = document.getElementById("nombreCliente").value;
    const correo = document.getElementById("correoCliente").value;
    const carrito = obtenerCarrito();
    let productos = "";
    carrito.forEach(p => { productos += `${p.nombre} | Cantidad: ${p.cantidad}\n`; });

    emailjs.send("SERVICE_ID", "TEMPLATE_ID", { nombre, correo, productos }, "PUBLIC_KEY")
    .then(() => mostrarToast("Correo enviado correctamente"))
    .catch(() => mostrarToast("Error al enviar correo"));
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

    if (!confirm("¿Seguro que deseas eliminar toda la cotización?")) return;

    localStorage.removeItem("cotizacion");

    mostrarCotizacion();
    actualizarContador();

    mostrarToast("Cotización eliminada");
}