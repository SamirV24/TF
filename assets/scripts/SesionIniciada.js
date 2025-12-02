document.addEventListener("DOMContentLoaded", () => {
  const nombre = localStorage.getItem("usuarioActivo");

  if (nombre) {
    // Header
    document.getElementById("auth-buttons").style.display = "none";
    const profileButton = document.getElementById("profile-button");
    profileButton.style.display = "block";
    document.getElementById("btnPerfil").textContent = nombre;

    // Alternar menú perfil
    const btnPerfil = document.getElementById("btnPerfil");
    const profileMenu = document.getElementById("profile-menu");
    btnPerfil.addEventListener("click", () => {
      profileMenu.classList.toggle("show");
    });

    // Cerrar sesión (header)
    document.getElementById("cerrarSesion").addEventListener("click", () => {
      localStorage.removeItem("usuarioActivo");
      window.location.href = "index.html";
    });

    // Footer dinámico
    const footerUserSection = document.getElementById("footer-user-section");
    footerUserSection.innerHTML = `
        <h4 class="active">Perfil de ${nombre}</h4>
        <ul>
          <li><a href="Perfil.html">Ver Perfil</a></li>
          <li><a href="#" id="cerrarSesionFooter">Cerrar Sesión</a></li>
        </ul>
      `;

    // Cerrar sesión (footer)
    document
      .getElementById("cerrarSesionFooter")
      .addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("usuarioActivo");
        window.location.href = "index.html";
      });
  }
});

// ====================================
// HISTORIAL DE ACTIVIDAD (SERVICIO)
// ====================================

// Elementos
const serviceHistorial = document.getElementById("serviceHistorial");
const modalHistorial = document.getElementById("modalHistorial");
const closeHistorial = document.getElementById("closeHistorial");

const filtroTipoHistorial = document.getElementById("filtroTipoHistorial");
const filtroTextoHistorial = document.getElementById("filtroTextoHistorial");
const listaHistorial = document.getElementById("listaHistorial");

// Abrir modal al hacer clic en la tarjeta
serviceHistorial?.addEventListener("click", () => {
  modalHistorial.style.display = "flex";
  cargarHistorial();
});

// Cerrar modal
closeHistorial?.addEventListener("click", () => {
  modalHistorial.style.display = "none";
});

// Cerrar haciendo clic fuera
window.addEventListener("click", (e) => {
  if (e.target === modalHistorial) {
    modalHistorial.style.display = "none";
  }
});

// === FUNCIÓN PARA CARGAR HISTORIAL ===
function cargarHistorial() {
  let historial = JSON.parse(localStorage.getItem("historialAcciones") || "[]");

  const tipo = filtroTipoHistorial.value;
  const texto = filtroTextoHistorial.value.toLowerCase().trim();

  listaHistorial.innerHTML = "";

  if (historial.length === 0) {
    listaHistorial.innerHTML = `<p>No hay acciones registradas.</p>`;
    return;
  }

  historial = historial.reverse(); // Más recientes primero

  const filtrado = historial.filter((item) => {
    const coincideTipo = tipo === "todos" || item.tipo === tipo;
    const textoCompleto =
      (item.usuario + " " + item.detalle + " " + item.tipo).toLowerCase();
    const coincideTexto = textoCompleto.includes(texto);

    return coincideTipo && coincideTexto;
  });

  if (filtrado.length === 0) {
    listaHistorial.innerHTML = `<p>No se encontraron registros.</p>`;
    return;
  }

  filtrado.forEach((item) => {
    const card = document.createElement("div");
    card.className = "historial-card";

    const icono = document.createElement("div");
    icono.className = "historial-icono";

    if (item.tipo === "Inicio de sesión") {
      icono.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i>';
    } else if (item.tipo.includes("fallido")) {
      icono.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';
    } else {
      icono.innerHTML = '<i class="fa-solid fa-circle-info"></i>';
    }

    const info = document.createElement("div");
    info.className = "historial-info";
    info.innerHTML = `
      <p><b>Usuario:</b> ${item.usuario}</p>
      <p><b>Acción:</b> ${item.tipo}</p>
      <p><b>Fecha:</b> ${item.fechaHora}</p>
      ${
        item.detalle 
        ? `<p><b>Detalle:</b> ${item.detalle}</p>`
        : ""
      }
    `;

    card.appendChild(icono);
    card.appendChild(info);
    listaHistorial.appendChild(card);
  });
}

// Filtros dinámicos
filtroTipoHistorial?.addEventListener("change", cargarHistorial);
filtroTextoHistorial?.addEventListener("input", cargarHistorial);


// ----- MENÚ HAMBURGUESA -----
const hamburger = document.getElementById("hamburger");
const nav = document.querySelector(".nav");
const registrarBtn = document.querySelector(".btn-registrarse");
const iniciarSesionBtn = document.querySelector(".btn-iniciarSesion");

hamburger.addEventListener("click", () => {
  // Alternar visibilidad del menú
  nav.classList.toggle("nav-active");
  registrarBtn.classList.toggle("nav-active");
  iniciarSesionBtn.classList.toggle("nav-active");

  // Cambiar ícono del menú)
  hamburger.classList.toggle("open");
  if (hamburger.classList.contains("open")) {
    hamburger.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  } else {
    hamburger.innerHTML = '<i class="fa-solid fa-bars"></i>';
  }
});

