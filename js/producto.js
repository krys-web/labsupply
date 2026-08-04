// ==========================================
// VARIABLES GLOBALES
// ==========================================

let productosGlobal = [];



// ==========================================
// CARGAR PRODUCTOS DESDE JSON
// ==========================================

async function cargarProductos(){

try{

const respuesta = await fetch("data/productos.json");

productosGlobal = await respuesta.json();

}
catch(error){

console.error("Error cargando productos:", error);

}

}

// Aseguramos que la variable sea global
if (!window.productosGlobal) window.productosGlobal = [];

// ==========================================
// ABRIR MODAL PRODUCTO
// ==========================================

function abrirProducto(id) {
    // Buscamos en la variable global compartida (usamos == por si el ID viene como string)
    const producto = window.productosGlobal.find(p => p.id == id);
    
    if (!producto) {
        console.error("Producto no encontrado con ID:", id);
        return;
    }

    // Llenar Datos básicos
    document.getElementById("modalNombre").textContent = producto.nombre;
    document.getElementById("modalImagen").src = producto.imagen;
    
    // Usamos innerHTML y replace para que los \n del JSON se conviertan en saltos de línea visibles
    document.getElementById("modalDescripcion").innerHTML = producto.descripcion.replace(/\n/g, '<br>');

    // Llenar Especificaciones (incluyendo el nuevo campo Código)
    // Asegúrate de que en tu index.html existan estos IDs
    const campos = {
        "specCodigo": producto.codigo || "No disponible",
        "specNombre": producto.nombre,
        "specMarca": producto.marca,
        "specCategoria": producto.categoria,
        "modalCategoria": producto.categoria
    };

    // Iteramos por los campos para asignar valores de forma segura
    for (const [idElemento, valor] of Object.entries(campos)) {
        const el = document.getElementById(idElemento);
        if (el) el.textContent = valor;
    }

    // Configurar Botones de acción
    const btnFicha = document.getElementById("btnFichaModal");
    const btnCotizar = document.getElementById("btnCotizarModal");

    if (btnFicha) btnFicha.onclick = () => descargarFicha(producto.pdf);
    if (btnCotizar) btnCotizar.onclick = () => agregarCarrito(producto.id);

    // Cargar productos relacionados
    if (typeof cargarRelacionados === "function") {
        cargarRelacionados(producto);
    }

    // Mostrar el modal
    const modal = document.getElementById("modalProducto");
    if (modal) {
        modal.style.display = "flex";
        // Resetear a la pestaña de 'detalle' (primera pestaña)
        mostrarTab('detalle');
    }
}

function cargarRelacionados(producto) {
    const contenedor = document.getElementById("modalRelacionados");
    if (!contenedor) return;
    contenedor.innerHTML = "";

    const relacionados = window.productosGlobal.filter(p => 
        p.categoria === producto.categoria && p.id !== producto.id
    ).slice(0, 4);

    relacionados.forEach(p => {
        contenedor.innerHTML += `
            <div class="productoRelacionado" onclick="abrirProducto(${p.id})">
                <img src="${p.imagen}" alt="${p.nombre}">
                <p>${p.nombre}</p>
            </div>
        `;
    });
}


// ==========================================
// CERRAR MODAL
// ==========================================

function cerrarProducto(){

document.getElementById("modalProducto").style.display = "none";

}



// ==========================================
// CAMBIAR TABS
// ==========================================

function mostrarTab(tabId) {
    // 1. Ocultar todos los contenidos de las pestañas
    const contenidos = document.querySelectorAll('.tab-pestaña');
    contenidos.forEach(div => div.style.display = 'none');

    // 2. Quitar la clase 'tab-activo' de todos los botones (li)
    const botones = document.querySelectorAll('.tabs li');
    botones.forEach(li => li.classList.remove('tab-activo'));

    // 3. Mostrar el contenido de la pestaña seleccionada
    const elemento = document.getElementById(tabId);
    if (elemento) {
        elemento.style.display = 'block';
    }

    // 4. Resaltar el botón que recibió el clic
    // Buscamos el botón que tenga el onclick con ese tabId
    botones.forEach(li => {
        if (li.getAttribute('onclick')?.includes(tabId)) {
            li.classList.add('tab-activo');
        }
    });
}


function activarTab(tab){

document.querySelectorAll(".tabContenido").forEach(t => {

t.classList.remove("active");

});

document.getElementById(tab).classList.add("active");

}



// ==========================================
// PRODUCTOS RELACIONADOS
// ==========================================

function mostrarRelacionados(producto){

const contenedor = document.getElementById("modalRelacionados");

if(!contenedor) return;

contenedor.innerHTML = "";

let relacionados = productosGlobal.filter(p =>

p.categoria === producto.categoria &&
p.id !== producto.id

);

relacionados = relacionados.slice(0,4);


relacionados.forEach(p => {

contenedor.innerHTML += `
<div class="productoRelacionado" onclick="abrirProducto(${p.id})">

<img src="${p.imagen}" loading="lazy">

<p>${p.nombre}</p>

</div>
`;

});

}



// ==========================================
// CONTADOR COTIZACION
// ==========================================

function actualizarContador(){

let carrito =
JSON.parse(localStorage.getItem("cotizacion")) || [];

let total = carrito.reduce((acc,p) => acc + p.cantidad ,0);

const contador = document.getElementById("contadorCotizacion");

if(contador){

contador.textContent = total;

}

}



// ==========================================
// CERRAR MODAL SI HACEN CLICK FUERA
// ==========================================

window.onclick = function(event){

const modal = document.getElementById("modalProducto");

if(event.target === modal){

cerrarProducto();

}

};



// ==========================================
// INICIALIZAR
// ==========================================

document.addEventListener("DOMContentLoaded",async function(){

await cargarProductos();

actualizarContador();

});


function cargarRelacionados(producto) {
    const contenedor = document.getElementById("modalRelacionados");
    if (!contenedor) return;
    contenedor.innerHTML = "";

    const productos = window.productosGlobal || productosGlobal;
    
    const relacionados = productos.filter(p => 
        p.categoria === producto.categoria && p.id !== producto.id
    ).slice(0, 4);

    relacionados.forEach(p => {
        contenedor.innerHTML += `
            <div class="productoRelacionado" onclick="abrirProducto(${p.id})">
                <img src="${p.imagen}" alt="${p.nombre}">
                <p>${p.nombre}</p>
            </div>
        `;
    });
}