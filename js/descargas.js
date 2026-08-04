const servicios = [
    {
        nombre: "Ventas",
        descripcion: "Comercialización de equipos de alta precisión y reactivos químicos certificados.",
        imagen: "img/servicios/ventas2.jpg",
        icono: "fa-solid fa-cart-shopping",
        // Enlace personalizado para Ventas
        link: "https://wa.me/593991793261?text=Hola,%20estoy%20interesado%20en%20adquirir%20equipos%20o%20reactivos."
    },
        {
        nombre: "Soporte Técnico",
        descripcion: "Mantenimiento preventivo y correctivo de equipos de laboratorio por especialistas.",
        imagen: "img/servicios/soporte-tecnico.jpg",
        icono: "fa-solid fa-gears",
        // Enlace personalizado para Soporte
        link: "https://wa.me/593992291059?text=Hola,%20necesito%20asistencia%20técnica%20para%20un%20equipo."
    },
    {
        nombre: "Distribución",
        descripcion: "Logística eficiente para asegurar que sus insumos lleguen a tiempo y en perfectas condiciones.",
        imagen: "img/servicios/distribucion.jpg",
        icono: "fa-solid fa-truck-fast",
        link: "contacto.html"
    },
    {
        nombre: "Asesoramiento",
        descripcion: "Consultoría técnica para la selección del equipamiento adecuado según sus necesidades.",
        imagen: "img/servicios/asesoramiento.jpg",
        icono: "fa-solid fa-user-tie",
        link: "contacto.html"
    }
];

function renderizarServicios() {
    const contenedor = document.getElementById("servicios-grid");
    if (!contenedor) return;

    contenedor.innerHTML = "";

    servicios.forEach(ser => {
        const card = document.createElement("div");
        card.className = "card-servicio";

        // Se utiliza ser.link en lugar de un enlace estático
        card.innerHTML = `
            <div class="imagen-container">
                <img src="${ser.imagen}" alt="${ser.nombre}">
                <div class="overlay-icono">
                    <i class="${ser.icono}"></i>
                </div>
            </div>
            <div class="info-servicio">
                <h3>${ser.nombre}</h3>
                <p>${ser.descripcion}</p>
                <a href="${ser.link}" 
                   class="btn-contacto" 
                   ${ser.link.includes('wa.me') ? 'target="_blank"' : ''}>
                   Más información
                </a>
            </div>
        `;
        contenedor.appendChild(card);
    });
}

document.addEventListener("DOMContentLoaded", renderizarServicios);