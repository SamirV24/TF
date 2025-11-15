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
  const closeNotifPersonalizadas = document.getElementById("closeNotifPersonalizaciones");
  const btnConfirmarNotif = document.getElementById("btnConfirmarNotif");
  const selectDistritoNotif = document.getElementById("selectDistritoNotif");
  const modalConfirmacionNotif = document.getElementById("modalConfirmacionNotif");
  const closeConfirmacionNotif = document.getElementById("closeConfirmacionNotif");
  const btnConfirmarSi = document.getElementById("btnConfirmarSi");
  const btnConfirmarNo = document.getElementById("btnConfirmarNo");

  btnNotifPersonalizadas?.addEventListener("click", () => {
    modalNotifPersonalizadas.style.display = "flex";
  });

  closeNotifPersonalizadas?.addEventListener("click", () => {
    modalNotifPersonalizadas.style.display = "none";
  });

  btnConfirmarNotif?.addEventListener("click", () => {
    if (!selectDistritoNotif.value) {
      alert("Por favor selecciona un distrito.");
      return;
    }
    modalConfirmacionNotif.style.display = "flex";
  });

  closeConfirmacionNotif?.addEventListener("click", () => {
    modalConfirmacionNotif.style.display = "none";
  });

  btnConfirmarSi?.addEventListener("click", () => {
    const distrito = selectDistritoNotif.value;
    alert(`✔ Notificaciones activadas.\nRecibirás alertas por SMS cuando se detecte agua no segura en ${distrito}.`);
    modalNotifPersonalizadas.style.display = "none";
    modalConfirmacionNotif.style.display = "none";
  });

  btnConfirmarNo?.addEventListener("click", () => {
    modalConfirmacionNotif.style.display = "none";
  });

  // ====================================
  // FILTRO DE DISTRITOS
  // ====================================
  const filtroDistrito = document.getElementById("filtroDistrito");
  const listaAlertas = document.getElementById("alertasList");

  filtroDistrito?.addEventListener("change", filtrarAlertas);

  function filtrarAlertas() {
    const distritoSeleccionado = filtroDistrito.value;
    const tarjetas = document.querySelectorAll(".alerta-card");
    tarjetas.forEach(card => {
      const lugar = card.querySelector(".alerta-lugar").textContent.trim();
      card.style.display = distritoSeleccionado === "todos" || lugar === distritoSeleccionado ? "flex" : "none";
    });
  }

  // ====================================
  // RECOMENDACIÓN DEL DÍA
  // ====================================
  const modalRecomendacion = document.getElementById("modalRecomendacion");
  const btnRecomendacion = document.getElementById("btnRecomendacion");
  const closeRecomendacion = document.getElementById("closeRecomendacion");

  btnRecomendacion?.addEventListener("click", () => {
    document.getElementById("textoRecomendacion").textContent =
      "Hierve el agua durante al menos 1 minuto para eliminar microorganismos. Almacénala en envases limpios y tapados.";
    modalRecomendacion.style.display = "flex";
  });

  closeRecomendacion?.addEventListener("click", () => {
    modalRecomendacion.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modalRecomendacion) modalRecomendacion.style.display = "none";
  });

  // ====================================
  // NOTIFICACIONES PRINCIPALES
  // ====================================
  const modalNot = document.getElementById("modalNotificaciones");
  const btnNot = document.getElementById("btnNotificaciones");
  const closeNot = document.getElementById("closeNotificaciones");
  const btnSiNot = document.getElementById("btnSiNotificaciones");
  const btnNoNot = document.getElementById("btnNoNotificaciones");

  btnNot?.addEventListener("click", () => modalNot.style.display = "flex");
  closeNot?.addEventListener("click", () => modalNot.style.display = "none");
  btnSiNot?.addEventListener("click", () => { alert("Has elegido recibir notificaciones."); modalNot.style.display = "none"; });
  btnNoNot?.addEventListener("click", () => { alert("Has elegido no recibir notificaciones."); modalNot.style.display = "none"; });

  // ====================================
  // USUARIO LOGUEADO
  // ====================================
  const nombreActivo = localStorage.getItem("usuarioActivo");
  const authButtons = document.getElementById("auth-buttons");
  const profileButton = document.getElementById("profile-button");

  if (nombreActivo) {
    authButtons && (authButtons.style.display = "none");
    profileButton && (profileButton.style.display = "block");
    document.getElementById("btnPerfil").textContent = nombreActivo;

    const profileMenu = document.getElementById("profile-menu");
    document.getElementById("btnPerfil").addEventListener("click", () => {
      profileMenu.classList.toggle("show");
    });

    document.getElementById("cerrarSesion")?.addEventListener("click", () => {
      localStorage.removeItem("usuarioActivo");
      window.location.href = "index.html";
    });
  }

  // ====================================
  // ALERTAS (con estados e imágenes)
  // ====================================
  let alertas = [
    { titulo: "Niveles bajos de cloro residual", lugar: "San Juan de Lurigancho", fecha: "05/10/2025", hora: "07:45 a.m.", descripcion: "Se detectó un nivel de cloro inferior al recomendado.", estado: "En proceso", imagen: null },
    { titulo: "Corte programado de servicio", lugar: "Villa El Salvador", fecha: "05/10/2025", hora: "10:00 a.m. - 8:00 p.m.", descripcion: "Corte por mantenimiento.", estado: "Terminado", imagen: null },
    { titulo: "Presencia de turbidez visible", lugar: "Comas", fecha: "06/10/2025", hora: "04:30 p.m.", descripcion: "Evita consumir directamente.", estado: "Solucionado", imagen: null },
  ];

  function renderAlertas() {
    listaAlertas.innerHTML = "";
    alertas.forEach(a => {
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
            ${a.imagen ? `<img src="${a.imagen}" alt="Imagen Alerta" class="alerta-img" />` : ""}
            <p><b>Estado:</b> <span class="estado ${a.estado.replace(" ", "-").toLowerCase()}">${a.estado}</span></p>
          </div>
        </div>
        <i class="fa-solid fa-arrow-right"></i>
      `;
      div.addEventListener("click", () => {
        alert(`Detalles de la alerta:\n\nTítulo: ${a.titulo}\nLugar: ${a.lugar}\nFecha: ${a.fecha}\nHora: ${a.hora}\nEstado: ${a.estado}\n\nDescripción: ${a.descripcion}`);
      });
      listaAlertas.appendChild(div);
    });
  }
  renderAlertas();

  // ====================================
  // AGREGAR NUEVA ALERTA + IMAGEN
  // ====================================
  const modal = document.getElementById("modalAlerta");
  const btnAdd = document.getElementById("btnAddAlerta");
  const spanClose = document.querySelector(".modal .close");
  const formAlerta = document.getElementById("formAlerta");
  const mensajeForm = document.getElementById("mensajeForm");
  const inputImagen = document.getElementById("imagenAlerta");
  const previewImagen = document.getElementById("previewImagen");

  btnAdd?.addEventListener("click", () => { modal.style.display = "flex"; mensajeForm.textContent = ""; });

  spanClose?.addEventListener("click", () => { modal.style.display = "none"; previewImagen.style.display = "none"; });

  window.addEventListener("click", (e) => { if (e.target == modal) { modal.style.display = "none"; previewImagen.style.display = "none"; } });

  // Mostrar vista previa de la imagen
  inputImagen?.addEventListener("change", () => {
    const file = inputImagen.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        previewImagen.src = reader.result;
        previewImagen.style.display = "block";
      };
      reader.readAsDataURL(file);
    } else {
      previewImagen.style.display = "none";
    }
  });

  formAlerta?.addEventListener("submit", (e) => {
    e.preventDefault();
    const titulo = document.getElementById("titulo").value.trim();
    const lugar = document.getElementById("lugar").value.trim();
    const fecha = document.getElementById("fecha").value.trim();
    const hora = document.getElementById("hora").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const imagen = inputImagen.files[0] ? URL.createObjectURL(inputImagen.files[0]) : null;

    if (!titulo || !lugar || !fecha || !hora || !descripcion) {
      mensajeForm.textContent = "Por favor, rellena todos los campos.";
      mensajeForm.style.color = "red";
      return;
    }

    alertas.push({ titulo, lugar, fecha, hora, descripcion, estado: "En proceso", imagen });
    renderAlertas();
    mensajeForm.textContent = "¡Alerta guardada correctamente!";
    mensajeForm.style.color = "green";
    formAlerta.reset();
    previewImagen.style.display = "none";

    setTimeout(() => { modal.style.display = "none"; }, 1000);
  });

  // ====================================
  // PREFERENCIAS
  // ====================================
  const btnConfigPreferencias = document.getElementById("btnConfigPreferencias");
  const modalPreferencias = document.getElementById("modalPreferencias");
  const closePreferencias = document.getElementById("closePreferencias");
  const selectTipoAlerta = document.getElementById("selectTipoAlerta");
  const selectFrecuencia = document.getElementById("selectFrecuencia");
  const modalConfirmPreferencias = document.getElementById("modalConfirmPreferencias");
  const btnGuardarPreferencias = document.getElementById("btnGuardarPreferencias");
  const btnPrefSi = document.getElementById("btnPrefSi");
  const btnPrefNo = document.getElementById("btnPrefNo");

  btnConfigPreferencias?.addEventListener("click", () => { modalPreferencias.style.display = "flex"; });
  closePreferencias?.addEventListener("click", () => { modalPreferencias.style.display = "none"; });
  btnGuardarPreferencias?.addEventListener("click", () => { modalConfirmPreferencias.style.display = "flex"; });
  btnPrefSi?.addEventListener("click", () => {
    localStorage.setItem("preferenciasAlertas", JSON.stringify({ tipo: selectTipoAlerta.value, frecuencia: selectFrecuencia.value }));
    alert(`✔ Preferencias guardadas.\nTipo: ${selectTipoAlerta.value}\nFrecuencia: ${selectFrecuencia.value}`);
    modalPreferencias.style.display = "none";
    modalConfirmPreferencias.style.display = "none";
  });
  btnPrefNo?.addEventListener("click", () => { modalConfirmPreferencias.style.display = "none"; });

});



