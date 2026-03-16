let documentos = [

{
nombre:"Ficha técnica Matraz Erlenmeyer",
categoria:"Ficha tecnica",
archivo:"pdf/erlenmeyer.pdf"
},

{
nombre:"Manual Micropipeta automática",
categoria:"Manual",
archivo:"pdf/micropipeta.pdf"
},

{
nombre:"Certificado Reactivo químico",
categoria:"Certificado",
archivo:"pdf/reactivo.pdf"
},

{
nombre:"Catálogo productos laboratorio",
categoria:"Catalogo",
archivo:"pdf/catalogo.pdf"
}

];


function mostrarDocumentos(lista){

const contenedor = document.getElementById("documentos");

contenedor.innerHTML="";

lista.forEach(doc=>{

contenedor.innerHTML += `

<div class="documento">

<h3>${doc.nombre}</h3>

<p>${doc.categoria}</p>

<a href="${doc.archivo}" target="_blank" class="btnDescargar">
Descargar PDF
</a>

</div>

`;

});

}


function buscarDocumento(){

let texto =
document
.getElementById("buscarDocumento")
.value
.toLowerCase();

let categoria =
document
.getElementById("categoriaDocumento")
.value;

let filtrados = documentos.filter(d=>{

let coincideTexto =
d.nombre.toLowerCase().includes(texto);

let coincideCategoria =
categoria === "" || d.categoria === categoria;

return coincideTexto && coincideCategoria;

});

mostrarDocumentos(filtrados);

}


document
.getElementById("buscarDocumento")
.addEventListener("keyup",buscarDocumento);

document
.getElementById("categoriaDocumento")
.addEventListener("change",buscarDocumento);


mostrarDocumentos(documentos);