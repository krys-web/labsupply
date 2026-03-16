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



// ==========================================
// ABRIR MODAL PRODUCTO
// ==========================================

function abrirProducto(id){

const producto = productosGlobal.find(p => p.id == id);

if(!producto) return;

document.getElementById("modalProducto").style.display = "flex";


// DATOS PRINCIPALES

document.getElementById("modalNombre").textContent = producto.nombre;

document.getElementById("modalMarca").textContent = producto.marca;

document.getElementById("modalImagen").src = producto.imagen;

document.getElementById("modalImagen").alt = producto.nombre;


// DETALLE

document.getElementById("modalDescripcion").textContent =
producto.descripcion;


// ESPECIFICACIONES

document.getElementById("specNombre").textContent =
producto.nombre;

document.getElementById("specMarca").textContent =
producto.marca;

document.getElementById("specCategoria").textContent =
producto.categoria;


// CATEGORIA

document.getElementById("modalCategoria").textContent =
producto.categoria;


// PDF

const ficha = document.getElementById("modalFicha");

if(producto.pdf){

ficha.href = producto.pdf;

ficha.style.display = "inline-block";

}else{

ficha.style.display = "none";

}


// BOTON COTIZAR

const btnCotizar = document.getElementById("modalCotizar");

btnCotizar.onclick = function(){

agregarCarrito(producto.id);

};



// MOSTRAR TAB INICIAL

activarTab("detalle");


// PRODUCTOS RELACIONADOS

mostrarRelacionados(producto);


// SEO DINAMICO

document.title = producto.nombre + " | LAB SUPPLY";

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

function mostrarTab(tab,event){

activarTab(tab);

document.querySelectorAll(".tabBtn").forEach(b => {

b.classList.remove("active");

});

event.target.classList.add("active");

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