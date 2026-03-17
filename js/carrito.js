// ======================================
// INICIALIZAR CARRITO
// ======================================

let carrito = JSON.parse(localStorage.getItem("cotizacion")) || [];


// ======================================
// AGREGAR AL CARRITO
// ======================================

function agregarCarrito(id){

fetch("data/productos.json")

.then(res => res.json())

.then(productos => {

let carrito = obtenerCarrito(); // 🔥 SIEMPRE FRESCO

let producto = productos.find(p => p.id == id);

if(!producto) return;

let existe = carrito.find(p => p.id == id);

if(existe){

existe.cantidad++;

mostrarToast(`Se aumentó cantidad de ${producto.nombre} 🔄`);

}else{

producto.cantidad = 1;

carrito.push(producto);

mostrarToast(`${producto.nombre} agregado ✅`);

}

localStorage.setItem("cotizacion", JSON.stringify(carrito));

// 🔥 FORZAR ACTUALIZACIÓN INMEDIATA
actualizarContador();

});

}


// ======================================
// ACTUALIZAR CONTADOR (ITEMS)
// ======================================

function actualizarContador(){

    let datos = obtenerCarrito(); 

    let totalItems = datos.reduce(
        (acc,p)=> acc + (Number(p.cantidad) || 1), 0
    );

    let contador = document.getElementById("contadorCotizacion");

    if(contador){
        contador.textContent = totalItems;
    }

}


// ======================================
// TOAST (ALERTA FLOTANTE)
// ======================================

function mostrarToast(mensaje) {

const container = document.getElementById("toastContainer");

if (!container) return;

const toast = document.createElement("div");

toast.classList.add("toast");

toast.textContent = mensaje;

container.appendChild(toast);

setTimeout(() => {
toast.remove();
}, 3000);

}


// ======================================
// INICIALIZAR AL CARGAR
// ======================================

document.addEventListener("DOMContentLoaded", () => {

actualizarContador();

});

//=======================================
// ACTUALIZACIÓN CONTADOR
//=======================================

function obtenerCarrito(){
    return JSON.parse(localStorage.getItem("cotizacion")) || [];
}

/* SINCRONIZACION ENTRE PAGINAS */

window.addEventListener("storage", () => {
    actualizarContador();
});