let productos = JSON.parse(localStorage.getItem("adminProductos")) || [];

function guardarDatos(){

localStorage.setItem(
"adminProductos",
JSON.stringify(productos)
);

}


function mostrarProductos(lista = productos){

const contenedor = document.getElementById("listaAdmin");

contenedor.innerHTML="";

lista.forEach((p,index)=>{

contenedor.innerHTML += `

<tr>

<td>${p.nombre}</td>
<td>${p.marca}</td>
<td>${p.categoria}</td>

<td>

<button onclick="editar(${index})">
Editar
</button>

<button onclick="eliminar(${index})">
Eliminar
</button>

</td>

</tr>

`;

});

}


document
.getElementById("formProducto")
.addEventListener("submit",function(e){

e.preventDefault();

const index = document.getElementById("productoIndex").value;

const archivo =
document.getElementById("imagen").files[0];

if(archivo){

const reader = new FileReader();

reader.onload = function(){

guardarProducto(reader.result,index);

}

reader.readAsDataURL(archivo);

}else{

guardarProducto("",index);

}

});


function guardarProducto(imagenBase64,index){

let producto={

id:Date.now(),

nombre:document.getElementById("nombre").value,
categoria:document.getElementById("categoria").value,
marca:document.getElementById("marca").value,
keywords:document.getElementById("keywords").value,
descripcion:document.getElementById("descripcion").value,
pdf:document.getElementById("pdf").value,
imagen:imagenBase64

};

if(index===""){

productos.push(producto);

}else{

productos[index]=producto;

}

guardarDatos();

mostrarProductos();

document.getElementById("formProducto").reset();

document.getElementById("productoIndex").value="";

}


function editar(index){

const p = productos[index];

document.getElementById("productoIndex").value=index;

document.getElementById("nombre").value=p.nombre;

document.getElementById("categoria").value=p.categoria;

document.getElementById("marca").value=p.marca;

document.getElementById("keywords").value=p.keywords;

document.getElementById("descripcion").value=p.descripcion;

document.getElementById("pdf").value=p.pdf;

}


function eliminar(index){

productos.splice(index,1);

guardarDatos();

mostrarProductos();

}


document
.getElementById("buscarAdmin")
.addEventListener("keyup",function(){

let texto=this.value.toLowerCase();

let filtrados = productos.filter(p=>

p.nombre.toLowerCase().includes(texto)

);

mostrarProductos(filtrados);

});


function exportarJSON(){

const data =
JSON.stringify(productos,null,2);

const blob =
new Blob([data],{type:"application/json"});

const url =
URL.createObjectURL(blob);

const a=document.createElement("a");

a.href=url;

a.download="productos.json";

a.click();

}


mostrarProductos();