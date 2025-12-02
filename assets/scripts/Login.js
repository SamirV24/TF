// ====================================
// FUNCIÓN PARA REGISTRAR ACCIONES
// ====================================
function registrarAccionSistema(tipoAccion, detalle = "", usuarioRelacionado = null) {
  let historialActual;

  try {
    const raw = localStorage.getItem("historialAcciones");
    // Si no hay nada, o está mal formado, usamos []
    historialActual = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(historialActual)) {
      historialActual = [];
    }
  } catch (error) {
    console.error("Error leyendo historialAcciones, se reinicia:", error);
    historialActual = [];
  }

  // Usuario asociado a la acción
  const usuarioActivo =
    usuarioRelacionado ||
    localStorage.getItem("usuarioActivo") ||
    "Usuario no identificado";

  const fechaHora = new Date().toLocaleString("es-PE", {
    dateStyle: "short",
    timeStyle: "short",
  });

  historialActual.push({
    usuario: usuarioActivo,
    tipo: tipoAccion,
    detalle: detalle,
    fechaHora: fechaHora,
  });

  try {
    localStorage.setItem(
      "historialAcciones",
      JSON.stringify(historialActual)
    );
  } catch (error) {
    console.error("Error guardando historialAcciones:", error);
  }
}

// ====================================
// MANEJO DEL LOGIN
// ====================================
document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();

  const usuario = document.getElementById("usuario").value;
  const contrasena = document.getElementById("password").value;

  const usuarioGuardado = localStorage.getItem("usuarioRegistrado");
  const contrasenaGuardada = localStorage.getItem("contrasenaRegistrada");
  const nombreGuardado = localStorage.getItem("nombreRegistrado");

  // limpiar cualquier usuario activo previo
  localStorage.removeItem("usuarioActivo");

  if (usuario === usuarioGuardado && contrasena === contrasenaGuardada) {
    const nombre = nombreGuardado || usuarioGuardado || usuario;
    localStorage.setItem("usuarioActivo", nombre);

    // registrar en historial
    registrarAccionSistema(
      "Inicio de sesión",
      `Inicio de sesión correcto para el usuario "${usuario}".`,
      usuario
    );

    window.location.href = "SesionIniciada.html";
  } else {
    // registrar intento fallido
    registrarAccionSistema(
      "Intento de inicio de sesión fallido",
      `Se intentó iniciar sesión con el usuario "${usuario}".`,
      usuario
    );

    window.location.href = "ErrorRegistro.html";
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

  // Cambiar ícono del menú
  hamburger.classList.toggle("open");
  if (hamburger.classList.contains("open")) {
    hamburger.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  } else {
    hamburger.innerHTML = '<i class="fa-solid fa-bars"></i>';
  }
});


