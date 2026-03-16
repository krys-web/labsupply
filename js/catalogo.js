let productos = [];
let productosFiltrados = [];
let paginaActual = 1;
let productosPorPagina = 12;


// CARGAR PRODUCTOS

async function cargarProductos(){

try{

const respuesta = await fetch("data/productos.json");

productos = await respuesta.json();

productosFiltrados = productos;

mostrarProductos();

}

catch(error){

console.error("Error cargando productos:", error);

}

}


// MOSTRAR PRODUCTOS

function mostrarProductos(){

let contenedor = document.getElementById("productos");

contenedor.innerHTML = "";

let inicio = (paginaActual-1) * productosPorPagina;
let fin = inicio + productosPorPagina;

let productosPagina = productosFiltrados.slice(inicio,fin);

productosPagina.forEach(p => {

contenedor.innerHTML += `
<div class="producto" onclick="abrirProducto(${p.id})">

<img src="${p.imagen}" alt="${p.nombre}" loading="lazy">

<h3>${p.nombre}</h3>

<p>${p.marca}</p>

<button onclick="descargarFicha('${p.ficha}'); event.stopPropagation();">
Ficha técnica
</button>

<button onclick="agregarCarrito(${p.id}); event.stopPropagation();">
Cotizar
</button>

</div>
`;

});

generarPaginacion();

}


// BUSCADOR

function buscarProductos(){

let texto =
document.getElementById("buscador").value.toLowerCase();

let resultado = productos.filter(p =>

p.nombre.toLowerCase().includes(texto) ||
p.marca.toLowerCase().includes(texto) ||
p.categoria.toLowerCase().includes(texto)

);

paginaActual = 1;

productosFiltrados = resultado;

mostrarProductos();

}


// FILTRO

function filtrarCategoria(){

let categoria =
document.getElementById("filtroCategoria").value;

if(categoria === ""){

productosFiltrados = productos;

}else{

productosFiltrados =
productos.filter(p => p.categoria === categoria);

}

paginaActual = 1;

mostrarProductos();

}


// PAGINACIÓN

function paginaAnterior(){

if(paginaActual > 1){

paginaActual--;

mostrarProductos();

}

}


function paginaSiguiente(){

let totalPaginas =
Math.ceil(productosFiltrados.length / productosPorPagina);

if(paginaActual < totalPaginas){

paginaActual++;

mostrarProductos();

}

}


// GENERAR PAGINACION

function generarPaginacion(){

let totalPaginas =
Math.ceil(productosFiltrados.length / productosPorPagina);

let contenedor = document.getElementById("paginacion");

if(!contenedor) return;

contenedor.innerHTML = "";

for(let i=1;i<=totalPaginas;i++){

contenedor.innerHTML += `
<button onclick="cambiarPagina(${i})">
${i}
</button>
`;

}

}


function cambiarPagina(p){

paginaActual = p;

mostrarProductos();

}


// MODAL PRODUCTO

function abrirProducto(id){

let producto = productos.find(p => p.id === id);

document.getElementById("modalImagen").src = producto.imagen;
document.getElementById("modalNombre").innerText = producto.nombre;
document.getElementById("modalMarca").innerText = producto.marca;
document.getElementById("modalDescripcion").innerText = producto.descripcion;
document.getElementById("modalCategoria").innerText = producto.categoria;

document.getElementById("modalFicha").href = producto.ficha;

document.getElementById("modalCotizar").onclick = function(){

agregarCarrito(producto.id);

};

document.getElementById("modalProducto").style.display="flex";

mostrarTab("detalle");

}


function cerrarProducto(){

document.getElementById("modalProducto").style.display = "none";

}


function mostrarTab(tab){

document.querySelectorAll(".tab").forEach(t=>{
t.style.display="none";
});

document.getElementById(tab).style.display="block";

}


// EVENTOS

document
.getElementById("buscador")
.addEventListener("keyup", buscarProductos);

document
.getElementById("filtroCategoria")
.addEventListener("change", filtrarCategoria);


// INICIAR

cargarProductos();

// Decargar ficha técnica
function descargarFicha(pdf){

window.open(pdf,"_blank");

}