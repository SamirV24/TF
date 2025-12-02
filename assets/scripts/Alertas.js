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
  // ACTUALIZAR ESTADO DE INCIDENCIA
  // ====================================
  const modalEstado = document.getElementById("modalEstado");
  const closeEstado = document.getElementById("closeEstado");
  const tituloEstadoIncidencia = document.getElementById("tituloEstadoIncidencia");
  const selectEstadoIncidencia = document.getElementById("selectEstadoIncidencia");
  const inputResponsable = document.getElementById("inputResponsable");
  const btnGuardarEstado = document.getElementById("btnGuardarEstado");

  let indiceEstadoSeleccionado = null;

  // Abrir modal desde botón "Actualizar estado"
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-estado")) {
      e.stopPropagation();
      indiceEstadoSeleccionado = e.target.dataset.index;
      const a = alertas[indiceEstadoSeleccionado];

      tituloEstadoIncidencia.textContent = `Alerta: ${a.titulo} - ${a.lugar}`;
      selectEstadoIncidencia.value = a.estado;
      inputResponsable.value =
        a.responsable && a.responsable !== "No asignado" ? a.responsable : "";

      modalEstado.style.display = "flex";
    }
  });

  // Cerrar modal
  closeEstado?.addEventListener("click", () => {
    modalEstado.style.display = "none";
  });

  // Cerrar clic fuera
  window.addEventListener("click", (e) => {
    if (e.target === modalEstado) {
      modalEstado.style.display = "none";
    }
  });

  // Guardar cambios
  btnGuardarEstado?.addEventListener("click", () => {
    if (indiceEstadoSeleccionado === null) return;

    const nuevoEstado = selectEstadoIncidencia.value;
    const nuevoResponsable = inputResponsable.value.trim() || "No asignado";

    alertas[indiceEstadoSeleccionado].estado = nuevoEstado;
    alertas[indiceEstadoSeleccionado].responsable = nuevoResponsable;
    alertas[indiceEstadoSeleccionado].fechaActualizacion =
      new Date().toLocaleString("es-PE");

    renderAlertas();
    modalEstado.style.display = "none";

    alert("✅ Estado de la incidencia actualizado correctamente.");
  });

  // ==========================================================
  // COMPARTIR ALERTA ENTRE ENTIDADES
  // ==========================================================
  const modalCompartir = document.getElementById("modalCompartir");
  const closeCompartir = document.getElementById("closeCompartir");
  const entidadCompartir = document.getElementById("entidadCompartir");
  const mensajeCompartir = document.getElementById("mensajeCompartir");
  const btnCopiarCompartir = document.getElementById("btnCopiarCompartir");

  let alertaParaCompartir = null;

  // Abrir modal desde cada botón
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-compartir")) {
      e.stopPropagation();
      alertaParaCompartir = alertas[e.target.dataset.index];
      modalCompartir.style.display = "flex";
      entidadCompartir.value = "";
      mensajeCompartir.value = "";
    }
  });

  // Cerrar modal
  closeCompartir?.addEventListener("click", () => {
    modalCompartir.style.display = "none";
  });

  // Generar mensaje al seleccionar entidad
  entidadCompartir?.addEventListener("change", () => {
    if (!entidadCompartir.value || !alertaParaCompartir) return;

    const a = alertaParaCompartir;

    const mensaje = `
Entidad destino: ${entidadCompartir.value}
Fecha de envío: ${new Date().toLocaleString()}

Se comparte la siguiente alerta reportada en AquaAlert:

- Título: ${a.titulo}
- Distrito: ${a.lugar}
- Fecha y hora: ${a.fecha} ${a.hora}
- Estado: ${a.estado}
- Cloro: ${a.cloro} mg/L
- Bacterias: ${a.bacterias} NMP/100ml

Comentario técnico:
${a.comentarioTecnico || "Sin comentarios técnicos registrados."}

Resultado técnico: ${a.resultadoTecnico}

Solicitamos coordinación para la evaluación y respuesta inmediata.
  `.trim();

    mensajeCompartir.value = mensaje;
  });

  // Copiar mensaje
  btnCopiarCompartir?.addEventListener("click", () => {
    mensajeCompartir.select();
    document.execCommand("copy");
    alert("📋 Mensaje copiado y listo para enviar.");
  });

  // Cerrar modal clic fuera
  window.addEventListener("click", (e) => {
    if (e.target === modalCompartir) {
      modalCompartir.style.display = "none";
    }
  });

  // ====================================
  // INFORME MENSUAL
  // ====================================
  const btnGenerarInforme = document.getElementById("btnGenerarInforme");
  const modalInforme = document.getElementById("modalInforme");
  const closeInforme = document.getElementById("closeInforme");
  const graficoCanvas = document.getElementById("graficoDistritos");
  const estadisticasDistritos = document.getElementById("estadisticasDistritos");
  let grafico;

  // Abrir modal
  btnGenerarInforme?.addEventListener("click", () => {
    modalInforme.style.display = "flex";
    generarInformeMensual();
  });

  // Cerrar modal
  closeInforme?.addEventListener("click", () => {
    modalInforme.style.display = "none";
  });

  function generarInformeMensual() {
    // agrupar alertas por distrito
    const resumen = {};

    alertas.forEach((a) => {
      if (!resumen[a.lugar]) {
        resumen[a.lugar] = {
          cantidad: 0,
          cloroTotal: 0,
          bacteriasTotal: 0,
        };
      }

      resumen[a.lugar].cantidad++;
      resumen[a.lugar].cloroTotal += a.cloro;
      resumen[a.lugar].bacteriasTotal += a.bacterias;
    });

    const labels = Object.keys(resumen);
    const datosCloro = labels.map((d) =>
      (resumen[d].cloroTotal / resumen[d].cantidad).toFixed(2)
    );
    const datosBacterias = labels.map((d) =>
      (resumen[d].bacteriasTotal / resumen[d].cantidad).toFixed(2)
    );

    // Si ya existe gráfico, destruirlo antes de crear otro
    if (grafico) grafico.destroy();

    grafico = new Chart(graficoCanvas, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Promedio de cloro (mg/L)",
            data: datosCloro,
            backgroundColor: "rgba(54, 162, 235, 0.7)",
          },
          {
            label: "Promedio de bacterias (NMP/100ml)",
            data: datosBacterias,
            backgroundColor: "rgba(255, 99, 132, 0.7)",
          },
        ],
      },
    });

    // Generar estadísticas detalladas
    estadisticasDistritos.innerHTML = labels
      .map(
        (d, i) => `
      <p><b>${d}</b> — ${resumen[d].cantidad} alertas  
        | Cloro promedio: ${datosCloro[i]} mg/L  
        | Bacterias promedio: ${datosBacterias[i]} NMP/100ml
      </p>
    `
      )
      .join("");
  }

  const btnExportarPDF = document.getElementById("btnExportarPDF");

  btnExportarPDF?.addEventListener("click", async () => {
    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF();

    pdf.setFontSize(18);
    pdf.text("Informe Mensual de Calidad del Agua", 10, 15);

    // Imagen del gráfico
    const imgData = graficoCanvas.toDataURL("image/png");
    pdf.addImage(imgData, "PNG", 10, 25, 180, 80);

    pdf.setFontSize(14);
    pdf.text("Resumen por distrito:", 10, 120);

    let y = 130;
    const texto = estadisticasDistritos.innerText.split("\n");

    texto.forEach((linea) => {
      pdf.text(linea, 10, y);
      y += 8;
    });

    pdf.save("informe-mensual-aquaalert.pdf");
  });

  // ====================================
  // NOTIFICACIONES PERSONALIZADAS
  // ====================================
  const btnNotifPersonalizadas = document.getElementById(
    "btnNotifPersonalizadas"
  );
  const modalNotifPersonalizadas = document.getElementById(
    "modalNotifPersonalizadas"
  );
  const closeNotifPersonalizadas = document.getElementById(
    "closeNotifPersonalizaciones"
  );
  const btnConfirmarNotif = document.getElementById("btnConfirmarNotif");
  const selectDistritoNotif = document.getElementById("selectDistritoNotif");
  const modalConfirmacionNotif = document.getElementById(
    "modalConfirmacionNotif"
  );
  const closeConfirmacionNotif = document.getElementById(
    "closeConfirmacionNotif"
  );
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
    alert(
      `✔ Notificaciones activadas.\nRecibirás alertas por SMS cuando se detecte agua no segura en ${distrito}.`
    );
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
      document
        .getElementById("cerrarSesionFooter")
        ?.addEventListener("click", (e) => {
          e.preventDefault();
          localStorage.removeItem("usuarioActivo");
          window.location.href = "index.html";
        });
    }
  }

  // ====================================
  // REVISIÓN TÉCNICA DE ALERTAS
  // ====================================
  const modalRevisionTecnica = document.getElementById("modalRevisionTecnica");
  const closeRevisionTecnica = document.getElementById("closeRevisionTecnica");
  const formRevisionTecnica = document.getElementById("formRevisionTecnica");
  const tituloAlertaTecnica = document.getElementById("tituloAlertaTecnica");
  const selectResultadoTecnico = document.getElementById(
    "selectResultadoTecnico"
  );
  const comentarioTecnicoInput = document.getElementById("comentarioTecnico");
  let alertaSeleccionada = null;

  // ====================================
  // ALERTAS + IMAGEN (CON CATEGORÍA)
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
      cloro: 0.1,
      bacterias: 5,
      comentarioTecnico: "",
      resultadoTecnico: "Pendiente",
      responsable: "No asignado",
      fechaActualizacion: "05/10/2025 08:00 a.m.",
      categoria: "critica",
    },
    {
      titulo: "Corte programado de servicio",
      lugar: "Villa El Salvador",
      fecha: "05/10/2025",
      hora: "10:00 a.m. - 8:00 p.m.",
      descripcion: "Corte por mantenimiento.",
      estado: "Terminado",
      imagen: null,
      cloro: 0.4,
      bacterias: 0,
      comentarioTecnico: "",
      resultadoTecnico: "Pendiente",
      responsable: "Área de Operaciones",
      fechaActualizacion: "05/10/2025 09:30 a.m.",
      categoria: "moderada",
    },
    {
      titulo: "Presencia de turbidez visible",
      lugar: "Comas",
      fecha: "06/10/2025",
      hora: "04:30 p.m.",
      descripcion: "Evita consumir directamente.",
      estado: "Solucionado",
      imagen: null,
      cloro: 0.3,
      bacterias: 10,
      comentarioTecnico: "",
      resultadoTecnico: "Pendiente",
      responsable: "Equipo de Calidad",
      fechaActualizacion: "06/10/2025 05:00 p.m.",
      categoria: "critica",
    },
  ];

  //  LÍDERES DE ZONA POR DISTRITO
  const lideresZona = {
    "San Juan de Lurigancho": {
      nombre: "Ing. Carla Ramos",
      institucion: "SEDAPAL - Zona Este",
      telefono: "+51 987 654 321",
      correo: "carla.ramos@sedapal.pe",
    },
    Comas: {
      nombre: "Lic. José Medina",
      institucion: "DIGESA - Lima Norte",
      telefono: "+51 934 112 233",
      correo: "jose.medina@digesa.gob.pe",
    },
    "Villa El Salvador": {
      nombre: "Ing. Luis Gutiérrez",
      institucion: "SUNASS - Lima Sur",
      telefono: "+51 945 778 889",
      correo: "luis.gutierrez@sunass.gob.pe",
    },
  };

  const LABEL_CATEGORIA = {
    leve: "Leve",
    moderada: "Moderada",
    critica: "Crítica",
  };

  function interpretarCalidadAgua(cloro, bacterias) {
    if (bacterias > 0) {
      return {
        texto: "⛔ No apta para consumo (bacterias detectadas)",
        clase: "calidad-roja",
      };
    }

    if (cloro < 0.2) {
      return {
        texto: "⚠ Bajo nivel de cloro. Se recomienda hervir el agua.",
        clase: "calidad-amarilla",
      };
    }

    if (cloro > 0.8) {
      return {
        texto: "⚠ Cloro elevado. Puede alterar sabor u olor.",
        clase: "calidad-amarilla",
      };
    }

    return {
      texto: "✅ Agua dentro de parámetros seguros.",
      clase: "calidad-verde",
    };
  }

  // ============================
  // RENDER DE ALERTAS (con categoría)
  // ============================
  function renderAlertas() {
    if (!listaAlertas) return;

    listaAlertas.innerHTML = "";

    alertas.forEach((a, index) => {
      const div = document.createElement("div");

      // Categoría segura
      let categoria = a.categoria;
      if (categoria !== "moderada" && categoria !== "critica") {
        categoria = "leve";
      }

      const interprete = interpretarCalidadAgua(a.cloro, a.bacterias);

      // Clases para color
      div.className = `alerta-card alerta-${categoria}`;

      div.innerHTML = `
        <div class="alerta-info">
          <i class="fa-regular fa-bell"></i>
          <div class="alerta-text">

            <p class="alerta-categoria">${categoria.toUpperCase()}</p>

            <p><b>Alerta:</b> ${a.titulo}</p>

            <p class="alerta-categoria">
              <b>Categoría:</b> ${LABEL_CATEGORIA[categoria]}
            </p>

            <p><b>Lugar:</b> <span class="alerta-lugar">${a.lugar}</span></p>
            <p><b>Fecha:</b> ${a.fecha}</p>
            <p><b>Hora:</b> ${a.hora}</p>
            ${a.imagen ? `<img src="${a.imagen}" class="alerta-img" />` : ""}

            <p class="datos-tecnicos">
              Cloro: <b>${a.cloro} mg/L</b> · Bacterias: <b>${a.bacterias} NMP/100 mL</b>
            </p>

            <p class="chip-calidad ${interprete.clase}">
              ${interprete.texto}
            </p>

            <p><b>Estado:</b> 
              <span class="estado ${a.estado.replace(" ", "-").toLowerCase()}">
                ${a.estado}
              </span>
            </p>

            <p><b>Responsable:</b> ${a.responsable || "No asignado"}</p>
            <p><b>Última actualización:</b> ${a.fechaActualizacion || "—"}</p>

            <p><b>Revisión técnica:</b>
              <span class="badge-revision ${
                a.resultadoTecnico === "Confirmada"
                  ? "rev-confirmada"
                  : a.resultadoTecnico === "Descartada"
                  ? "rev-descartada"
                  : "rev-pendiente"
              }">
                ${a.resultadoTecnico || "Pendiente"}
              </span>
            </p>

            ${
              a.comentarioTecnico
                ? `<p class="comentario-tecnico"><b>Comentario técnico:</b> ${a.comentarioTecnico}</p>`
                : ""
            }

            <button class="btn btn-add btn-revision-tecnica" data-index="${index}">
              Revisión técnica
            </button>

            <button class="btn btn-add btn-estado" data-index="${index}">
              Actualizar estado
            </button>

            <button class="btn btn-add btn-contactar-lider" data-lugar="${a.lugar}">
              Contactar líder de zona
            </button>

            <button class="btn btn-add btn-compartir" data-index="${index}">
              Compartir
            </button>
          </div>
        </div>
        <i class="fa-solid fa-arrow-right"></i>
      `;

      // Click en la tarjeta -> detalles generales
      div.addEventListener("click", () => {
        alert(
          `Detalles de la alerta:\n\nTítulo: ${a.titulo}\nLugar: ${a.lugar}\nFecha: ${a.fecha}\nHora: ${a.hora}\nEstado: ${a.estado}\n\nDescripción: ${a.descripcion}`
        );
      });

      // Click en botón Revisión técnica (no dispara el alert general)
      const btnRevision = div.querySelector(".btn-revision-tecnica");
      btnRevision.addEventListener("click", (ev) => {
        ev.stopPropagation();
        alertaSeleccionada = index;
        tituloAlertaTecnica.textContent = `Alerta: ${a.titulo} - ${a.lugar}`;
        selectResultadoTecnico.value =
          a.resultadoTecnico === "Descartada" ? "Descartada" : "Confirmada";
        comentarioTecnicoInput.value = a.comentarioTecnico || "";
        modalRevisionTecnica.style.display = "flex";
      });

      listaAlertas.appendChild(div);
    });
  }

  // Render inicial
  renderAlertas();

  // Cerrar modal de revisión técnica
  closeRevisionTecnica?.addEventListener("click", () => {
    modalRevisionTecnica.style.display = "none";
  });

  // Cerrar modal al hacer clic fuera
  window.addEventListener("click", (e) => {
    if (e.target === modalRevisionTecnica) {
      modalRevisionTecnica.style.display = "none";
    }
  });

  // Guardar revisión técnica
  formRevisionTecnica?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (alertaSeleccionada === null) return;

    const resultado = selectResultadoTecnico.value; // Confirmada / Descartada
    const comentario = comentarioTecnicoInput.value.trim();

    alertas[alertaSeleccionada].resultadoTecnico = resultado;
    alertas[alertaSeleccionada].comentarioTecnico = comentario;

    renderAlertas();
    modalRevisionTecnica.style.display = "none";

    alert("✅ Revisión técnica guardada para esta alerta.");
  });

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

    // select de categoría (si existe)
    const selectCategoria = document.getElementById("categoriaAlerta");
    let categoria = "leve";
    if (selectCategoria && selectCategoria.value) {
      categoria = selectCategoria.value; // leve / moderada / critica
    }

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
      cloro: 0.4, // valor por defecto
      bacterias: 0, // valor por defecto
      comentarioTecnico: "",
      resultadoTecnico: "Pendiente",
      responsable: "No asignado",
      fechaActualizacion: new Date().toLocaleString("es-PE"),
      categoria,
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
        ${
          c.enlace
            ? `<p style="font-size: 13px;"><a href="${c.enlace}" target="_blank">Ver informe oficial</a></p>`
            : ""
        }
      `;

      const botones = document.createElement("div");
      botones.className = "comunicado-actions";

      const btnEditar = document.createElement("button");
      btnEditar.textContent = "Editar";
      btnEditar.className = "btn btn-add";
      btnEditar.addEventListener("click", () =>
        cargarComunicadoEnFormulario(index)
      );

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
      mensajeComunicado.textContent =
        "Por favor, completa título, fecha y descripción.";
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
  const selectDistritoSeguridad = document.getElementById(
    "selectDistritoSeguridad"
  );
  const btnEvaluarSeguridad = document.getElementById("btnEvaluarSeguridad");
  const resultadoSeguridad = document.getElementById("resultadoSeguridad");

  const seguridadPorDistrito = {
    "San Juan de Lurigancho": {
      segura: false,
      mensaje: "⚠ Incidencias recientes. Hervir antes de consumir.",
    },
    Comas: {
      segura: false,
      mensaje: "⚠ Agua no recomendable para consumo directo.",
    },
    "San Martín de Porres": {
      segura: true,
      mensaje: "✅ Agua apta para consumo.",
    },
    "Villa El Salvador": {
      segura: true,
      mensaje: "✅ Agua segura y estable.",
    },
    "Los Olivos": {
      segura: true,
      mensaje: "✅ Agua apta, mantener limpieza en almacenamiento.",
    },
    Ate: {
      segura: false,
      mensaje: "⚠ Se registraron niveles bajos de cloro. Hervir 1 minuto.",
    },
    Rímac: {
      segura: true,
      mensaje: "✅ Agua dentro de los parámetros aceptables.",
    },
    Surco: { segura: true, mensaje: "✅ Agua segura para consumo." },
    Breña: {
      segura: false,
      mensaje: "⚠ Recomendación: no consumir directamente del caño.",
    },
    Chorrillos: { segura: true, mensaje: "✅ Agua apta para consumo." },
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
  const btnGuardarPreferencias = document.getElementById(
    "btnGuardarPreferencias"
  );
  const modalConfirmPreferencias = document.getElementById(
    "modalConfirmPreferencias"
  );
  const btnPrefSi = document.getElementById("btnPrefSi");
  const btnPrefNo = document.getElementById("btnPrefNo");

  // Abrir modal de preferencias (cargando lo guardado si existe)
  btnConfigPreferencias?.addEventListener("click", () => {
    const prefs = JSON.parse(
      localStorage.getItem("preferenciasAlertas") || "{}"
    );
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

  // MODAL CONTACTAR LÍDER DE ZONA
  const modalContactarLider = document.getElementById("modalContactarLider");
  const closeContactarLider = document.getElementById("closeContactarLider");
  const textoZonaLider = document.getElementById("textoZonaLider");
  const infoLiderZona = document.getElementById("infoLiderZona");

  // Delegación: click en botón "Contactar líder de zona"
  document.addEventListener("click", (e) => {
    if (!e.target.classList.contains("btn-contactar-lider")) return;
    e.stopPropagation();

    const distrito = e.target.dataset.lugar;
    const lider = lideresZona[distrito];

    if (!modalContactarLider || !textoZonaLider || !infoLiderZona) return;

    if (!lider) {
      textoZonaLider.textContent = `No se ha registrado aún un líder de zona para ${distrito}.`;
      infoLiderZona.innerHTML = `<p>Puedes coordinar directamente con la municipalidad o la UGP de tu distrito.</p>`;
    } else {
      textoZonaLider.textContent = `Distrito: ${distrito}`;

      const telefonoParaWa = lider.telefono.replace(/[^0-9]/g, "");
      const linkWa = `https://wa.me/51${telefonoParaWa.slice(-9)}`;
      const linkMail = `mailto:${lider.correo}?subject=Coordinación%20por%20alerta%20de%20agua%20en%20${encodeURIComponent(
        distrito
      )}`;

      infoLiderZona.innerHTML = `
        <p><b>Nombre:</b> ${lider.nombre}</p>
        <p><b>Institución:</b> ${lider.institucion}</p>
        <p><b>Teléfono:</b> ${lider.telefono}</p>
        <p><b>Correo:</b> ${lider.correo}</p>
        <div style="margin-top:10px; display:flex; gap:8px; flex-wrap:wrap;">
          <a href="${linkWa}" target="_blank" class="btn" style="background-color:#25D366; padding:8px 12px; border-radius:6px; color:#fff; text-decoration:none; font-size:13px;">
            Contactar por WhatsApp
          </a>
          <a href="${linkMail}" class="btn" style="background-color:#004aad; padding:8px 12px; border-radius:6px; color:#fff; text-decoration:none; font-size:13px;">
            Enviar correo
          </a>
        </div>
      `;
    }

    modalContactarLider.style.display = "flex";
  });

  // Cerrar modal líder
  closeContactarLider?.addEventListener("click", () => {
    modalContactarLider.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modalContactarLider) {
      modalContactarLider.style.display = "none";
    }
  });
});
