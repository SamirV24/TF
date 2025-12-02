// ===========================
// MENÚ HAMBURGUESA
// ===========================
const hamburger = document.getElementById("hamburger");
const nav = document.querySelector(".nav");
const registrarBtn = document.querySelector(".btn-registrarse");
const iniciarSesionBtn = document.querySelector(".btn-iniciarSesion");

if (hamburger) {
  hamburger.addEventListener("click", () => {
    nav?.classList.toggle("nav-active");
    registrarBtn?.classList.toggle("nav-active");
    iniciarSesionBtn?.classList.toggle("nav-active");

    hamburger.classList.toggle("open");
    if (hamburger.classList.contains("open")) {
      hamburger.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    } else {
      hamburger.innerHTML = '<i class="fa-solid fa-bars"></i>';
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // ===========================
  // MOSTRAR USUARIO LOGUEADO EN HEADER
  // ===========================
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

  // ===========================
  // CARGAR DATOS DEL PERFIL
  // ===========================
  const spanUsuario = document.getElementById("usuario");
  const spanNombre = document.getElementById("nombre");
  const spanCorreo = document.getElementById("correo");
  const spanNumero = document.getElementById("numero");
  const spanRol = document.getElementById("rol");

  // 👇 aquí se asume que tus usuarios están guardados en este key:
  // localStorage.setItem("usuariosAquaAlert", JSON.stringify([...]))
  let usuarios = JSON.parse(localStorage.getItem("usuariosAquaAlert") || "[]");

  // Buscamos el usuario logueado por nombre de usuario o correo
  let usuarioActual =
    usuarios.find(
      (u) => u.usuario === nombreActivo || u.correo === nombreActivo
    ) || null;

  if (usuarioActual) {
    spanUsuario.textContent = usuarioActual.usuario || nombreActivo || "-";
    spanNombre.textContent = usuarioActual.nombre || "-";
    spanCorreo.textContent = usuarioActual.correo || "-";
    spanNumero.textContent = usuarioActual.numero || "-";
    spanRol.textContent = usuarioActual.rol || "Ciudadano/a";
  } else {
    // fallback si no lo encontramos en el array
    spanUsuario.textContent = nombreActivo || "-";
    spanNombre.textContent = "-";
    spanCorreo.textContent = "-";
    spanNumero.textContent = "-";
    spanRol.textContent = "Ciudadano/a";
  }

  // ===========================
  // BOTÓN VOLVER ATRÁS
  // ===========================
  document
    .getElementById("btnAtras")
    ?.addEventListener("click", () => window.history.back());

  // ===========================
  // GESTIÓN DE PERSONAL (solo admin)
  // ===========================
  const btnGestion = document.getElementById("btnGestionPersonal");
  const modalGestion = document.getElementById("modalGestionPersonal");
  const closeGestion = document.getElementById("closeGestionPersonal");
  const cuerpoTabla = document.getElementById("tablaPersonal");

  function guardarUsuarios() {
    localStorage.setItem("usuariosAquaAlert", JSON.stringify(usuarios));
  }

  function renderPersonal() {
    cuerpoTabla.innerHTML = "";

    if (usuarios.length === 0) {
      cuerpoTabla.innerHTML =
        '<tr><td colspan="5" style="padding:8px;">No hay usuarios registrados.</td></tr>';
      return;
    }

    usuarios.forEach((u, index) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td style="padding:6px; border-bottom:1px solid #eee;">${u.usuario || "-"}</td>
        <td style="padding:6px; border-bottom:1px solid #eee;">${u.nombre || "-"}</td>
        <td style="padding:6px; border-bottom:1px solid #eee;">${u.correo || "-"}</td>
        <td style="padding:6px; border-bottom:1px solid #eee;">
          <select data-index="${index}" class="select-rol" style="padding:4px; border-radius:6px;">
            <option value="ciudadano" ${u.rol === "ciudadano" ? "selected" : ""}>Ciudadano</option>
            <option value="tecnico" ${u.rol === "tecnico" ? "selected" : ""}>Técnico</option>
            <option value="admin" ${u.rol === "admin" ? "selected" : ""}>Administrador</option>
          </select>
        </td>
        <td style="padding:6px; border-bottom:1px solid #eee;">
          <button class="btn-guardar-rol" data-index="${index}" style="padding:4px 8px; margin-right:4px; border:none; border-radius:6px; background:#00bfa5; color:#fff; cursor:pointer; font-size:12px;">
            Guardar rol
          </button>
          <button class="btn-eliminar-usuario" data-index="${index}" style="padding:4px 8px; border:none; border-radius:6px; background:#c0392b; color:#fff; cursor:pointer; font-size:12px;">
            Eliminar
          </button>
        </td>
      `;

      cuerpoTabla.appendChild(tr);
    });

    // Listeners para guardar rol
    cuerpoTabla.querySelectorAll(".btn-guardar-rol").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const idx = parseInt(e.target.dataset.index, 10);
        const select = cuerpoTabla.querySelector(
          `.select-rol[data-index="${idx}"]`
        );
        if (!select) return;

        const nuevoRol = select.value;
        usuarios[idx].rol = nuevoRol;
        guardarUsuarios();

        // Si actualizamos nuestro propio usuario, refrescamos el texto del perfil
        if (
          usuarioActual &&
          usuarios[idx].usuario === usuarioActual.usuario
        ) {
          spanRol.textContent = nuevoRol;
          usuarioActual.rol = nuevoRol;
        }

        alert("✅ Rol actualizado correctamente.");
      });
    });

    // Listeners para eliminar usuario
    cuerpoTabla.querySelectorAll(".btn-eliminar-usuario").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const idx = parseInt(e.target.dataset.index, 10);
        const usuarioAEliminar = usuarios[idx];

        if (
          usuarioActual &&
          usuarioAEliminar.usuario === usuarioActual.usuario
        ) {
          alert("⚠ No puedes eliminar tu propio usuario desde aquí.");
          return;
        }

        if (
          confirm(
            `¿Seguro que deseas eliminar al usuario "${usuarioAEliminar.usuario}"?`
          )
        ) {
          usuarios.splice(idx, 1);
          guardarUsuarios();
          renderPersonal();
        }
      });
    });
  }

  // Mostrar u ocultar botón según rol
  if (!usuarioActual || usuarioActual.rol !== "admin") {
    // no es admin → ocultamos botón
    if (btnGestion) btnGestion.style.display = "none";
  } else {
    // es admin → habilitamos gestión
    btnGestion.style.display = "inline-block";

    btnGestion.addEventListener("click", () => {
      renderPersonal();
      modalGestion.style.display = "flex";
    });
  }

  // Cerrar modal
  closeGestion?.addEventListener("click", () => {
    modalGestion.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modalGestion) {
      modalGestion.style.display = "none";
    }
  });
});
