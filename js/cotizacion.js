// ======================================
// OBTENER CARRITO
// ======================================

function obtenerCarrito(){
return JSON.parse(localStorage.getItem("cotizacion")) || [];
}

// ======================================
// GUARDAR CARRITO
// ======================================

function guardarCarrito(carrito){

localStorage.setItem("cotizacion", JSON.stringify(carrito));

actualizarContador?.();

}

// ======================================
// MOSTRAR COTIZACION
// ======================================

function mostrarCotizacion(){

const carrito = obtenerCarrito();

const contenedor =
document.getElementById("listaCotizacion");

if(!contenedor) return;

renderCotizacion(carrito);

actualizarPasoProductos();

}

// ======================================
// RENDER TABLA
// ======================================

function renderCotizacion(lista){

const contenedor = document.getElementById("listaCotizacion");

if(!contenedor) return;

contenedor.innerHTML = "";

if(lista.length === 0){

contenedor.innerHTML = `
<tr>
<td colspan="6">No hay productos en la cotización</td>
</tr>
`;

return;

}

lista.forEach(p => {

contenedor.innerHTML += `

<tr>

<td>
<img src="${p.imagen}" width="60">
</td>

<td>${p.nombre}</td>

<td>${p.marca}</td>

<td>${p.categoria}</td>

<td>

<input 
type="number"
min="1"
value="${p.cantidad}"
class="inputCantidad"
onchange="cambiarCantidad(${p.id},this.value)"
>

</td>

<td>

<button 
onclick="eliminarProducto(${p.id})"
class="btnEliminar">

Eliminar

</button>

</td>

</tr>

`;

});

}

// ======================================
// CAMBIAR CANTIDAD
// ======================================

function cambiarCantidad(id,cantidad){

let carrito = obtenerCarrito();

let producto = carrito.find(p => p.id == id);

if(producto){

producto.cantidad = Math.max(1, parseInt(cantidad));

}

guardarCarrito(carrito);

mostrarCotizacion();

}

// ======================================
// ELIMINAR PRODUCTO
// ======================================

function eliminarProducto(id){

let carrito = obtenerCarrito();

carrito = carrito.filter(p => p.id != id);

guardarCarrito(carrito);

mostrarCotizacion();

}

// ======================================
// VACIAR CARRITO
// ======================================

function vaciarCarrito(){

localStorage.removeItem("cotizacion");

mostrarCotizacion();

actualizarContador?.();

}

// ======================================
// BUSCAR EN COTIZACION
// ======================================

function buscarCotizacion(){

const input = document.getElementById("buscarCotizacion");

if(!input) return;

const texto = input.value.toLowerCase();

const carrito = obtenerCarrito();

const filtrados = carrito.filter(p =>
p.nombre.toLowerCase().includes(texto)
);

renderCotizacion(filtrados);

}

// ======================================
// ENVIAR WHATSAPP
// ======================================

function enviarWhatsApp(){

const carrito = obtenerCarrito();

if(carrito.length === 0){

alert("No hay productos en la cotización");

return;

}

let mensaje =
"Hola, deseo cotizar los siguientes productos:%0A%0A";

carrito.forEach(p => {

mensaje +=
"- " + p.nombre +
" | Cantidad: " + p.cantidad +
"%0A";

});

const telefono = "593XXXXXXXXX";

const url =
"https://wa.me/" +
telefono +
"?text=" +
mensaje;

window.open(url,"_blank");

}

// ==============================
// GENERAR PDF
// ==============================

// ==============================
// GENERAR PDF PROFESIONAL
// ==============================

function generarPDF(){

if(!window.jspdf){
alert("Error cargando la librería PDF");
return;
}

const { jsPDF } = window.jspdf;

const doc = new jsPDF();

const carrito = obtenerCarrito();

if(carrito.length === 0){
alert("No hay productos para cotizar");
return;
}


// DATOS CLIENTE

const nombre =
document.getElementById("nombreCliente")?.value || "";

const empresa =
document.getElementById("empresaCliente")?.value || "";

const correo =
document.getElementById("correoCliente")?.value || "";

const telefono =
document.getElementById("telefonoCliente")?.value || "";


// FECHA

const fecha = new Date();

const fechaTexto =
fecha.toLocaleDateString() +
" " +
fecha.toLocaleTimeString();


// TITULO

doc.setFontSize(18);
doc.text("COTIZACIÓN",105,20,null,null,"center");

doc.setFontSize(10);

doc.text("Fecha: " + fechaTexto,150,30);


// CLIENTE

doc.text("Nombre: " + nombre,20,40);
doc.text("Empresa: " + empresa,20,48);
doc.text("Correo: " + correo,20,56);
doc.text("Teléfono: " + telefono,20,64);


// PRODUCTOS

let y = 80;

doc.setFontSize(12);
doc.text("Productos solicitados:",20,y);

y += 10;

carrito.forEach(p => {

doc.text(
p.nombre +
" | Marca: " +
p.marca +
" | Cantidad: " +
p.cantidad,
20,
y
);

y += 8;

});


// GUARDAR

doc.save("cotizacion_lab_supply.pdf");

}

