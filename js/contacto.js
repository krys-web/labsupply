// Inicializar EmailJS

(function(){

emailjs.init("TU_PUBLIC_KEY");

})();


// Enviar formulario

document
.getElementById("btnEnviarContacto")
.addEventListener("click", enviarMensaje);


function enviarMensaje(){

const nombre =
document.getElementById("nombreContacto").value;

const correo =
document.getElementById("correoContacto").value;

const telefono =
document.getElementById("telefonoContacto").value;

const mensaje =
document.getElementById("mensajeContacto").value;


if(nombre === "" || correo === "" || mensaje === ""){

alert("Por favor complete los campos obligatorios");

return;

}


emailjs.send(

"SERVICE_ID",
"TEMPLATE_ID",

{

nombre:nombre,
correo:correo,
telefono:telefono,
mensaje:mensaje

}

)

.then(function(){

alert("Mensaje enviado correctamente");

limpiarFormulario();

})

.catch(function(){

alert("Error al enviar el mensaje");

});

}



function limpiarFormulario(){

document.getElementById("nombreContacto").value="";
document.getElementById("correoContacto").value="";
document.getElementById("telefonoContacto").value="";
document.getElementById("mensajeContacto").value="";

}