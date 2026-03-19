// ======================================
// ANIMACIONES SCROLL (REVERSIBLES)
// ======================================

const secciones = document.querySelectorAll(".animar");

const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
        } else {
            // 👇 REVERSIBLE (cuando sale de pantalla)
            entry.target.classList.remove("visible");
        }

    });

}, {
    threshold: 0.2
});

// Aplicar observer
secciones.forEach(sec => observer.observe(sec));


// ======================================
// HEADER SCROLL EFECTO
// ======================================

window.addEventListener("scroll", () => {
    const header = document.querySelector("header");

    if (!header) return;

    header.classList.toggle("scrolled", window.scrollY > 50);
});


// ======================================
// MENU HAMBURGUESA
// ======================================

const menuToggle = document.getElementById("menuToggle");
const menu = document.getElementById("menu");

if(menuToggle && menu){

    menuToggle.addEventListener("click", () => {
        menu.classList.toggle("active");
    });

    // Cerrar menú al hacer click en enlaces
    const links = document.querySelectorAll("#menu a");

    links.forEach(link => {
        link.addEventListener("click", () => {
            menu.classList.remove("active");
        });
    });

}


