// ===============================
// VARIABLES GLOBALES
// ===============================
let productosBase = []; // Lista original completa
let productosFiltrados = []; // Lista tras búsquedas o filtros
let paginaActual = 1;
const productosPorPagina = 12;

// ===============================
// CARGAR PRODUCTOS
// ===============================
async function cargarProductos() {
    try {
        const respuesta = await fetch("data/productos.json");
        if (!respuesta.ok) throw new Error("No se pudo cargar el JSON");
        
        const datos = await respuesta.json();
        
        // Sincronizar con la variable global que usa el modal (producto.js)
        window.productosGlobal = datos;
        productosBase = datos;
        productosFiltrados = [...datos];

        mostrarProductos();
        actualizarContador(); // Función de carrito.js

    } catch (error) {
        console.error("Error cargando productos:", error);
    }
}

// ===============================
// MOSTRAR PRODUCTOS (GRID)
// ===============================
function mostrarProductos() {
    const contenedor = document.getElementById("productos");
    if (!contenedor) return;

    contenedor.innerHTML = "";

    const inicio = (paginaActual - 1) * productosPorPagina;
    const fin = inicio + productosPorPagina;
    const productosPagina = productosFiltrados.slice(inicio, fin);

    if (productosPagina.length === 0) {
        contenedor.innerHTML = "<p class='no-results'>No se encontraron productos que coincidan con tu búsqueda.</p>";
        return;
    }

productosPagina.forEach(p => {
    contenedor.innerHTML += `
        <div class="producto" onclick="abrirProducto(${p.id})">
            <img src="${p.imagen}" alt="${p.nombre}" loading="lazy">
            <div class="info-card">
                <span class="sku">${p.codigo}</span> <h3>${p.nombre}</h3>
                <p>${p.marca}</p>
            </div>
            <div class="acciones-producto"> <button onclick="event.stopPropagation(); descargarFicha('${p.pdf}')">
                    <i class="fa-solid fa-file-pdf"></i> Ficha
                </button>
                <button onclick="event.stopPropagation(); agregarCarrito(${p.id})">
                    <i class="fa-solid fa-cart-plus"></i> Cotizar
                </button>
            </div>
        </div>
    `;
});

    generarPaginacion();
}

