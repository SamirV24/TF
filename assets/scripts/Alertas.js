//  MENÚ HAMBURGUESA
const hamburger = document.getElementById("hamburger");
const nav = document.querySelector(".nav");
const registrarBtn = document.querySelector(".btn-registrarse");
const iniciarSesionBtn = document.querySelector(".btn-iniciarSesion");

hamburger.addEventListener("click", () => {
  nav.classList.toggle("nav-active");
  registrarBtn.classList.toggle("nav-active");
  iniciarSesionBtn.classList.toggle("nav-active");

  hamburger.classList.toggle("open");
  if (hamburger.classList.contains("open")) {
    hamburger.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  } else {
    hamburger.innerHTML = '<i class="fa-solid fa-bars"></i>';
  }
});

// ====================================
// ESPERAR A QUE HTML CARGUE
// ====================================
document.addEventListener("DOMContentLoaded", () => {

  // ====================================
  // NOTIFICACIONES PERSONALIZADAS
  // ====================================

  const btnNotifPersonalizadas = document.getElementById("btnNotifPersonalizadas");
  const modalNotifPersonalizadas = document.getElementById("modalNotifPersonalizadas");
  const closeNotifPersonalizadas = document.getElementById("closeNotifPersonalizadas");

  const btnConfirmarNotif = document.getElementById("btnConfirmarNotif");
  const selectDistritoNotif = document.getElementById("selectDistritoNotif");

  const modalConfirmacionNotif = document.getElementById("modalConfirmacionNotif");
  const closeConfirmacionNotif = document.getElementById("closeConfirmacionNotif");
  const btnConfirmarSi = document.getElementById("btnConfirmarSi");
  const btnConfirmarNo = document.getElementById("btnConfirmarNo");

  if (btnNotifPersonalizadas) {
    btnNotifPersonalizadas.Listener("click", () => {
      modalNotifPersonalizadas.style.display = "flex";
    });
  }

  if (closeNotifPersonalizadas) {
    closeNotifPersonalizadas.addEventListener("click", () => {
      modalNotifPersonalizadas.style.display = "none";
    });
  }

  if (btnConfirmarNotif) {
    btnConfirmarNotif.addEventListener("click", () => {
      if (!selectDistritoNotif.value) {
        alert("Por favor selecciona un distrito.");
        return;
      }
      modalConfirmacionNotif.style.display = "flex";
    });
  }

  if (closeConfirmacionNotif) {
    closeConfirmacionNotif.addEventListener("click", () => {
      modalConfirmacionNotif.style.display = "none";
    });
  }

  if (btnConfirmarSi) {
    btnConfirmarSi.addEventListener("click", () => {
      const distrito = selectDistritoNotif.value;

      alert(`✔ Notificaciones activadas.\nRecibirás alertas por SMS cuando se detecte agua no segura en ${distrito}.`);

      modalNotifPersonalizadas.style.display = "none";
      modalConfirmacionNotif.style.display = "none";
    });
  }

  if (btnConfirmarNo) {
    btnConfirmarNo.addEventListener("click", () => {
      modalConfirmacionNotif.style.display = "none";
    });
  }

  // ====================================
  // FILTRO DE DISTRITOS
  // ====================================

  const filtroDistrito = document.getElementById("filtroDistrito");
  const listaAlertas = document.getElementById("alertasList");

  if (filtroDistrito) {
    filtroDistrito.addEventListener("change", () => {
      filtrarAlertas();
    });
  }

  function filtrarAlertas() {
    const distritoSeleccionado = filtroDistrito.value;
    const tarjetas = document.querySelectorAll(".alerta-card");

    tarjetas.forEach(card => {
      const lugar = card.querySelector(".alerta-lugar").textContent.trim();

      if (distritoSeleccionado === "todos") {
        card.style.display = "flex";
      } else if (lugar === distritoSeleccionado) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    });
  }

  // ====================================
  // RECOMENDACIÓN DEL DÍA
  // ====================================

  const modalRecomendacion = document.getElementById("modalRecomendacion");
  const btnRecomendacion = document.getElementById("btnRecomendacion");
  const closeRecomendacion = document.getElementById("closeRecomendacion");

  if (btnRecomendacion) {
    btnRecomendacion.addEventListener("click", () => {
      document.getElementById("textoRecomendacion").textContent =
        "Hierve el agua durante al menos 1 minuto para eliminar microorganismos. Almacénala en envases limpios y tapados.";

      modalRecomendacion.style.display = "flex";
    });
  }

  if (closeRecomendacion) {
    closeRecomendacion.addEventListener("click", () => {
      modalRecomendacion.style.display = "none";
    });
  }

  window.addEventListener("click", (e) => {
    if (e.target === modalRecomendacion) {
      modalRecomendacion.style.display = "none";
    }
  });


  // ====================================
  // NOTIFICACIONES PRINCIPALES
  // ====================================

  const modalNot = document.getElementById("modalNotificaciones");
  const btnNot = document.getElementById("btnNotificaciones");
  const closeNot = document.getElementById("closeNotificaciones");
  const btnSiNot = document.getElementById("btnSiNotificaciones");
  const btnNoNot = document.getElementById("btnNoNotificaciones");

  if (btnNot) {
    btnNot.addEventListener("click", () => {
      modalNot.style.display = "flex";
    });
  }

  if (closeNot) {
    closeNot.addEventListener("click", () => {
      modalNot.style.display = "none";
    });
  }

  if (btnSiNot) {
    btnSiNot.addEventListener("click", () => {
      alert("Has elegido recibir notificaciones.");
      modalNot.style.display = "none";
    });
  }

  if (btnNoNot) {
    btnNoNot.addEventListener("click", () => {
      alert("Has elegido no recibir notificaciones.");
      modalNot.style.display = "none";
    });
  }


  // ====================================
  // USUARIO LOGUEADO
  // ====================================

  const nombreActivo = localStorage.getItem("usuarioActivo");
  const authButtons = document.getElementById("auth-buttons");
  const profileButton = document.getElementById("profile-button");

  if (nombreActivo) {
    if (authButtons) authButtons.style.display = "none";
    if (profileButton) profileButton.style.display = "block";
    document.getElementById("btnPerfil").textContent = nombreActivo;

    const profileMenu = document.getElementById("profile-menu");
    document.getElementById("btnPerfil").addEventListener("click", () => {
      profileMenu.classList.toggle("show");
    });

    const logout = document.getElementById("cerrarSesion");
    if (logout) {
      logout.addEventListener("click", () => {
        localStorage.removeItem("usuarioActivo");
        window.location.href = "index.html";
      });
    }
  }

  // ====================================
  // ALERTAS (con estados)
  // ====================================

  let alertas = [
    {
      titulo: "Niveles bajos de cloro residual",
      lugar: "San Juan de Lurigancho",
      fecha: "05/10/2025",
      hora: "07:45 a.m.",
      descripcion: "Se detectó un nivel de cloro inferior al recomendado.",
      estado: "En proceso"
    },
    {
      titulo: "Corte programado de servicio",
      lugar: "Villa El Salvador",
      fecha: "05/10/2025",
      hora: "10:00 a.m. - 8:00 p.m.",
      descripcion: "Corte por mantenimiento.",
      estado: "Terminado"
    },
    {
      titulo: "Presencia de turbidez visible",
      lugar: "Comas",
      fecha: "06/10/2025",
      hora: "04:30 p.m.",
      descripcion: "Evita consumir directamente.",
      estado: "Solucionado"
    },
  ];

  const alertasList = document.getElementById("alertasList");

  function renderAlertas() {
    alertasList.innerHTML = "";
    alertas.forEach((a) => {

      if (!a.estado) a.estado = "En proceso";

      const div = document.createElement("div");
      div.className = "alerta-card";

      div.innerHTML = `
        <div class="alerta-info">
          <i class="fa-regular fa-bell"></i>
          <div class="alerta-text">
            <p><b>Alerta:</b> ${a.titulo}</p>
            <p><b>Lugar:</b> <span class="alerta-lugar">${a.lugar}</span></p>
            <p><b>Fecha:</b> ${a.fecha}</p>
            <p><b>Hora:</b> ${a.hora}</p>

            <p><b>Estado:</b> 
              <span class="estado ${a.estado.replace(" ", "-").toLowerCase()}">
                ${a.estado}
              </span>
            </p>
          </div>
        </div>
        <i class="fa-solid fa-arrow-right"></i>
      `;

      div.addEventListener("click", () => {
  let mensaje =
    `Detalles de la alerta:\n\n` +
    `Título: ${a.titulo}\n` +
    `Lugar: ${a.lugar}\n` +
    `Fecha: ${a.fecha}\n` +
    `Hora: ${a.hora}\n` +
    `Estado: ${a.estado}\n\n` +
    `Descripción: ${a.descripcion}`;

  if (a.evidencia) {
    const nuevaVentana = window.open("", "_blank");
    nuevaVentana.document.write(`
      <h2>${a.titulo}</h2>
      <p><b>Lugar:</b> ${a.lugar}</p>
      <p><b>Fecha:</b> ${a.fecha}</p>
      <p><b>Hora:</b> ${a.hora}</p>
      <p><b>Estado:</b> ${a.estado}</p>
      <p><b>Descripción:</b> ${a.descripcion}</p>
      <h3>Evidencia:</h3>
      <img src="${a.evidencia}" style="width:100%;max-width:400px;border-radius:10px;">
    `);
  } else {
    alert(mensaje);
  }
});



      alertasList.appendChild(div);
    });
  }

  renderAlertas();

  // AGREGAR NUEVA ALERTA
const modal = document.getElementById("modalAlerta");
const btnAdd = document.getElementById("btnAddAlerta");
const spanClose = document.querySelector(".modal .close");
const formAlerta = document.getElementById("formAlerta");
const mensajeForm = document.getElementById("mensajeForm");
const inputImagen = document.getElementById("imagen");

btnAdd.addEventListener("click", () => {
  modal.style.display = "flex";
  mensajeForm.textContent = "";
});

spanClose.addEventListener("click", () => {
  modal.style.display = "none";
});

// Cerrar al hacer clic afuera
window.addEventListener("click", (e) => {
  if (e.target == modal) modal.style.display = "none";
});

// Convertir imagen a Base64
function convertirBase64(file) {
  return new Promise((resolve) => {
    const lector = new FileReader();
    lector.onloadend = () => resolve(lector.result);
    lector.readAsDataURL(file);
  });
}

formAlerta.addEventListener("submit", async (e) => {
  e.preventDefault();

  const titulo = document.getElementById("titulo").value.trim();
  const lugar = document.getElementById("lugar").value.trim();
  const fecha = document.getElementById("fecha").value.trim();
  const hora = document.getElementById("hora").value.trim();
  const descripcion = document.getElementById("descripcion").value.trim();

  let evidencia = null;

  if (!titulo || !lugar || !fecha || !hora || !descripcion) {
    mensajeForm.textContent = "Por favor, rellena todos los campos.";
    mensajeForm.style.color = "red";
    return;
  }

  // Si el usuario subió una imagen, convertirla
  if (inputImagen.files.length > 0) {
    evidencia = await convertirBase64(inputImagen.files[0]);
  }

  alertas.push({
    titulo,
    lugar,
    fecha,
    hora,
    descripcion,
    evidencia,
    estado: "En proceso"
  });

  renderAlertas();

  mensajeForm.textContent = "¡Alerta guardada correctamente!";
  mensajeForm.style.color = "green";
  formAlerta.reset();

  setTimeout(() => (modal.style.display = "none"), 1000);
});

  // ====================================
  // PREFERENCIAS (LO QUE NO TE FUNCIONABA)
  // ====================================

  const btnConfigPreferencias = document.getElementById("btnConfigPreferencias");
  const modalPreferencias = document.getElementById("modalPreferencias");
  const closePreferencias = document.getElementById("closePreferencias");

  const selectTipoAlerta = document.getElementById("selectTipoAlerta");
  const selectFrecuencia = document.getElementById("selectFrecuencia");

  const modalConfirmPreferencias = document.getElementById("modalConfirmPreferencias");
  const closeConfirmPreferencias = document.getElementById("closeConfirmPreferencias");

  const btnGuardarPreferencias = document.getElementById("btnGuardarPreferencias");
  const btnPrefSi = document.getElementById("btnPrefSi");
  const btnPrefNo = document.getElementById("btnPrefNo");

  // abrir preferencias
  if (btnConfigPreferencias) {
    btnConfigPreferencias.addEventListener("click", () => {
      modalPreferencias.style.display = "flex";
    });
  }

  // cerrar
  if (closePreferencias) {
    closePreferencias.addEventListener("click", () => {
      modalPreferencias.style.display = "none";
    });
  }

  // guardar → mostrar confirmación
  if (btnGuardarPreferencias) {
    btnGuardarPreferencias.addEventListener("click", () => {
      modalConfirmPreferencias.style.display = "flex";
    });
  }

  // cerrar confirmación
  if (closeConfirmPreferencias) {
    closeConfirmPreferencias.addEventListener("click", () => {
      modalConfirmPreferencias.style.display = "none";
    });
  }

  // SI guardo
  if (btnPrefSi) {
    btnPrefSi.addEventListener("click", () => {

      const tipo = selectTipoAlerta.value;
      const frecuencia = selectFrecuencia.value;

      localStorage.setItem(
        "preferenciasAlertas",
        JSON.stringify({ tipo, frecuencia })
      );

      alert(`✔ Preferencias guardadas.\nTipo: ${tipo}\nFrecuencia: ${frecuencia}`);

      modalPreferencias.style.display = "none";
      modalConfirmPreferencias.style.display = "none";
    });
  }

  // NO cancelar
  if (btnPrefNo) {
    btnPrefNo.addEventListener("click", () => {
      modalConfirmPreferencias.style.display = "none";
    });
  }

});














