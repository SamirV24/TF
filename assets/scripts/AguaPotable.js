document.addEventListener("DOMContentLoaded", () => {
  // ====================================
  // USUARIO LOGUEADO / PERFIL
  // ====================================
  const nombreActivo = localStorage.getItem("usuarioActivo");

  if (nombreActivo) {
    const authButtons = document.getElementById("auth-buttons");
    const profileButton = document.getElementById("profile-button");

    if (authButtons) authButtons.style.display = "none";
    if (profileButton) profileButton.style.display = "block";

    const btnPerfil = document.getElementById("btnPerfil");
    const profileMenu = document.getElementById("profile-menu");

    if (btnPerfil) {
      btnPerfil.textContent = nombreActivo;
      btnPerfil.addEventListener("click", () => {
        profileMenu && profileMenu.classList.toggle("show");
      });
    }

    const cerrarSesion = document.getElementById("cerrarSesion");
    if (cerrarSesion) {
      cerrarSesion.addEventListener("click", () => {
        localStorage.removeItem("usuarioActivo");
        window.location.href = "index.html";
      });
    }

    // Footer dinámico
    const footerUserSection = document.getElementById("footer-user-section");
    if (footerUserSection) {
      footerUserSection.innerHTML = `
        <h4 class="active">Perfil de ${nombreActivo}</h4>
        <ul>
          <li><a href="Perfil.html">Ver Perfil</a></li>
          <li><a href="#" id="cerrarSesionFooter">Cerrar Sesión</a></li>
        </ul>
      `;
      const cerrarSesionFooter = document.getElementById("cerrarSesionFooter");
      cerrarSesionFooter?.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("usuarioActivo");
        window.location.href = "index.html";
      });
    }
  }

  // ====================================
  // BOTÓN VOLVER ATRÁS
  // ====================================
  const btnAtras = document.getElementById("btnAtras");
  btnAtras?.addEventListener("click", () => window.history.back());

  // ====================================
  // MENÚ HAMBURGUESA
  // ====================================
  const hamburger = document.getElementById("hamburger");
  const nav = document.querySelector(".nav");
  const registrarBtn = document.querySelector(".btn-registrarse");
  const iniciarSesionBtn = document.querySelector(".btn-iniciarSesion");

  if (hamburger && nav) {
    hamburger.addEventListener("click", () => {
      nav.classList.toggle("nav-active");
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

  // ====================================
  // MAPA LEAFLET
  // ====================================
  const map = L.map("map").setView([-12.0464, -77.0428], 12);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  // ====================================
  // ZONAS CODIFICADAS POR COLOR (RIESGO)
  // (Historia: "Como técnico de SUNASS...")
  // ====================================
  const zonasRiesgo = [
    {
      nombre: "Zona 1 - Riesgo Alto (SJL)",
      coords: [-12.02, -77.00],
      nivel: "alto",
      detalle: "Reportes recientes de contaminación microbiológica."
    },
    {
      nombre: "Zona 2 - Riesgo Medio (Comas)",
      coords: [-11.98, -77.06],
      nivel: "medio",
      detalle: "Variaciones de cloro residual, seguimiento en curso."
    },
    {
      nombre: "Zona 3 - Riesgo Bajo (Surco)",
      coords: [-12.12, -76.98],
      nivel: "bajo",
      detalle: "Parámetros dentro de límites recomendados."
    }
  ];

  function colorPorNivel(nivel) {
    if (nivel === "alto") return "#e53935";   // rojo
    if (nivel === "medio") return "#f9a825"; // amarillo
    return "#43a047";                        // verde (bajo)
  }

  zonasRiesgo.forEach((z) => {
    const color = colorPorNivel(z.nivel);
    L.circle(z.coords, {
      radius: 1200,      // metros aprox
      color,
      fillColor: color,
      fillOpacity: 0.25,
      weight: 2
    })
      .addTo(map)
      .bindPopup(`
        <div style="font-family:Poppins,sans-serif; font-size:13px;">
          <h3 style="margin:4px 0; color:${color};">${z.nombre}</h3>
          <p style="margin:3px 0;"><b>Nivel de riesgo:</b> ${z.nivel.toUpperCase()}</p>
          <p style="margin:3px 0;">${z.detalle}</p>
          <p style="margin-top:5px; font-size:12px; color:#555;">
            * Referencial para monitoreo. No reemplaza los informes oficiales.
          </p>
        </div>
      `);
  });

  // ====================================
  // PUNTOS DE AGUA POTABLE (CON GOOGLE MAPS)
  // ====================================
  const iconoPuntoAgua = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/727/727790.png",
    iconSize: [38, 38],
  });

  const puntosAguaPotable = [
    {
      lat: -12.0505,
      lng: -77.0352,
      direccion: "Plaza Mayor de Lima",
      descripcion: "Punto oficial de agua potable supervisado por SUNASS."
    },
    {
      lat: -12.0630,
      lng: -77.0405,
      direccion: "Parque Universitario",
      descripcion: "Agua clorada disponible en horario extendido."
    },
    {
      lat: -12.0725,
      lng: -77.0305,
      direccion: "Av. Brasil 1500",
      descripcion: "Punto estable de abastecimiento en coordinación con la EPS."
    }
  ];

  puntosAguaPotable.forEach((p) => {
    L.marker([p.lat, p.lng], { icon: iconoPuntoAgua })
      .addTo(map)
      .bindPopup(`
        <div style="font-family: Poppins, sans-serif; text-align:center;">
          <h3 style="color:#0077b6; margin:4px 0;">Punto de Agua Potable</h3>
          <hr style="border:none; border-top:1px solid #ccc; margin:6px 0;">
          <p style="margin:3px 0;"><b>Ubicación:</b> ${p.direccion}</p>
          <p style="margin:3px 0; font-size:13px;">${p.descripcion}</p>
          <button onclick="window.open('https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            p.direccion
          )}','_blank')"
            style="margin-top: 6px; background-color:#0077b6; color:white; border:none; padding:6px 12px; border-radius:6px; cursor:pointer; font-weight:bold;">
            Ver en Google Maps
          </button>
        </div>
      `);
  });

  // Opcional: centrar el mapa para que se vean todas las capas
  const group = new L.featureGroup([
    ...puntosAguaPotable.map(p => L.marker([p.lat, p.lng])),
    ...zonasRiesgo.map(z => L.circle(z.coords, { radius: 1200 }))
  ]);
  map.fitBounds(group.getBounds().pad(0.3));
});

});

