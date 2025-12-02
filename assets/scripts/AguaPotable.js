// ===============================
// MENÚ HAMBURGUESA + PERFIL
// ===============================
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
  // Manejo de sesión en header/footer
  const nombreActivo = localStorage.getItem("usuarioActivo");
  const authButtons = document.getElementById("auth-buttons");
  const profileButton = document.getElementById("profile-button");

  if (nombreActivo) {
    if (authButtons) authButtons.style.display = "none";
    if (profileButton) profileButton.style.display = "block";

    const btnPerfil = document.getElementById("btnPerfil");
    if (btnPerfil) btnPerfil.textContent = nombreActivo;

    const profileMenu = document.getElementById("profile-menu");
    btnPerfil?.addEventListener("click", () => {
      profileMenu?.classList.toggle("show");
    });

    document.getElementById("cerrarSesion")?.addEventListener("click", (e) => {
      e.preventDefault();
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

  // ===============================
  // BOTÓN VOLVER ATRÁS
  // ===============================
  const btnAtras = document.getElementById("btnAtras");
  btnAtras?.addEventListener("click", () => {
    window.history.back();
  });

  // ===============================
  // MAPA DE PUNTOS DE AGUA POTABLE
  // (historia: técnico SUNASS ve zonas por color de riesgo)
  // ===============================

  // 1. Inicializar mapa centrado en Lima
  const map = L.map("map").setView([-12.0464, -77.0428], 11);

  // 2. Capa base (puedes cambiar el estilo si quieres)
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  // 3. Función para obtener color según nivel de riesgo
  function colorPorRiesgo(riesgo) {
    switch (riesgo) {
      case "alto":
        return "#e53935"; // rojo
      case "medio":
        return "#fb8c00"; // naranja
      case "bajo":
        return "#43a047"; // verde
      default:
        return "#757575"; // gris
    }
  }

  // 4. Puntos de monitoreo ficticios (ejemplo)
  //    Puedes luego reemplazar coordenadas y datos por info real o de la BD.
  const puntosAgua = [
    {
      nombre: "Punto SJL - Z1",
      distrito: "San Juan de Lurigancho",
      riesgo: "alto",
      cloro: "0.1 mg/L",
      bacterias: "15 NMP/100 mL",
      descripcion: "Incidencias recientes de contaminación microbiológica.",
      coords: [-12.0, -76.98],
    },
    {
      nombre: "Punto Comas - Z2",
      distrito: "Comas",
      riesgo: "medio",
      cloro: "0.25 mg/L",
      bacterias: "2 NMP/100 mL",
      descripcion:
        "Se recomienda seguimiento. Leve presencia de bacterias y cloro cercano al mínimo.",
      coords: [-11.95, -77.06],
    },
    {
      nombre: "Punto SMP - Z3",
      distrito: "San Martín de Porres",
      riesgo: "bajo",
      cloro: "0.5 mg/L",
      bacterias: "0 NMP/100 mL",
      descripcion: "Dentro de parámetros adecuados, monitoreo rutinario.",
      coords: [-12.01, -77.09],
    },
    {
      nombre: "Punto VES - Z4",
      distrito: "Villa El Salvador",
      riesgo: "bajo",
      cloro: "0.45 mg/L",
      bacterias: "0 NMP/100 mL",
      descripcion: "Zona estable, sin reportes recientes.",
      coords: [-12.2, -76.94],
    },
  ];

  // 5. Pintar los puntos en el mapa como círculos codificados por color
  puntosAgua.forEach((p) => {
    const color = colorPorRiesgo(p.riesgo);

    const marker = L.circleMarker(p.coords, {
      radius: 10,
      color,
      weight: 2,
      fillColor: color,
      fillOpacity: 0.6,
    }).addTo(map);

    marker.bindPopup(
      `
      <b>${p.nombre}</b><br/>
      <b>Distrito:</b> ${p.distrito}<br/>
      <b>Nivel de riesgo:</b> <span style="color:${color}; text-transform:uppercase;">${p.riesgo}</span><br/>
      <b>Cloro:</b> ${p.cloro}<br/>
      <b>Bacterias:</b> ${p.bacterias}<br/>
      <small>${p.descripcion}</small>
    `
    );
  });

  // 6. Leyenda de colores (bajo / medio / alto)
  const legend = L.control({ position: "bottomright" });

  legend.onAdd = function () {
    const div = L.DomUtil.create("div", "map-legend");
    const niveles = [
      { label: "Riesgo bajo", color: colorPorRiesgo("bajo") },
      { label: "Riesgo medio", color: colorPorRiesgo("medio") },
      { label: "Riesgo alto", color: colorPorRiesgo("alto") },
    ];

    div.innerHTML = "<h4>Nivel de riesgo</h4>";
    niveles.forEach((n) => {
      div.innerHTML += `
        <div class="legend-item">
          <span class="legend-color" style="background:${n.color}"></span>
          <span>${n.label}</span>
        </div>
      `;
    });

    return div;
  };

  legend.addTo(map);
});
