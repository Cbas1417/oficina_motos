(() => {
  const MODAL_URL = "modaln.html";
  const CONTAINER_ID = "modalContainer";
  let loaded = false;
  let currentMode = "crear";
  let currentIndex = null;

  function ensureStylesFrom(doc) {
    const links = doc.querySelectorAll('link[rel="stylesheet"]');
    links.forEach(link => {
      const href = link.getAttribute("href") || "";
      if (!href.endsWith(".css")) return;
      const already = Array.from(document.head.querySelectorAll('link[rel="stylesheet"]'))
        .some(l => (l.getAttribute("href") || "") === href);
      if (!already) document.head.appendChild(link.cloneNode(true));
    });
  }

  async function ensureModal() {
    if (loaded) return;
    const container = document.getElementById(CONTAINER_ID) || document.body;
    const existing = container.querySelector(".modal") || document.querySelector(".modal");
    if (existing) {
      if (!container.contains(existing)) container.appendChild(existing);
      attachModalEvents();
      loaded = true;
      return;
    }

    const res = await fetch(MODAL_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("No se pudo cargar " + MODAL_URL);
    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    ensureStylesFrom(doc);

    const modalEl = doc.body.querySelector(".modal");
    if (!modalEl) throw new Error("No se encontró .modal en " + MODAL_URL);

    const containerEl = document.getElementById(CONTAINER_ID) || document.body;
    containerEl.insertAdjacentHTML("beforeend", modalEl.outerHTML);

    attachModalEvents();
    loaded = true;
  }

  function attachModalEvents() {
    const modal = getModal();
    if (!modal) return;
    if (modal.dataset.eventsAttached === "true") return;

    const btnClose = modal.querySelector(".close");
    const form = modal.querySelector("form");
    const tipoSel = modal.querySelector("#tipo");
    const soatConfig = modal.querySelector("#soatConfig");
    const frecuenciaSel = modal.querySelector("#frecuencia");
    const personalizadoConfig = modal.querySelector("#personalizadoConfig");
    const cantRecInput = modal.querySelector("#cantidadRecordatorios");
    const recordatoriosContainer = modal.querySelector("#recordatoriosContainer");

    function toggleSoatConfig() {
      if (!soatConfig || !tipoSel) return;
      soatConfig.style.display = (tipoSel.value === "soat") ? "block" : "none";
    }

    function togglePersonalizado() {
      if (!personalizadoConfig || !frecuenciaSel) return;
      personalizadoConfig.style.display = (frecuenciaSel.value === "personalizado") ? "flex" : "none";
    }

    function buildRecordatorios() {
      if (!recordatoriosContainer || !cantRecInput) return;
      const cantidad = parseInt(cantRecInput.value) || 0;
      recordatoriosContainer.innerHTML = "";
      for (let i = 1; i <= cantidad; i++) {
        const div = document.createElement("div");
        div.classList.add("linea");
        const label = document.createElement("label");
        label.classList.add("cantidadr");
        label.textContent = "Días antes del vencimiento:";
        const input = document.createElement("input");
        input.type = "number";
        input.classList.add("dv");
        input.name = `recordatorio_${i}`;
        input.placeholder = `Días antes del vencimiento (${i})`;
        input.min = "1";   
        input.value = "1"; 
        div.appendChild(label);
        div.appendChild(input);
        recordatoriosContainer.appendChild(div);
      }
    }

    if (btnClose) btnClose.addEventListener("click", closeModal);
    if (tipoSel) tipoSel.addEventListener("change", toggleSoatConfig);
    if (frecuenciaSel) frecuenciaSel.addEventListener("change", togglePersonalizado);
    if (cantRecInput) cantRecInput.addEventListener("input", buildRecordatorios);

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (validateForm()) handleSave();
      });
    }

    toggleSoatConfig();
    togglePersonalizado();

    modal.dataset.eventsAttached = "true";
  }

  function validateForm() {
    const modal = getModal();
    const titulo = modal.querySelector("#titulo")?.value.trim();
    const descripcion = modal.querySelector("#descripcion")?.value.trim();
    const mensaje = modal.querySelector("#mensaje")?.value.trim();

    if (!titulo || !descripcion || !mensaje) {
      alert("Por favor, completa todos los campos obligatorios.");
      return false;
    }
    return true;
  }

  function handleSave() {
    const data = collectData();

    if (Array.isArray(window.mensajes)) {
      if (currentMode === "editar" && Number.isFinite(currentIndex) && window.mensajes[currentIndex]) {
        window.mensajes[currentIndex] = { ...window.mensajes[currentIndex], ...data };
      } else {
        const nuevo = { ...data, creador: `Usuario${window.mensajes.length + 1}` };
        window.mensajes.push(nuevo);
      }

      if (typeof window.renderizarMensajes === "function") {
        window.renderizarMensajes();
      } else if (typeof window.renderizarTabla === "function") {
        window.renderizarTabla();
      }
    } else {
      document.dispatchEvent(new CustomEvent("modal:submit", {
        detail: { mode: currentMode, index: currentIndex, data }
      }));
    }

    closeModal();
  }

  function getModal() {
    const container = document.getElementById(CONTAINER_ID) || document.body;
    return container.querySelector(".modal");
  }

  function populateModal(values = null) {
    const modal = getModal();
    if (!modal) return;
    const h2 = modal.querySelector("h2");
    const titulo = modal.querySelector("#titulo");
    const descripcion = modal.querySelector("#descripcion");
    const mensaje = modal.querySelector("#mensaje");
    const frecuencia = modal.querySelector("#frecuencia");
    const dias = modal.querySelector("#dias");
    const tipo = modal.querySelector("#tipo");
    const cantRec = modal.querySelector("#cantidadRecordatorios");
    const recordContainer = modal.querySelector("#recordatoriosContainer");

    if (values) {
      if (h2) h2.textContent = "EDITAR MENSAJE";
      if (titulo) titulo.value = values.titulo || "";
      if (descripcion) descripcion.value = values.descripcion || "";
      if (mensaje) mensaje.value = values.mensaje || "";
      if (frecuencia) frecuencia.value = values.frecuencia || "diario";
      if (dias) dias.value = values.dias || 1;
      if (tipo) tipo.value = values.tipo || "general";
      if (cantRec) cantRec.value = values.cantidadRecordatorios || 1;
      if (recordContainer) recordContainer.innerHTML = "";
    } else {
      if (h2) h2.textContent = "CREAR MENSAJE";
      if (titulo) titulo.value = "";
      if (descripcion) descripcion.value = "";
      if (mensaje) mensaje.value = "";
      if (frecuencia) frecuencia.value = "diario";
      if (dias) dias.value = 1;
      if (tipo) tipo.value = "general";
      if (cantRec) cantRec.value = 1;
      if (recordContainer) recordContainer.innerHTML = "";
    }

    modal.querySelector("#tipo")?.dispatchEvent(new Event("change"));
    modal.querySelector("#frecuencia")?.dispatchEvent(new Event("change"));
  }

  function collectData() {
    const modal = getModal();
    const titulo = modal.querySelector("#titulo")?.value.trim() || "";
    const descripcion = modal.querySelector("#descripcion")?.value.trim() || "";
    const mensaje = modal.querySelector("#mensaje")?.value.trim() || "";
    const frecuencia = modal.querySelector("#frecuencia")?.value || "";
    const dias = modal.querySelector("#dias")?.value || 1;
    const tipo = modal.querySelector("#tipo")?.value || "";
    const cantidadRecordatorios = modal.querySelector("#cantidadRecordatorios")?.value || 1;
    const recordatorios = Array.from(modal.querySelectorAll(".dv")).map(i => i.value).filter(Boolean);

    return { titulo, descripcion, mensaje, frecuencia, dias, tipo, cantidadRecordatorios, recordatorios };
  }

  function openModal(mode = "crear", values = null, index = null) {
    currentMode = mode;
    currentIndex = index;
    const modal = getModal();
    if (!modal) return;
    populateModal(values);
    modal.style.display = "flex";
    modal.style.pointerEvents = "auto";
  }

  function closeModal() {
    const modal = getModal();
    if (!modal) return;
    modal.style.display = "none";
    modal.style.pointerEvents = "none";
  }

  document.addEventListener("click", async (e) => {
    if (e.target.closest("#abrirModal")) {
      await ensureModal();
      openModal("crear", null, null);
    }
  });

  document.addEventListener("click", async (e) => {
    const btn = e.target.closest(".js-edit");
    if (!btn) return;
    await ensureModal();

    const index = parseInt(btn.dataset.index, 10);
    const card = btn.closest(".mensajes");
    const titulo = card.querySelector("h2")?.textContent?.trim() || "";
    const ps = card.querySelectorAll("p");

    const getTextAfterLabel = (p, label) =>
      (p?.innerText || "").replace(new RegExp(`^\\s*${label}:?\\s*`, "i"), "").trim();

    const descripcion = getTextAfterLabel(ps[1], "Descripción");
    const mensaje = getTextAfterLabel(ps[2], "Mensaje");

    const values = { titulo, descripcion, mensaje };
    openModal("editar", values, isNaN(index) ? null : index);
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      if (document.querySelector(".modal")) {
        try { attachModalEvents(); loaded = true; } catch (err) { console.error(err); }
      }
    });
  } else {
    if (document.querySelector(".modal")) {
      try { attachModalEvents(); loaded = true; } catch (err) { console.error(err); }
    }
  }
})();
