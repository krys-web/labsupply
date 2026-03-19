const elementos = document.querySelectorAll("section");

function mostrarElementos(){

const trigger = window.innerHeight * 0.85;

elementos.forEach(el => {

const top = el.getBoundingClientRect().top;

if(top < trigger){

el.classList.add("visible");

}

});

}

window.addEventListener("scroll", mostrarElementos);

mostrarElementos();

window.addEventListener("scroll", () => {
    const header = document.querySelector("header");
    header.classList.toggle("scrolled", window.scrollY > 50);
});

// ==========================
// MENU HAMBURGUESA
// ==========================

const menuToggle = document.getElementById("menuToggle");
const menu = document.getElementById("menu");

menuToggle.addEventListener("click", () => {
    menu.classList.toggle("active");
});

// CERRAR MENU AL HACER CLICK.

const links = document.querySelectorAll("#menu a");

links.forEach(link => {
    link.addEventListener("click", () => {
        menu.classList.remove("active");
    });
});


// ANIMACION SCROLL PARA MISION Y VISION

const secciones = document.querySelectorAll('.animar');

const mostrarSeccion = () => {
    const trigger = window.innerHeight * 0.85;

    secciones.forEach(sec => {
        const top = sec.getBoundingClientRect().top;
        const bottom = sec.getBoundingClientRect().bottom;

        // Si está dentro de la pantalla
        if (top < trigger && bottom > 0) {
            sec.classList.add('visible');
        } else {
            // 👇 CLAVE: quitar la clase cuando sale
            sec.classList.remove('visible');
        }
    });
};

window.addEventListener('scroll', mostrarSeccion);
window.addEventListener('load', mostrarSeccion);

const trigger = window.innerHeight * 0.75;


