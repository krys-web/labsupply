// ======================================
// CARRUSEL DE CLIENTES
// Movimiento continuo + flechas.
// Tarjetas grandes en los extremos y pequeñas hacia el centro.
// ======================================

(function () {

    const carrusel = document.getElementById("carruselClientes");
    if (!carrusel) return;

    const viewport = carrusel.querySelector(".clientes-viewport");
    const cards = Array.from(carrusel.querySelectorAll(".cliente-card"));
    const btnPrev = carrusel.querySelector(".clientes-flecha.prev");
    const btnNext = carrusel.querySelector(".clientes-flecha.next");

    const total = cards.length;
    if (!total) return;

    // ---- CONFIGURACIÓN ----
    let ESCALA_CENTRO = 0.7;      // tamaño de la tarjeta en el centro
    let ESCALA_EXTREMO = 1.15;    // tamaño de la tarjeta en los extremos
    let PROPORCION_ALTO = 1.05;   // alto de la tarjeta respecto a su ancho
    const VELOCIDAD = 0.32;       // tarjetas por segundo (movimiento continuo)
    const SEPARACION = 0.12;      // espacio entre tarjetas (proporción del ancho)

    const reducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let posicion = 0;        // posición actual (en tarjetas)
    let pendiente = 0;       // desplazamiento pendiente por flechas
    let direccion = 1;       // 1 = avanza hacia la izquierda, -1 = hacia la derecha
    let pausado = false;
    let ultimo = performance.now();

    let mitadVisible = 3;    // tarjetas visibles a cada lado del centro
    let ancho = 0;           // ancho del viewport
    let paso = 0;            // ancho de una "ranura" a escala 1
    let anchoTarjeta = 0;

    // Escala según la distancia al centro (t en tarjetas)
    function escala(t) {
        const d = Math.min(Math.abs(t) / mitadVisible, 1);
        return ESCALA_CENTRO + (ESCALA_EXTREMO - ESCALA_CENTRO) * d;
    }

    // Posición horizontal: integral de la escala, así las tarjetas
    // pequeñas quedan juntas y las grandes más separadas sin encimarse.
    function desplazamientoX(t) {
        const a = Math.abs(t);
        const h = mitadVisible;
        const k = (ESCALA_EXTREMO - ESCALA_CENTRO) / h;
        let x;
        if (a <= h) {
            x = ESCALA_CENTRO * a + k * a * a / 2;
        } else {
            x = ESCALA_CENTRO * h + k * h * h / 2 + ESCALA_EXTREMO * (a - h);
        }
        return Math.sign(t) * x * paso;
    }

    function medir() {
        ancho = viewport.clientWidth;

        if (ancho < 560) {
            // Celular: 3 tarjetas, menos diferencia de tamaño y más alto
            mitadVisible = 1;
            ESCALA_CENTRO = 0.82;
            ESCALA_EXTREMO = 1.08;
            PROPORCION_ALTO = 1.3;
        } else if (ancho < 900) {
            // Tablet
            mitadVisible = 2;
            ESCALA_CENTRO = 0.75;
            ESCALA_EXTREMO = 1.12;
            PROPORCION_ALTO = 1.15;
        } else {
            // Escritorio
            mitadVisible = 3;
            ESCALA_CENTRO = 0.7;
            ESCALA_EXTREMO = 1.15;
            PROPORCION_ALTO = 1.05;
        }

        // La última tarjeta visible llega justo al borde
        const integral = mitadVisible * (ESCALA_CENTRO + ESCALA_EXTREMO) / 2;
        paso = (ancho / 2) / (integral + ESCALA_EXTREMO / 2);
        anchoTarjeta = paso * (1 - SEPARACION);

        carrusel.style.setProperty("--cliente-ancho", anchoTarjeta + "px");
        carrusel.style.setProperty("--cliente-alto", (anchoTarjeta * PROPORCION_ALTO) + "px");
        viewport.style.height = (anchoTarjeta * PROPORCION_ALTO * ESCALA_EXTREMO + 30) + "px";

        ajustarTextos();
    }

    // Reduce el tamaño de letra de cada nombre hasta que quepa completo
    // dentro de su franja (máximo 3 líneas), sin cortar el texto.
    function ajustarTextos() {
        const nombres = carrusel.querySelectorAll(".cliente-nombre");
        nombres.forEach((el) => {
            el.style.fontSize = "";
            let tam = parseFloat(getComputedStyle(el).fontSize);
            const minimo = 7;
            while (tam > minimo &&
                   (el.scrollHeight > el.clientHeight + 1 ||
                    el.scrollWidth > el.clientWidth + 1)) {
                tam -= 0.5;
                el.style.fontSize = tam + "px";
            }
        });
    }

    function dibujar() {
        for (let i = 0; i < total; i++) {
            // distancia relativa al centro, envuelta en el rango [-total/2, total/2)
            let t = ((i - posicion) % total + total) % total;
            if (t >= total / 2) t -= total;

            const s = escala(t);
            const x = desplazamientoX(t);
            const fuera = Math.abs(x) - (anchoTarjeta * s) / 2 > ancho / 2;

            const card = cards[i];
            card.style.transform =
                `translate(-50%, -50%) translateX(${x.toFixed(2)}px) scale(${s.toFixed(4)})`;
            card.style.zIndex = String(Math.round(s * 100));
            card.style.opacity = fuera ? "0" : "1";
            card.style.visibility = fuera ? "hidden" : "visible";
        }
    }

    function animar(ahora) {
        const dt = Math.min((ahora - ultimo) / 1000, 0.1);
        ultimo = ahora;

        if (!pausado && !reducirMovimiento) {
            posicion += direccion * VELOCIDAD * dt;
        }

        // Desplazamiento suave producido por las flechas / arrastre
        if (pendiente !== 0) {
            const mov = pendiente * Math.min(1, dt * 7);
            posicion += mov;
            pendiente -= mov;
            if (Math.abs(pendiente) < 0.0005) pendiente = 0;
        }

        posicion = ((posicion % total) + total) % total;
        dibujar();
        requestAnimationFrame(animar);
    }

    // ---- FLECHAS ----
    btnNext.addEventListener("click", () => {
        direccion = 1;
        pendiente += 1;
    });

    btnPrev.addEventListener("click", () => {
        direccion = -1;
        pendiente -= 1;
    });

    // ---- PAUSA AL PASAR EL MOUSE ----
    viewport.addEventListener("mouseenter", () => { pausado = true; });
    viewport.addEventListener("mouseleave", () => { pausado = false; });

    // ---- DESLIZAR CON EL DEDO (móvil) ----
    let inicioX = null;
    viewport.addEventListener("touchstart", (e) => {
        inicioX = e.touches[0].clientX;
        pausado = true;
    }, { passive: true });

    viewport.addEventListener("touchend", (e) => {
        if (inicioX !== null) {
            const dx = e.changedTouches[0].clientX - inicioX;
            if (Math.abs(dx) > 30) {
                const d = dx < 0 ? 1 : -1;
                direccion = d;
                pendiente += d;
            }
        }
        inicioX = null;
        pausado = false;
    });

    // ---- TECLADO ----
    carrusel.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") btnNext.click();
        if (e.key === "ArrowLeft") btnPrev.click();
    });

    let esperaResize;
    window.addEventListener("resize", () => {
        clearTimeout(esperaResize);
        esperaResize = setTimeout(() => { medir(); dibujar(); }, 120);
    });

    // Recalcular cuando terminen de cargar las fuentes
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(ajustarTextos);
    }

    medir();
    dibujar();
    requestAnimationFrame((t) => { ultimo = t; requestAnimationFrame(animar); });

})();
