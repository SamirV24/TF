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
  // ENCUESTAS (VERSIÓN SIMPLE)
  // ====================================
  const btnEncuestas = document.getElementById("btnEncuestas");

  btnEncuestas?.addEventListener("click", () => {
    const respuesta = confirm(
      "¿Deseas recibir encuestas sobre la calidad del agua y el servicio?"
    );

    if (respuesta) {
      localStorage.setItem("recibirEncuestas", "si");
      alert("✔ Gracias. Te enviaremos encuestas breves.");
    } else {
      localStorage.setItem("recibirEncuestas", "no");
      alert("No recibirás encuestas por ahora.");
    }
  });

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
    tarjetas.forEach((card) => {
      const lugar = card.querySelector(".alerta-lugar").textContent.trim();
      card.style.display =
        distritoSeleccionado === "todos" || lugar === distritoSeleccionado
          ? "flex"
          : "none";
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
    if (e.target === modalRecomendacion)
      modalRecomendacion.style.display = "none";
  });

  // ====================================
  // NOTIFICACIONES PRINCIPALES
  // ====================================
  const modalNot = document.getElementById("modalNotificaciones");
  const btnNot = document.getElementById("btnNotificaciones");
  const closeNot = document.getElementById("closeNotificaciones");
  const btnSiNot = document.getElementById("btnSiNotificaciones");
  const btnNoNot = document.getElementById("btnNoNotificaciones");

  btnNot?.addEventListener("click", () => (modalNot.style.display = "flex"));
  closeNot?.addEventListener("click", () => (modalNot.style.display = "none"));
  btnSiNot?.addEventListener("click", () => {
    alert("Has elegido recibir notificaciones.");
    modalNot.style.display = "none";
  });
  btnNoNot?.addEventListener("click", () => {
    alert("Has elegido no recibir notificaciones.");
    modalNot.style.display = "none";
  });

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

    const footerUserSection = document.getElementById("footer-user-section");
    if (footerUserSection) {
      footerUserSection.innerHTML = `
        <h4 class="active">Perfil de ${nombreActivo}</h4>
        <ul>
          <li><a href="Perfil.html">Ver Perfil</a></li>
          <li><a href="#" id="cerrarSesionFooter">Cerrar Sesión</a></li>
        </ul>
      `;
      document.getElementById("cerrarSesionFooter")?.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("usuarioActivo");
        window.location.href = "index.html";
      });
    }
  }

  // ====================================
  // ALERTAS + IMAGEN
  // ====================================
  let alertas = [
    {
      titulo: "Niveles bajos de cloro residual",
      lugar: "San Juan de Lurigancho",
      fecha: "05/10/2025",
      hora: "07:45 a.m.",
      descripcion: "Se detectó un nivel de cloro inferior al recomendado.",
      estado: "En proceso",
      imagen: null,
    },
    {
      titulo: "Corte programado de servicio",
      lugar: "Villa El Salvador",
      fecha: "05/10/2025",
      hora: "10:00 a.m. - 8:00 p.m.",
      descripcion: "Corte por mantenimiento.",
      estado: "Terminado",
      imagen: null,
    },
    {
      titulo: "Presencia de turbidez visible",
      lugar: "Comas",
      fecha: "06/10/2025",
      hora: "04:30 p.m.",
      descripcion: "Evita consumir directamente.",
      estado: "Solucionado",
      imagen: null,
    },
  ];

  function renderAlertas() {
    listaAlertas.innerHTML = "";
    alertas.forEach((a) => {
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
            ${a.imagen ? `<img src="${a.imagen}" class="alerta-img" />` : ""}
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
  // AGREGAR NUEVA ALERTA
  // ====================================
  const modal = document.getElementById("modalAlerta");
  const btnAdd = document.getElementById("btnAddAlerta");
  const spanClose = document.querySelector("#modalAlerta .close");
  const formAlerta = document.getElementById("formAlerta");
  const mensajeForm = document.getElementById("mensajeForm");
  const inputImagen = document.getElementById("imagenAlerta");
  const previewImagen = document.getElementById("previewImagen");

  btnAdd?.addEventListener("click", () => {
    modal.style.display = "flex";
    mensajeForm.textContent = "";
  });

  spanClose?.addEventListener("click", () => {
    modal.style.display = "none";
    previewImagen.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target == modal) {
      modal.style.display = "none";
      previewImagen.style.display = "none";
    }
  });

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
    const imagen = inputImagen.files[0]
      ? URL.createObjectURL(inputImagen.files[0])
      : null;

    if (!titulo || !lugar || !fecha || !hora || !descripcion) {
      mensajeForm.textContent = "Por favor, rellena todos los campos.";
      mensajeForm.style.color = "red";
      return;
    }

    alertas.push({
      titulo,
      lugar,
      fecha,
      hora,
      descripcion,
      estado: "En proceso",
      imagen,
    });

    renderAlertas();
    mensajeForm.textContent = "¡Alerta guardada correctamente!";
    mensajeForm.style.color = "green";

    formAlerta.reset();
    previewImagen.style.display = "none";

    setTimeout(() => {
      modal.style.display = "none";
    }, 1000);
  });

  // ====================================
  // COMUNICADOS DIGESA
  // ====================================
  const btnComunicados = document.getElementById("btnComunicados");
  const modalComunicados = document.getElementById("modalComunicados");
  const closeComunicados = document.getElementById("closeComunicados");

  const listaComunicados = document.getElementById("listaComunicados");
  const formComunicado = document.getElementById("formComunicado");
  const mensajeComunicado = document.getElementById("mensajeComunicado");

  const tituloFormComunicado = document.getElementById("tituloFormComunicado");

  const inputTituloCom = document.getElementById("tituloComunicado");
  const inputFechaCom = document.getElementById("fechaComunicado");
  const inputDescripcionCom = document.getElementById("descripcionComunicado");
  const inputEnlaceCom = document.getElementById("enlaceComunicado");

  let comunicados = JSON.parse(localStorage.getItem("comunicadosDigesa") || "[]");
  let indiceEditando = null;

  btnComunicados?.addEventListener("click", () => {
    renderComunicados();
    limpiarFormularioComunicado();
    tituloFormComunicado.textContent = "Nuevo comunicado";
    indiceEditando = null;
    mensajeComunicado.textContent = "";
    modalComunicados.style.display = "flex";
  });

  closeComunicados?.addEventListener("click", () => {
    modalComunicados.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modalComunicados) {
      modalComunicados.style.display = "none";
    }
  });

  function renderComunicados() {
    listaComunicados.innerHTML = "";

    if (comunicados.length === 0) {
      listaComunicados.innerHTML = "<p>No hay comunicados registrados.</p>";
      return;
    }

    comunicados.forEach((c, index) => {
      const card = document.createElement("div");
      card.className = "comunicado-card";

      const info = document.createElement("div");
      info.className = "comunicado-info";
      info.innerHTML = `
        <p><b>${c.titulo}</b></p>
        <p><b>Fecha:</b> ${c.fecha}</p>
        <p style="font-size: 13px;">${c.descripcion}</p>
        ${c.enlace ? `<p style="font-size: 13px;"><a href="${c.enlace}" target="_blank">Ver informe oficial</a></p>` : ""}
      `;

      const botones = document.createElement("div");
      botones.className = "comunicado-actions";

      const btnEditar = document.createElement("button");
      btnEditar.textContent = "Editar";
      btnEditar.className = "btn btn-add";
      btnEditar.addEventListener("click", () => cargarComunicadoEnFormulario(index));

      const btnEliminar = document.createElement("button");
      btnEliminar.textContent = "Eliminar";
      btnEliminar.className = "btn btn-add btn-eliminar-comunicado";
      btnEliminar.addEventListener("click", () => {
        if (confirm("¿Seguro que deseas eliminar este comunicado?")) {
          comunicados.splice(index, 1);
          guardarComunicados();
          renderComunicados();
        }
      });

      botones.appendChild(btnEditar);
      botones.appendChild(btnEliminar);

      card.appendChild(info);
      card.appendChild(botones);

      listaComunicados.appendChild(card);
    });
  }

  function guardarComunicados() {
    localStorage.setItem("comunicadosDigesa", JSON.stringify(comunicados));
  }

  function limpiarFormularioComunicado() {
    inputTituloCom.value = "";
    inputFechaCom.value = "";
    inputDescripcionCom.value = "";
    inputEnlaceCom.value = "";
  }

  function cargarComunicadoEnFormulario(index) {
    const c = comunicados[index];

    inputTituloCom.value = c.titulo;
    inputFechaCom.value = c.fecha;
    inputDescripcionCom.value = c.descripcion;
    inputEnlaceCom.value = c.enlace || "";

    indiceEditando = index;
    tituloFormComunicado.textContent = "Editar comunicado";
    mensajeComunicado.textContent = "";
  }

  formComunicado?.addEventListener("submit", (e) => {
    e.preventDefault();

    const titulo = inputTituloCom.value.trim();
    const fecha = inputFechaCom.value.trim();
    const descripcion = inputDescripcionCom.value.trim();
    const enlace = inputEnlaceCom.value.trim();

    if (!titulo || !fecha || !descripcion) {
      mensajeComunicado.textContent = "Por favor, completa título, fecha y descripción.";
      mensajeComunicado.style.color = "red";
      return;
    }

    const nuevo = { titulo, fecha, descripcion, enlace };

    if (indiceEditando !== null) {
      comunicados[indiceEditando] = nuevo;
      mensajeComunicado.textContent = "Comunicado actualizado correctamente.";
    } else {
      comunicados.push(nuevo);
      mensajeComunicado.textContent = "Comunicado guardado correctamente.";
    }

    mensajeComunicado.style.color = "green";

    guardarComunicados();
    renderComunicados();
    limpiarFormularioComunicado();
    indiceEditando = null;
    tituloFormComunicado.textContent = "Nuevo comunicado";
  });

  // ====================================
  // SEGURIDAD DEL AGUA
  // ====================================
  const btnSeguridadAgua = document.getElementById("btnSeguridadAgua");
  const modalSeguridadAgua = document.getElementById("modalSeguridadAgua");
  const closeSeguridadAgua = document.getElementById("closeSeguridadAgua");
  const selectDistritoSeguridad = document.getElementById("selectDistritoSeguridad");
  const btnEvaluarSeguridad = document.getElementById("btnEvaluarSeguridad");
  const resultadoSeguridad = document.getElementById("resultadoSeguridad");

  const seguridadPorDistrito = {
    "San Juan de Lurigancho": { segura: false, mensaje: "⚠ Incidencias recientes. Hervir antes de consumir." },
    "Comas": { segura: false, mensaje: "⚠ Agua no recomendable para consumo directo." },
    "San Martín de Porres": { segura: true, mensaje: "✅ Agua apta para consumo." },
    "Villa El Salvador": { segura: true, mensaje: "✅ Agua segura y estable." },
    "Los Olivos": { segura: true, mensaje: "✅ Agua apta, mantener limpieza en almacenamiento." },
    "Ate": { segura: false, mensaje: "⚠ Se registraron niveles bajos de cloro. Hervir 1 minuto." },
    "Rímac": { segura: true, mensaje: "✅ Agua dentro de los parámetros aceptables." },
    "Surco": { segura: true, mensaje: "✅ Agua segura para consumo." },
    "Breña": { segura: false, mensaje: "⚠ Recomendación: no consumir directamente del caño." },
    "Chorrillos": { segura: true, mensaje: "✅ Agua apta para consumo." }
  };

  btnSeguridadAgua?.addEventListener("click", () => {
    modalSeguridadAgua.style.display = "flex";
    selectDistritoSeguridad.value = "";
    resultadoSeguridad.textContent = "";
    resultadoSeguridad.style.color = "";
  });

  closeSeguridadAgua?.addEventListener("click", () => {
    modalSeguridadAgua.style.display = "none";
  });

  btnEvaluarSeguridad?.addEventListener("click", () => {
    const distrito = selectDistritoSeguridad.value;
    if (!distrito) {
      alert("Selecciona un distrito.");
      return;
    }
    const data = seguridadPorDistrito[distrito];
    resultadoSeguridad.textContent = data.mensaje;
    resultadoSeguridad.style.color = data.segura ? "green" : "red";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modalSeguridadAgua) {
      modalSeguridadAgua.style.display = "none";
    }
  });

  // ====================================
  // CONFIGURAR PREFERENCIAS
  // ====================================
  const btnConfigPreferencias = document.getElementById("btnConfigPreferencias");
  const modalPreferencias = document.getElementById("modalPreferencias");
  const closePreferencias = document.getElementById("closePreferencias");
  const selectTipoAlerta = document.getElementById("selectTipoAlerta");
  const selectFrecuencia = document.getElementById("selectFrecuencia");
  const btnGuardarPreferencias = document.getElementById("btnGuardarPreferencias");
  const modalConfirmPreferencias = document.getElementById("modalConfirmPreferencias");
  const btnPrefSi = document.getElementById("btnPrefSi");
  const btnPrefNo = document.getElementById("btnPrefNo");

  // Abrir modal de preferencias (cargando lo guardado si existe)
  btnConfigPreferencias?.addEventListener("click", () => {
    const prefs = JSON.parse(localStorage.getItem("preferenciasAlertas") || "{}");
    if (prefs.tipo) selectTipoAlerta.value = prefs.tipo;
    if (prefs.frecuencia) selectFrecuencia.value = prefs.frecuencia;
    modalPreferencias.style.display = "flex";
  });

  // Cerrar modal de preferencias
  closePreferencias?.addEventListener("click", () => {
    modalPreferencias.style.display = "none";
  });

  // Abrir confirmación de guardar
  btnGuardarPreferencias?.addEventListener("click", () => {
    modalConfirmPreferencias.style.display = "flex";
  });

  // Confirmar guardado
  btnPrefSi?.addEventListener("click", () => {
    const preferencias = {
      tipo: selectTipoAlerta.value,
      frecuencia: selectFrecuencia.value,
    };

    localStorage.setItem("preferenciasAlertas", JSON.stringify(preferencias));

    alert(
      `✔ Preferencias guardadas.\nTipo: ${preferencias.tipo}\nFrecuencia: ${preferencias.frecuencia}`
    );

    modalPreferencias.style.display = "none";
    modalConfirmPreferencias.style.display = "none";
  });

  // Cancelar guardado
  btnPrefNo?.addEventListener("click", () => {
    modalConfirmPreferencias.style.display = "none";
  });

  // Cerrar modales de preferencias al hacer clic fuera
  window.addEventListener("click", (e) => {
    if (e.target === modalPreferencias) {
      modalPreferencias.style.display = "none";
    }
    if (e.target === modalConfirmPreferencias) {
      modalConfirmPreferencias.style.display = "none";
    }
  });

    // ====================================
  // INSIGNIAS POR PARTICIPACIÓN
  // ====================================
  const btnReportarInfo = document.getElementById("btnReportarInfo");
  const insigniaUsuario = document.getElementById("insigniaUsuario");

  // Cargar puntos desde localStorage (o 0 si no hay)
  let puntosParticipacion = parseInt(
    localStorage.getItem("puntosParticipacionAquaAlert") || "0",
    10
  );

  function obtenerInsignia(puntos) {
    if (puntos >= 15) return "💎 Embajadora del Agua";
    if (puntos >= 10) return "🥇 Insignia Oro";
    if (puntos >= 5) return "🥈 Insignia Plata";
    if (puntos >= 1) return "🥉 Insignia Bronce";
    return "Sin insignia";
  }

  function actualizarInsignia() {
    if (!insigniaUsuario) return;
    insigniaUsuario.textContent = obtenerInsignia(puntosParticipacion);
  }

  // Mostrar insignia actual al cargar la página
  actualizarInsignia();

  // Cada vez que reporta/valida info, sumamos 1 punto
  btnReportarInfo?.addEventListener("click", () => {
    puntosParticipacion += 1;
    localStorage.setItem(
      "puntosParticipacionAquaAlert",
      puntosParticipacion.toString()
    );

    const insigniaAntes = insigniaUsuario.textContent;
    actualizarInsignia();
    const insigniaDespues = insigniaUsuario.textContent;

    if (insigniaAntes !== insigniaDespues) {
      alert(
        `🎉 ¡Felicitaciones! Has alcanzado una nueva insignia: ${insigniaDespues}`
      );
    } else {
      alert(
        "✅ Gracias por reportar o validar información. ¡Tu participación nos ayuda a mejorar!"
      );
    }
  });
  });



