// ==========================================
// VARIABLES GLOBALES
// ==========================================
window.productosGlobal = []; 

// ==========================================
// INICIALIZACIÓN ÚNICA
// ==========================================
async function inicializarPagina() {
    try {
        const res = await fetch("data/productos.json");
        if (!res.ok) throw new Error("No se pudo cargar el JSON");
        
        const productos = await res.json();
        window.productosGlobal = productos;

        // Ejecutar cargas si los contenedores existen
        if (document.getElementById("productosDestacados")) {
            cargarDestacados(productos);
        }
        
        if (document.getElementById("track1")) {
            cargarCarruselesDinamicos(productos);
        }

        // Si hay un contador de cotización, actualizarlo
        if (typeof actualizarContador === 'function') {
            actualizarContador();
        }

    } catch (error) {
        console.error("Error crítico en inicialización:", error);
    }
}

// ==========================================
// PRODUCTOS DESTACADOS (GRID)
// ==========================================
function cargarDestacados(productos) {
    const contenedor = document.getElementById("productosDestacados");
    if (!contenedor) return;

    const destacados = productos
        .filter(p => p.destacado)
        .sort(() => Math.random() - 0.5)
        .slice(0, 4);

    contenedor.innerHTML = destacados.map(p => `
        <div class="producto" onclick="abrirProducto(${p.id})">
            <img src="${p.imagen}" alt="${p.nombre}" loading="lazy">
            <h3>${p.nombre}</h3>
            <p>${p.marca}</p>
            <div class="acciones-producto">
                <button onclick="event.stopPropagation(); descargarFicha('${p.pdf}')">
                    <i class="fa-solid fa-file-pdf"></i> Ficha técnica
                </button>
                <button onclick="event.stopPropagation(); agregarCarrito(${p.id})">
                    <i class="fa-solid fa-cart-plus"></i> Cotizar
                </button>
            </div>
        </div>
    `).join('');
}

// ==========================================
// CARRUSELES DINÁMICOS
// ==========================================
function cargarCarruselesDinamicos(productos) {
    const track1 = document.getElementById("track1");
    const track2 = document.getElementById("track2");
    if (!track1 || !track2) return;

    const grupo1 = [...productos].sort(() => Math.random() - 0.5);
    const grupo2 = [...productos].sort(() => Math.random() - 0.5);

    const crearItem = (p) => `
        <div class="carrusel-item" onclick="abrirProducto(${p.id})">
            <img src="${p.imagen}" alt="${p.nombre}">
            <div class="info-item">
                <span><strong>${p.nombre}</strong></span>
                <small>${p.marca}</small>
                <span class="ver-mas">Ver detalle →</span>
            </div>
        </div>
    `;

    const html1 = grupo1.map(crearItem).join('');
    const html2 = grupo2.map(crearItem).join('');

    track1.innerHTML = html1 + html1;
    track2.innerHTML = html2 + html2;
}

// ==========================================
// FUNCIONES DEL MODAL (COMPARTIDAS)
// ==========================================
function cerrarProducto() {
    const modal = document.getElementById("modalProducto");
    if (modal) modal.style.display = "none";
}

function mostrarTab(tabId) {
    const pestañas = document.querySelectorAll('.tab-pestaña');
    const botones = document.querySelectorAll('.tabs li');
    
    pestañas.forEach(tab => tab.style.display = 'none');
    botones.forEach(btn => btn.classList.remove('tab-activo'));

    const target = document.getElementById(tabId);
    if (target) target.style.display = 'block';
    if (event && event.currentTarget) event.currentTarget.classList.add('tab-activo');
}

function descargarFicha(url) {
    if (!url || url === "undefined" || url === "") {
        alert("Ficha técnica no disponible.");
        return;
    }
    window.open(url, "_blank");
}

// Iniciar todo
document.addEventListener("DOMContentLoaded", inicializarPagina);