// ======================================
// ENVIAR CORREO
// ======================================

function enviarCorreo(){

const nombre =
document.getElementById("nombreCliente").value;

const correo =
document.getElementById("correoCliente").value;

const carrito = obtenerCarrito();

let productos = "";

carrito.forEach(p => {

productos +=
p.nombre +
" | Cantidad: " +
p.cantidad +
"\n";

});

emailjs.send(

"SERVICE_ID",
"TEMPLATE_ID",

{
nombre:nombre,
correo:correo,
productos:productos
},

"PUBLIC_KEY"

)

.then(() => {

alert("Cotización enviada correctamente");

});

}

// ======================================
// EVENTOS
// ======================================

document.addEventListener(
"DOMContentLoaded",
mostrarCotizacion
);

const buscador =
document.getElementById("buscarCotizacion");

if(buscador){

buscador.addEventListener(
"keyup",
buscarCotizacion
);

}

// ==============================
// VALIDAR FORMULARIO
// ==============================

function validarFormulario(){

const nombre =
document.getElementById("nombreCliente")?.value.trim();

const correo =
document.getElementById("correoCliente")?.value.trim();

const telefono =
document.getElementById("telefonoCliente")?.value.trim();

const btn =
document.getElementById("btnPDF");

if(!btn) return;

if(nombre && correo && telefono){

btn.disabled = false;

}else{

btn.disabled = true;

}

}

//Mensaje de advertencia sino se carga el PDF.

document.addEventListener("DOMContentLoaded", () => {

if(!window.jspdf){

console.warn("jsPDF no se cargó");

}

});

// ==============================
// GUARDAR DATOS CLIENTE
// ==============================

function guardarDatosCliente(){

const nombre =
document.getElementById("nombreCliente").value.trim();

const empresa =
document.getElementById("empresaCliente").value.trim();

const correo =
document.getElementById("correoCliente").value.trim();

const telefono =
document.getElementById("telefonoCliente").value.trim();

if(!nombre || !correo || !telefono){

alert("Por favor complete los datos obligatorios");

return;

}

// guardar datos en localStorage

const datosCliente = {
nombre,
empresa,
correo,
telefono
};

localStorage.setItem(
"datosCliente",
JSON.stringify(datosCliente)
);

// habilitar botones

document.getElementById("btnWhatsapp").disabled = false;
document.getElementById("btnPDF").disabled = false;

alert("Datos guardados correctamente");

}

// ==============================
// CARGAR DATOS CLIENTE
// ==============================

function cargarDatosCliente(){

const datos =
JSON.parse(localStorage.getItem("datosCliente"));

if(!datos) return;

document.getElementById("nombreCliente").value =
datos.nombre || "";

document.getElementById("empresaCliente").value =
datos.empresa || "";

document.getElementById("correoCliente").value =
datos.correo || "";

document.getElementById("telefonoCliente").value =
datos.telefono || "";

// habilitar botones

document.getElementById("btnWhatsapp").disabled = false;
document.getElementById("btnPDF").disabled = false;

// actualizar pasos
document.getElementById("paso2").classList.add("completo");
document.getElementById("paso3").classList.add("activo");

}

document.addEventListener(
"DOMContentLoaded",
cargarDatosCliente
);

//Activar paso 1

function actualizarPasoProductos(){

const carrito = obtenerCarrito();

if(carrito.length > 0){

document.getElementById("paso1").classList.add("completo");
document.getElementById("paso2").classList.add("activo");

}

}

// ==============================
// BORRAR DATOS CLIENTE
// ==============================

function borrarDatosCliente(){

// limpiar formulario

document.getElementById("nombreCliente").value = "";
document.getElementById("empresaCliente").value = "";
document.getElementById("correoCliente").value = "";
document.getElementById("telefonoCliente").value = "";

// eliminar datos guardados

localStorage.removeItem("datosCliente");

// deshabilitar botones

document.getElementById("btnWhatsapp").disabled = true;
document.getElementById("btnPDF").disabled = true;

// reiniciar pasos

document.getElementById("paso2")?.classList.remove("completo");
document.getElementById("paso3")?.classList.remove("activo");

alert("Datos del cliente eliminados");

}

