// ===============================
// PRODUCTOS DESTACADOS HOME
// ===============================

async function cargarDestacados(){

    try{

        const res = await fetch("data/productos.json");
        const productos = await res.json();

        const contenedor = document.getElementById("productosDestacados");

        if(!contenedor) return;

        // 👇 puedes cambiar lógica aquí
        const destacados = productos
            .sort(() => Math.random() - 0.5)
            .slice(0,4);

        contenedor.innerHTML = "";

        destacados.forEach(p => {

            contenedor.innerHTML += `
            <div class="producto">

                <img src="${p.imagen}" alt="${p.nombre}" loading="lazy">

                <h3>${p.nombre}</h3>

                <p>${p.marca}</p>

                <button onclick="descargarFicha('${p.ficha}')">
                    Ficha técnica
                </button>

                <button onclick="agregarCarrito(${p.id})">
                    Cotizar
                </button>

            </div>
            `;
        });

    }catch(error){

        console.error("Error en destacados:", error);

    }
}


// INICIAR
document.addEventListener("DOMContentLoaded", cargarDestacados);