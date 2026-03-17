// ==========================================
// VARIABLES
// ==========================================
let blogs = [];


// ==========================================
// CARGAR BLOGS DESDE JSON
// ==========================================
async function cargarBlogs() {

    try {

        const respuesta = await fetch("data/blog.json");

        if (!respuesta.ok) {
            throw new Error("No se pudo cargar el JSON");
        }

        blogs = await respuesta.json();

        mostrarBlogs(blogs);

        setTimeout(animarCards, 100);

    } catch (error) {

        console.error("Error cargando blogs:", error);

        document.querySelector(".gridBlog").innerHTML = `
            <p style="text-align:center; width:100%;">
                Error cargando artículos 😢
            </p>
        `;
    }

}


// ==========================================
// MOSTRAR BLOGS
// ==========================================
function mostrarBlogs(lista) {

    const contenedor = document.querySelector(".gridBlog");

    if (!contenedor) return;

    contenedor.innerHTML = "";

    lista.forEach(blog => {

        const articulo = document.createElement("article");
        articulo.className = "blogCard animar";

        articulo.innerHTML = `
            <div class="blogImg">
                <img src="${blog.imagen}" alt="${blog.titulo}">
                <span class="blogCategoria">${blog.categoria || ""}</span>
            </div>

            <div class="blogContenido">

                <span class="blogFecha">
                    ${blog.fecha || ""} · ${blog.lectura || ""}
                </span>

                <h3>${blog.titulo}</h3>

                <p>${blog.descripcion || blog.introduccion || ""}</p>

                <a href="blog-articulo.html?id=${blog.id}" class="btnLeer">
                    Leer más →
                </a>

            </div>
        `;

        // 👉 CLICK EN TODA LA CARD (MEJORADO)
        articulo.addEventListener("click", (e) => {

            // Si hace click en el botón, NO interferir
            if (e.target.closest(".btnLeer")) return;

            window.location.href = `blog-articulo.html?id=${blog.id}`;

        });

        contenedor.appendChild(articulo);

    });

}


// ==========================================
// ANIMACION SCROLL
// ==========================================
function animarCards() {

    const cards = document.querySelectorAll(".blogCard");

    if (!cards.length) return;

    const observer = new IntersectionObserver((entries) => {

        entries.forEach((entry, index) => {

            if (entry.isIntersecting) {

                setTimeout(() => {
                    entry.target.classList.add("show");
                }, index * 100);

                observer.unobserve(entry.target);
            }

        });

    }, { threshold: 0.15 });

    cards.forEach(card => observer.observe(card));

}


// ==========================================
// INICIAR
// ==========================================
document.addEventListener("DOMContentLoaded", cargarBlogs);