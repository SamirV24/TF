// --- Modal Recomendación del Día ---
const modalRecomendacion = document.getElementById("modalRecomendacion");
const btnRecomendacion = document.getElementById("btnRecomendacion");
const closeRecomendacion = document.getElementById("closeRecomendacion");

btnRecomendacion.addEventListener("click", () => {
  // Aquí puedes actualizar la imagen o el texto cada día
  document.getElementById("textoRecomendacion").textContent =
    "Hierve el agua durante al menos 1 minuto para eliminar microorganismos. Almacénala en envases limpios y tapados.";

  // Si quieres cambiar la imagen dinámicamente:
  // document.getElementById("imgRecomendacion").src = "assets/images/dia2.jpg";

  modalRecomendacion.style.display = "flex";
});

closeRecomendacion.addEventListener("click", () => {
  modalRecomendacion.style.display = "none";
});

// Cerrar al hacer clic fuera
window.addEventListener("click", (e) => {
  if (e.target === modalRecomendacion) {
    modalRecomendacion.style.display = "none";
  }
});


// ----- MODAL NOTIFICACIONES -----
const modalNot = document.getElementById("modalNotificaciones");
const btnNot = document.getElementById("btnNotificaciones");
const closeNot = document.getElementById("closeNotificaciones");
const btnSiNot = document.getElementById("btnSiNotificaciones");
const btnNoNot = document.getElementById("btnNoNotificaciones");

// Abrir popup
btnNot.addEventListener("click", () => {
  modalNot.style.display = "flex";
});

// Cerrar con X
closeNot.addEventListener("click", () => {
  modalNot.style.display = "none";
});

// Cerrar con botón SI
btnSiNot.addEventListener("click", () => {
  alert("Has elegido recibir notificaciones.");
  modalNot.style.display = "none";
});

// Cerrar con botón NO
btnNoNot.addEventListener("click", () => {
  alert("Has elegido no recibir notificaciones.");
  modalNot.style.display = "none";
});

// Cerrar si hace click fuera
window.addEventListener("click", (e) => {
  if (e.target === modalNot) {
    modalNot.style.display = "none";
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const nombreActivo = localStorage.getItem("usuarioActivo");
  const authButtons = document.getElementById("auth-buttons");
  const profileButton = document.getElementById("profile-button");

  if (nombreActivo) {
    authButtons.style.display = "none";
    profileButton.style.display = "block";
    document.getElementById("btnPerfil").textContent = nombreActivo;
    const profileMenu = document.getElementById("profile-menu");
    document.getElementById("btnPerfil").addEventListener("click", () => {
      profileMenu.classList.toggle("show");
    });
    document.getElementById("cerrarSesion").addEventListener("click", () => {
      localStorage.removeItem("usuarioActivo");
      window.location.href = "index.html";
    });
  }

  let alertas = [
    {
      titulo: "Niveles bajos de cloro residual",
      lugar: "San Juan de Lurigancho",
      fecha: "05/10/2025",
      hora: "07:45 a.m.",
      descripcion:
        "Se detectó un nivel de cloro inferior al recomendado, se recomienda hervir el agua antes de consumir.",
    },
    {
      titulo: "Corte programado de servicio",
      lugar: "Villa El Salvador",
      fecha: "05/10/2025",
      hora: "10:00 a.m. - 8:00 p.m.",
      descripcion:
        "Corte programado por mantenimiento de la red de distribución.",
    },
    {
      titulo: "Presencia de turbidez visible",
      lugar: "Comas",
      fecha: "06/10/2025",
      hora: "04:30 p.m.",
      descripcion: "Se observó agua con turbidez, evite consumir directamente.",
    },
    {
      titulo: "Reporte ciudadano confirmado",
      lugar: "San Martín de Porres",
      fecha: "06/10/2025",
      hora: "06:25 a.m.",
      descripcion:
        "Reporte de coloración del agua confirmado por la supervisión local.",
    },
  ];

  const alertasList = document.getElementById("alertasList");

  function renderAlertas() {
    alertasList.innerHTML = "";
    alertas.forEach((a) => {
      const div = document.createElement("div");
      div.className = "alerta-card";
      div.innerHTML = `
                <div class="alerta-info">
                  <i class="fa-regular fa-bell"></i>
                  <div class="alerta-text">
                    <p><b>Alerta:</b> ${a.titulo}</p>
                    <p><b>Lugar:</b> ${a.lugar}</p>
                    <p><b>Fecha:</b> ${a.fecha}</p>
                    <p><b>Hora:</b> ${a.hora}</p>
                  </div>
                </div>
                <i class="fa-solid fa-arrow-right"></i>
              `;
      div.addEventListener("click", () => {
        alert(
          `Detalles de la alerta:\n\nTítulo: ${a.titulo}\nLugar: ${a.lugar}\nFecha: ${a.fecha}\nHora: ${a.hora}\n\nDescripción: ${a.descripcion}`
        );
      });
      alertasList.appendChild(div);
    });
  }

  renderAlertas();

  // Modal
  const modal = document.getElementById("modalAlerta");
  const btnAdd = document.getElementById("btnAddAlerta");
  const spanClose = document.querySelector(".modal .close");
  const formAlerta = document.getElementById("formAlerta");
  const mensajeForm = document.getElementById("mensajeForm");

  btnAdd.addEventListener("click", () => {
    modal.style.display = "flex";
    mensajeForm.textContent = "";
  });
  spanClose.addEventListener("click", () => {
    modal.style.display = "none";
  });
  window.addEventListener("click", (e) => {
    if (e.target == modal) modal.style.display = "none";
  });

  formAlerta.addEventListener("submit", (e) => {
    e.preventDefault();
    const titulo = document.getElementById("titulo").value.trim();
    const lugar = document.getElementById("lugar").value.trim();
    const fecha = document.getElementById("fecha").value.trim();
    const hora = document.getElementById("hora").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();

    if (!titulo || !lugar || !fecha || !hora || !descripcion) {
      mensajeForm.textContent = "Por favor, rellena todos los campos.";
      mensajeForm.style.color = "red";
    } else {
      alertas.push({ titulo, lugar, fecha, hora, descripcion });
      renderAlertas();
      mensajeForm.textContent = "¡Alerta guardada correctamente!";
      mensajeForm.style.color = "green";
      formAlerta.reset();
      setTimeout(() => (modal.style.display = "none"), 1000);
    }
  });

  // Botón volver
  document
    .getElementById("btnAtras")
    .addEventListener("click", () => window.history.back());

  // Footer dinámico
  if (nombreActivo) {
    const footerUserSection = document.getElementById("footer-user-section");
    footerUserSection.innerHTML = `
            <h4 class="active">Perfil de ${nombreActivo}</h4>
            <ul>
              <li><a href="Perfil.html">Ver Perfil</a></li>
              <li><a href="#" id="cerrarSesionFooter">Cerrar Sesión</a></li>
            </ul>
          `;
    document
      .getElementById("cerrarSesionFooter")
      .addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("usuarioActivo");
        window.location.href = "index.html";
      });
  }
});

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




