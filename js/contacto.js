/**
 * contacto.js 
 * Manejo de envío de formulario mediante AJAX hacia enviar.php
 */

document.addEventListener("DOMContentLoaded", () => {
    const botonEnviar = document.getElementById("btnEnviarContacto");
    if (botonEnviar) {
        botonEnviar.addEventListener("click", enviarMensaje);
    }
});

async function enviarMensaje(e) {
    // Evitamos que el formulario se envíe de forma tradicional o recargue la página
    e.preventDefault();

    const btn = document.getElementById("btnEnviarContacto");
    
    // Captura de valores de los inputs
    const nombre = document.getElementById("nombreContacto").value.trim();
    const correo = document.getElementById("correoContacto").value.trim();
    const telefono = document.getElementById("telefonoContacto").value.trim();
    const mensaje = document.getElementById("mensajeContacto").value.trim();

    // 1. Validación básica de campos obligatorios
    if (nombre === "" || correo === "" || mensaje === "") {
        alert("Por favor, complete todos los campos obligatorios (Nombre, Correo y Mensaje).");
        return;
    }

    // 2. Validación simple de formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
        alert("Por favor, ingrese un correo electrónico válido.");
        return;
    }

    // Cambiar estado del botón para evitar múltiples clics
    const textoOriginal = btn.innerText;
    btn.innerText = "Enviando...";
    btn.disabled = true;

    // 3. Preparar datos para enviar al archivo PHP
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("correo", correo);
    formData.append("telefono", telefono);
    formData.append("mensaje", mensaje);

    try {
        // Petición asíncrona a enviar.php
        const response = await fetch("enviar.php", {
            method: "POST",
            body: formData
        });

        // Verificamos si la respuesta del servidor es exitosa (status 200-299)
        if (response.ok) {
            alert("¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.");
            limpiarFormulario();
        } else {
            // Si el servidor responde pero con un error (ej. 500)
            const errorData = await response.text();
            console.error("Error del servidor:", errorData);
            throw new Error("No se pudo procesar el envío en el servidor.");
        }
    } catch (error) {
        // Errores de red o de ejecución
        alert("Hubo un problema al enviar el mensaje. Por favor, intente más tarde.");
        console.error("Error en la petición fetch:", error);
    } finally {
        // Restaurar siempre el estado del botón al finalizar
        btn.innerText = textoOriginal;
        btn.disabled = false;
    }
}

/**
 * Limpia los campos del formulario tras un envío exitoso
 */
function limpiarFormulario() {
    const campos = [
        "nombreContacto",
        "correoContacto",
        "telefonoContacto",
        "mensajeContacto"
    ];
    
    campos.forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) elemento.value = "";
    });
}