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