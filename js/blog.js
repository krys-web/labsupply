// ==========================================
// VARIABLES GLOBALES
// ==========================================
let todosLosBlogs = []; // Datos originales del JSON
let blogsFiltrados = []; // Datos después de buscar
let paginaActual = 1;
const articulosPorPagina = 10;

// ==========================================
// CARGAR BLOGS DESDE JSON
// ==========================================
async function cargarBlogs() {
    try {
        const respuesta = await fetch("data/blog.json");
        if (!respuesta.ok) throw new Error("No se pudo cargar el JSON");

        todosLosBlogs = await respuesta.json();
        blogsFiltrados = [...todosLosBlogs]; // Al inicio, filtrados es igual a todos

        renderizarInterfaz();
    } catch (error) {
        console.error("Error cargando blogs:", error);
        document.querySelector(".gridBlog").innerHTML = `<p>Error cargando artículos 😢</p>`;
    }
}

// ==========================================
// LÓGICA DE BÚSQUEDA
// ==========================================
function filtrarArticulos() {
    const termino = document.getElementById("inputBusqueda").value.toLowerCase();
    
    blogsFiltrados = todosLosBlogs.filter(blog => 
        blog.titulo.toLowerCase().includes(termino) || 
        (blog.introduccion && blog.introduccion.toLowerCase().includes(termino)) ||
        (blog.categoria && blog.categoria.toLowerCase().includes(termino))
    );

    paginaActual = 1; // Reiniciar a la primera página tras buscar
    renderizarInterfaz();
}

// ==========================================
// RENDERIZADO (MOSTRAR ARTÍCULOS Y PAGINACIÓN)
// ==========================================
function renderizarInterfaz() {
    const contenedor = document.querySelector(".gridBlog");
    if (!contenedor) return;

    // Calcular índices para la paginación
    const inicio = (paginaActual - 1) * articulosPorPagina;
    const fin = inicio + articulosPorPagina;
    const articulosVisibles = blogsFiltrados.slice(inicio, fin);

    contenedor.innerHTML = "";

    if (articulosVisibles.length === 0) {
        contenedor.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; padding: 50px;">No se encontraron artículos que coincidan con tu búsqueda.</p>`;
    }

    articulosVisibles.forEach(blog => {
        const articulo = document.createElement("article");
        articulo.className = "blogCard animar";
        articulo.innerHTML = `
            <div class="blogImg">
                <img src="${blog.imagen}" alt="${blog.titulo}">
                <span class="blogCategoria">${blog.categoria || ""}</span>
            </div>
            <div class="blogContenido">
                <span class="blogFecha">${blog.fecha || ""} · ${blog.lectura || ""}</span>
                <h3>${blog.titulo}</h3>
                <p>${blog.resumen || ""}</p>
                <a href="blog-articulo.html?id=${blog.id}" class="btnLeer">Leer más →</a>
            </div>
        `;
        
        articulo.addEventListener("click", (e) => {
            if (!e.target.closest(".btnLeer")) {
                window.location.href = `blog-articulo.html?id=${blog.id}`;
            }
        });

        contenedor.appendChild(articulo);
    });

    actualizarControlesPaginacion();
    setTimeout(animarCards, 100);
}

// ==========================================
// CONTROLES DE PAGINACIÓN
// ==========================================
function actualizarControlesPaginacion() {
    const paginacionDiv = document.getElementById("controlesPaginacion");
    const totalPaginas = Math.ceil(blogsFiltrados.length / articulosPorPagina);
    
    paginacionDiv.innerHTML = "";

    if (totalPaginas <= 1) return;

    for (let i = 1; i <= totalPaginas; i++) {
        const boton = document.createElement("button");
        boton.innerText = i;
        boton.className = `btnPaginacion ${i === paginaActual ? 'active' : ''}`;
        boton.onclick = () => {
            paginaActual = i;
            renderizarInterfaz();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
        paginacionDiv.appendChild(boton);
    }
}

// Animación de cards existente
function animarCards() {
    const cards = document.querySelectorAll(".blogCard");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => { entry.target.classList.add("show"); }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    cards.forEach(card => observer.observe(card));
}

document.addEventListener("DOMContentLoaded", () => {
    cargarBlogs();
    document.getElementById("inputBusqueda")?.addEventListener("input", filtrarArticulos);
});