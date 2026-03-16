let carrito = JSON.parse(localStorage.getItem("cotizacion")) || [];

function agregarCarrito(id){

fetch("data/productos.json")

.then(res => res.json())

.then(productos => {

let producto = productos.find(p => p.id == id);

if(!producto) return;

let existe = carrito.find(p => p.id == id);

if(existe){

existe.cantidad++;

}else{

producto.cantidad = 1;

carrito.push(producto);

}

localStorage.setItem(
"cotizacion",
JSON.stringify(carrito)
);

actualizarContador();

});

}


// ACTUALIZAR CONTADOR

function actualizarContador(){

let datos = JSON.parse(localStorage.getItem("cotizacion")) || [];

let total = datos.reduce(
(acc,p)=> acc + p.cantidad ,0
);

let contador =
document.getElementById("contadorCotizacion");

if(contador){

contador.textContent = total;

}

}


// CARGAR CONTADOR AL INICIAR

document.addEventListener(
"DOMContentLoaded",
actualizarContador
);