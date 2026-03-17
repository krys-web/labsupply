async function cargarArticulo(){

    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get("id"));

    const res = await fetch("data/blog.json");
    const blogs = await res.json();

    const blog = blogs.find(b => b.id === id);

    if(!blog){
        document.body.innerHTML = "Artículo no encontrado";
        return;
    }

    // DATOS PRINCIPALES
    document.getElementById("titulo").textContent = blog.titulo;
    document.getElementById("fecha").textContent = blog.fecha;
    document.getElementById("categoria").textContent = blog.categoria;
    document.getElementById("lectura").textContent = blog.lectura;
    document.getElementById("imagen").src = blog.imagen;
    document.getElementById("introduccion").textContent = blog.introduccion;
    document.getElementById("conclusion").textContent = blog.conclusion;

    // CONTENIDO DINAMICO (H2)
    const contenedor = document.getElementById("contenido");

    blog.contenido.forEach(seccion => {

        const h2 = document.createElement("h2");
        h2.textContent = seccion.subtitulo;

        const p = document.createElement("p");
        p.textContent = seccion.texto;

        contenedor.appendChild(h2);
        contenedor.appendChild(p);
    });

    // ARTICULOS RECIENTES
    const recientes = document.getElementById("recientes");

    blogs.slice(0,3).forEach(b=>{
        const li = document.createElement("li");
        li.innerHTML = `<a href="blog-articulo.html?id=${b.id}">${b.titulo}</a>`;
        recientes.appendChild(li);
    });

}

document.addEventListener("DOMContentLoaded", cargarArticulo);