// ===============================
// BUSCADOR Y FILTROS
// ===============================
function aplicarFiltros() {
    const buscador = document.getElementById("buscador");
    const filtroCategoria = document.getElementById("filtroCategoria");
    
    if (!buscador) return;

    const texto = buscador.value.toLowerCase().trim();
    const categoria = filtroCategoria ? filtroCategoria.value : "";

    productosFiltrados = productosBase.filter(p => {
    // Convertimos todo a String antes de usar toLowerCase()
    const nombre = String(p.nombre || "").toLowerCase();
    const marca = String(p.marca || "").toLowerCase();
    const codigo = String(p.codigo || "").toLowerCase(); // <--- Cambio clave
    const keywords = String(p.keywords || "").toLowerCase();

    const coincideTexto = nombre.includes(texto) || 
                         marca.includes(texto) || 
                         codigo.includes(texto) ||
                         keywords.includes(texto);

    const coincideCategoria = categoria === "" || p.categoria === categoria;

    return coincideTexto && coincideCategoria;
});

    paginaActual = 1; // Reiniciar a la primera página tras buscar
    mostrarProductos();
    actualizarPaginacion();
}
// ===============================
// PAGINACIÓN ACTUALIZADA
// ===============================
function generarPaginacion() {
    const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);
    const contenedor = document.getElementById("paginacion");
    if (!contenedor) return;

    contenedor.innerHTML = "";

    // Si no hay suficientes productos para más de una página, no mostramos nada
    if (totalPaginas <= 1) return;

    // --- Botón Anterior ---
    const btnAnterior = document.createElement("button");
    btnAnterior.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
    btnAnterior.disabled = (paginaActual === 1);
    btnAnterior.onclick = () => cambiarPagina(paginaActual - 1);
    contenedor.appendChild(btnAnterior);

    // --- Lógica de Números con Puntos Suspendidos ---
    let paginasAMostrar = [];
    
    // Siempre mostramos la primera página
    paginasAMostrar.push(1);

    // Calculamos el rango alrededor de la página actual
    let inicio = Math.max(2, paginaActual - 1);
    let fin = Math.min(totalPaginas - 1, paginaActual + 1);

    // Ajuste para mostrar siempre un bloque consistente
    if (paginaActual <= 3) fin = Math.min(totalPaginas - 1, 4);
    if (paginaActual >= totalPaginas - 2) inicio = Math.max(2, totalPaginas - 3);

    // Añadir puntos suspensivos iniciales
    if (inicio > 2) {
        paginasAMostrar.push("...");
    }

    // Añadir el bloque central (máximo 3-4 números)
    for (let i = inicio; i <= fin; i++) {
        paginasAMostrar.push(i);
    }

    // Añadir puntos suspensivos finales
    if (fin < totalPaginas - 1) {
        paginasAMostrar.push("...");
    }

    // Siempre mostramos la última página (si es que hay más de una)
    if (totalPaginas > 1) {
        paginasAMostrar.push(totalPaginas);
    }

    // --- Renderizar los botones generados ---
    paginasAMostrar.forEach(p => {
        if (p === "...") {
            const span = document.createElement("span");
            span.textContent = "...";
            span.className = "paginacion-separador";
            contenedor.appendChild(span);
        } else {
            const boton = document.createElement("button");
            boton.textContent = p;
            if (p === paginaActual) boton.classList.add("active");
            boton.onclick = () => cambiarPagina(p);
            contenedor.appendChild(boton);
        }
    });

    // --- Botón Siguiente ---
    const btnSiguiente = document.createElement("button");
    btnSiguiente.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
    btnSiguiente.disabled = (paginaActual === totalPaginas);
    btnSiguiente.onclick = () => cambiarPagina(paginaActual + 1);
    contenedor.appendChild(btnSiguiente);
}

function cambiarPagina(p) {
    paginaActual = p;
    mostrarProductos();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// ===============================
// FUNCIONES DEL MODAL (COMPARTIDAS)
// ===============================
// Nota: abrirProducto() ya debe estar en producto.js para evitar duplicados

function cerrarProducto() {
    const modal = document.getElementById("modalProducto");
    if (modal) modal.style.display = "none";
}

function descargarFicha(url) {
    if (!url || url === "undefined" || url === "") {
        alert("Ficha técnica no disponible");
        return;
    }
    window.open(url, "_blank");
}

// ===============================
// EVENTOS E INICIO
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();

    const buscador = document.getElementById("buscador");
    const filtro = document.getElementById("filtroCategoria");

    if (buscador) buscador.addEventListener("keyup", aplicarFiltros);
    if (filtro) filtro.addEventListener("change", aplicarFiltros);
});


// ===============================
// FUNCIONAMIENTO DE BOTON LIMPIAR EN BUSCADOR
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    const buscador = document.getElementById("buscador");
    const clearBtn = document.getElementById("clearSearch");

    if (buscador && clearBtn) {
        // Mostrar/ocultar la X según si hay texto
        buscador.addEventListener("input", () => {
            if (buscador.value.length > 0) {
                clearBtn.style.display = "block";
            } else {
                clearBtn.style.display = "none";
            }
        });

        // Lógica para limpiar el buscador
        clearBtn.addEventListener("click", () => {
            buscador.value = ""; // Borra el texto
            clearBtn.style.display = "none"; // Oculta la X
            buscador.focus(); // Devuelve el foco al input
            
            // IMPORTANTE: Resetear el filtro para mostrar todos los productos
            aplicarFiltros(); 
        });
    }
});