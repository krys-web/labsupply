async function cargarArticulo() {
    const params = new URLSearchParams(window.location.search);
    const idCapturado = params.get("id");

    if (!idCapturado) {
        console.warn("No hay ID en la URL");
        return;
    }

    try {
        const res = await fetch("data/blog.json");
        if (!res.ok) throw new Error("No se pudo cargar blog.json");
        
        const blogs = await res.json();

        // Búsqueda flexible por ID
        const blog = blogs.find(b => b.id.toString() === idCapturado.toString());

        if (!blog) {
            document.getElementById("contenido").innerHTML = `
                <div style="text-align:center; padding: 50px;">
                    <h2>Artículo no encontrado</h2>
                    <p>El ID "${idCapturado}" no existe en nuestro registro.</p>
                    <a href="blog.html" class="btnLeer">Volver al blog</a>
                </div>`;
            return;
        }

        // ==========================================
        // IMPLEMENTACIÓN SEO DINÁMICA
        // ==========================================
        
        // 1. Título de la página (SEO Title)
        document.title = `${blog.titulo} | Lab Supply`;

        // 2. Meta Descripción
        actualizarMetaTag("description", blog.metaDescripcion || blog.introduccion);

        // 3. Meta Keywords
        actualizarMetaTag("keywords", blog.keywords || "");

        // 4. Open Graph (Para redes sociales y WhatsApp)
        actualizarMetaTag("og:title", blog.titulo, true);
        actualizarMetaTag("og:description", blog.metaDescripcion || blog.introduccion, true);
        actualizarMetaTag("og:image", window.location.origin + "/" + blog.imagen, true);
        actualizarMetaTag("og:url", window.location.href, true);
        actualizarMetaTag("og:type", "article", true);

        // ==========================================
        // LLENAR CONTENIDO VISUAL
        // ==========================================
        
        document.getElementById("titulo").textContent = blog.titulo;
        document.getElementById("imagen").src = blog.imagen;
        document.getElementById("imagen").alt = blog.titulo; // Alt text para SEO de imágenes
        
        if(document.getElementById("fecha")) document.getElementById("fecha").textContent = blog.fecha;
        if(document.getElementById("categoria")) document.getElementById("categoria").textContent = blog.categoria;
        if(document.getElementById("lectura")) document.getElementById("lectura").textContent = blog.lectura;

        const contenedor = document.getElementById("contenido");
        contenedor.innerHTML = ""; 

        // Introducción
        if (blog.introduccion) {
            const pIntro = document.createElement("p");
            pIntro.className = "intro"; 
            pIntro.textContent = blog.introduccion;
            contenedor.appendChild(pIntro);
        }

        // Cuerpo del artículo
blog.contenido.forEach(bloque => {

    switch(bloque.tipo){

        case "titulo":
            const h2 = document.createElement("h2");
            h2.textContent = bloque.texto;
            contenedor.appendChild(h2);
        break;

        case "parrafo":
            const p = document.createElement("p");
            p.innerHTML = bloque.texto;
            contenedor.appendChild(p);
        break;

        case "lista_simple":
            const ul = document.createElement("ul");

            bloque.items.forEach(item => {
                const li = document.createElement("li");
                li.innerHTML = item;
                ul.appendChild(li);
            });

            contenedor.appendChild(ul);
        break;

case "lista_numerada":
    const ol = document.createElement("ol");

    bloque.items.forEach(item => {
        const li = document.createElement("li");

        // 🔥 TODO en una sola línea REAL
        li.innerHTML = `<strong>${item.titulo}:</strong> ${item.descripcion || ""}`;

        // subitems
        if (item.subitems) {
            const subUl = document.createElement("ul");

            item.subitems.forEach(sub => {
                const subLi = document.createElement("li");
                subLi.innerHTML = sub;
                subUl.appendChild(subLi);
            });

            li.appendChild(subUl);
        }

        ol.appendChild(li);
    });

    contenedor.appendChild(ol);
break;

case "lista_ordenada":
    const olOrdenada = document.createElement("ol");

    bloque.items.forEach(item => {
        const li = document.createElement("li");
        li.innerHTML = item;
        olOrdenada.appendChild(li);
    });

    contenedor.appendChild(olOrdenada);
break;

case "lista":
    const ulLista = document.createElement("ul");

    bloque.items.forEach(item => {
        const li = document.createElement("li");
        li.innerHTML = item; // 🔥 permite <strong>, links, etc.
        ulLista.appendChild(li);
    });

    contenedor.appendChild(ulLista);
break;

    }

});

        // Lógica de Conclusión
        const pConclusion = document.getElementById("conclusion");
        const seccionFinal = document.getElementById("seccion-conclusion") || pConclusion?.parentElement;

        if (blog.conclusion && pConclusion) {
            pConclusion.textContent = blog.conclusion;
            if (seccionFinal) seccionFinal.style.display = "block"; 
        } else if (seccionFinal) {
            seccionFinal.style.display = "none";
        }

    } catch (error) {
        console.error("Error crítico en cargarArticulo:", error);
    }
}

/**
 * Función auxiliar para crear o actualizar Meta Tags
 * @param {string} nombre - Nombre o propiedad del tag
 * @param {string} contenido - Valor del contenido
 * @param {boolean} esProperty - Define si usa 'name' o 'property' (para OG tags)
 */
function actualizarMetaTag(nombre, contenido, esProperty = false) {
    const atributo = esProperty ? "property" : "name";
    let tag = document.querySelector(`meta[${atributo}="${nombre}"]`);
    
    if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(atributo, nombre);
        document.head.appendChild(tag);
    }
    tag.content = contenido;
}

document.addEventListener("DOMContentLoaded", cargarArticulo);