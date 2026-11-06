/* MU 3D Nexus R18 — Integration Layer
   Requiere cargarse después del script principal de R17.
   No reemplaza el motor original.
*/
(() => {
  "use strict";

  const VERSION = "R18.0";
  const SAVE_KEY = "mu3d_nexus_r18";

  const SKINS = [
    {
      id: "venom", name: "Anti Venom Nexus",
      attack: 0.20, defense: 0, hp: 0, crit: 0, lifesteal: 0,
      color: 0xff7a1f,
      desc: "+20% daño de habilidad"
    },
    {
      id: "shadow", name: "Monarca de las Sombras",
      attack: 0.25, defense: 0, hp: 0, crit: 0.10, lifesteal: 0,
      color: 0x713dba,
      desc: "+25% ataque · +10% crítico"
    },
    {
      id: "hero", name: "Héroe del Tiempo",
      attack: 0, defense: 0.20, hp: 0.15, crit: 0, lifesteal: 0,
      color: 0x24a65a,
      desc: "+20% defensa · +15% vida"
    },
    {
      id: "mecha", name: "Mecha Titán Cibernético",
      attack: 0, defense: 0.30, hp: 0, crit: 0, lifesteal: 0,
      color: 0x27d9e8,
      desc: "+30% defensa"
    },
    {
      id: "kundun", name: "Señor de Kundun Carmesí",
      attack: 0, defense: 0, hp: 0, crit: 0.35, lifesteal: 0,
      color: 0xd93432,
      desc: "+35% daño crítico"
    },
    {
      id: "void", name: "Caminante del Vacío",
      attack: 0, defense: 0, hp: 0, crit: 0, lifesteal: 0.20,
      color: 0x9b55ff,
      desc: "+20% robo de vida"
    }
  ];

  const freshState = () => ({
    version: VERSION,
    skin: "venom",
    mounted: false,
    igrisUnlocked: false,
    igrisSummoned: false,
    dungeonClears: 0,
    inputMode: "auto"
  });

  let state = freshState();

  try {
    const old = JSON.parse(localStorage.getItem(SAVE_KEY) || "null");
    if (old && typeof old === "object") {
      state = { ...state, ...old };
    }
  } catch (err) {
    console.warn("[R18] No se pudo cargar el guardado R18.", err);
  }

  function persist() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    } catch (err) {
      console.warn("[R18] No se pudo guardar el estado.", err);
    }
  }

  function make(tag, attrs = {}, text = "") {
    const node = document.createElement(tag);
    Object.assign(node, attrs);
    node.textContent = text;
    return node;
  }

  const style = make("style");
  style.textContent = `
    #r18Dock {
      position:fixed; z-index:1000; right:12px; top:100px;
      width:min(290px,calc(100vw - 24px));
      color:#f4f7ff; background:#0a1423ed;
      border:1px solid #43d8e8; border-radius:12px;
      padding:12px; font:13px system-ui,sans-serif;
      box-shadow:0 0 24px #00d9ff22;
      backdrop-filter: blur(8px);
    }
    #r18Dock h3 {margin:0 0 8px;color:#77f2ff}
    #r18Dock button,#r18Dock select {
      width:100%; padding:9px; margin:4px 0;
      border:1px solid #527a92; border-radius:7px;
      color:#fff; background:#17283b;
      cursor:pointer;
    }
    #r18Dock button:active {transform:scale(.98)}
    #r18Dock .r18note {font-size:11px;color:#aabbd0}
    #r18Dock .r18status {padding:6px 0;color:#ffe39a}
    @media(max-width:700px) {
      #r18Dock {top:auto;bottom:150px;right:8px;width:190px}
      #r18Dock button,#r18Dock select {padding:8px;font-size:12px}
    }
  `;
  document.head.appendChild(style);

  const dock = make("section", { id: "r18Dock" });
  const title = make("h3", {}, "⚔ MU 3D Nexus R18");
  const subtitle = make("div", { className: "r18note" },
    "Hybrid Combat Evolution");
  const skinSelect = make("select", { "aria-label": "Seleccionar skin" });

  for (const skin of SKINS) {
    const option = make("option", { value: skin.id }, skin.name);
    skinSelect.appendChild(option);
  }

  const skinInfo = make("div", { className: "r18note" });
  const skinButton = make("button", {}, "Equipar skin");
  const mountButton = make("button", {}, "🏇 Invocar Ciber Corcel");
  const portalButton = make("button", {}, "🌀 Viajar a Cañón Torlan");
  const modeSelect = make("select", { "aria-label": "Modo de control" });

  for (const [value, label] of [
    ["auto", "Controles: automático"],
    ["mobile", "Controles: móvil"],
    ["pc", "Controles: PC"]
  ]) {
    modeSelect.appendChild(make("option", { value }, label));
  }

  const status = make("div", { className: "r18status" },
    "R18 cargado · modo de compatibilidad");
  const closeButton = make("button", {}, "Ocultar panel");

  dock.append(
    title, subtitle, skinSelect, skinInfo, skinButton,
    mountButton, portalButton, modeSelect, status, closeButton
  );
  document.body.appendChild(dock);

  function currentSkin() {
    return SKINS.find(s => s.id === state.skin) || SKINS[0];
  }

  function applySkin() {
    const skin = currentSkin();
    skinSelect.value = skin.id;
    skinInfo.textContent = skin.desc;
    status.textContent = "Skin equipada: " + skin.name;
    persist();

    // El cambio de material del personaje se integra con el
    // modelo original cuando se conecta su sistema visual.
    window.dispatchEvent(new CustomEvent("mu3d:r18-skin", {
      detail: { ...skin }
    }));
  }

  skinButton.addEventListener("click", applySkin);

  skinSelect.addEventListener("change", () => {
    state.skin = skinSelect.value;
    applySkin();
  });

  modeSelect.value = state.inputMode;
  modeSelect.addEventListener("change", () => {
    state.inputMode = modeSelect.value;
    persist();
    window.dispatchEvent(new CustomEvent("mu3d:r18-input-mode", {
      detail: { mode: state.inputMode }
    }));
    status.textContent = "Modo seleccionado: " + state.inputMode;
  });

  let mountVisual = null;

  function createMountVisual() {
    if (!window.THREE || !window.P || !window.P.g) return null;

    const THREE = window.THREE;
    const mount = new THREE.Group();

    // Cuerpo principal cibernético
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.7, 1.35),
      new THREE.MeshStandardMaterial({
        color: 0x1b2332,
        metalness: 0.85,
        roughness: 0.2,
        emissive: 0x05283b,
        emissiveIntensity: 1.2
      })
    );
    body.position.y = 0.9;
    mount.add(body);

    // Líneas de neón y fuego cibernético (cian / celeste brillante)
    const neon = new THREE.Mesh(
      new THREE.BoxGeometry(0.84, 0.14, 1.42),
      new THREE.MeshBasicMaterial({ color: 0x00f0ff })
    );
    neon.position.y = 1.05;
    mount.add(neon);

    // Cuello y cabeza cibernética
    const neck = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.65, 0.45),
      new THREE.MeshStandardMaterial({ color: 0x243247, metalness: 0.8 })
    );
    neck.position.set(0, 1.35, -0.65);
    neck.rotation.x = 0.45;
    mount.add(neck);

    const head = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.35, 0.55),
      new THREE.MeshStandardMaterial({ color: 0x18202d, metalness: 0.9 })
    );
    head.position.set(0, 1.6, -0.9);
    mount.add(head);

    // Crin de energía cian (Ciber Corcel)
    const mane = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.4, 0.9),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    mane.position.set(0, 1.55, -0.45);
    mane.rotation.x = 0.4;
    mount.add(mane);

    // Patas mecánicas con pezuñas de fuego cian
    for (const x of [-0.3, 0.3]) {
      for (const z of [-0.45, 0.45]) {
        const leg = new THREE.Mesh(
          new THREE.CylinderGeometry(0.09, 0.07, 0.65, 8),
          new THREE.MeshStandardMaterial({
            color: 0x627a90,
            metalness: 0.7
          })
        );
        leg.position.set(x, 0.4, z);
        mount.add(leg);

        const hoof = new THREE.Mesh(
          new THREE.BoxGeometry(0.16, 0.1, 0.18),
          new THREE.MeshBasicMaterial({ color: 0x00e5ff })
        );
        hoof.position.set(x, 0.06, z);
        mount.add(hoof);
      }
    }

    mount.scale.setScalar(1);
    return mount;
  }

  function updateMount() {
    state.mounted = !state.mounted;

    if (state.mounted) {
      mountVisual = createMountVisual();

      if (mountVisual && window.sc && window.P && window.P.g) {
        window.P.g.add(mountVisual);
        mountVisual.position.set(0, -0.4, 0);
      }

      mountButton.textContent = "🏇 Guardar Ciber Corcel";
      status.textContent = "Ciber Corcel invocado (+80% velocidad)";

      window.dispatchEvent(new CustomEvent("mu3d:r18-mount", {
        detail: { mounted: true, speedMultiplier: 1.8 }
      }));
    } else {
      if (mountVisual) {
        if (mountVisual.parent) mountVisual.parent.remove(mountVisual);
        mountVisual = null;
      }
      mountButton.textContent = "🏇 Invocar Ciber Corcel";
      status.textContent = "Ciber Corcel guardado";

      window.dispatchEvent(new CustomEvent("mu3d:r18-mount", {
        detail: { mounted: false, speedMultiplier: 1.0 }
      }));
    }

    persist();
  }

  mountButton.addEventListener("click", updateMount);

  // Añade Torlan al catálogo si el motor expone el arreglo MP.
  // Se preservan los mapas originales y sus índices.
  let torlanIndex = -1;

  if (Array.isArray(window.MP)) {
    torlanIndex = window.MP.findIndex(
      map => Array.isArray(map) && map[0] === "Cañón Torlan"
    );

    if (torlanIndex < 0) {
      window.MP.push([
        "Cañón Torlan",
        100,
        0x9c5836,
        0x371b25,
        [
          ["Droide de asalto", 105, 0x8799a6, 1.2],
          ["Centinela mecánico", 115, 0x3aafbf, 1.5],
          ["Titán Blindado", 130, 0x6e3030, 2.0]
        ]
      ]);
      torlanIndex = window.MP.length - 1;
    }
  }

  portalButton.addEventListener("click", () => {
    if (typeof window.build === "function") {
      try {
        const targetIdx = torlanIndex >= 0 ? torlanIndex : 8;
        window.build(targetIdx);
        status.textContent = "Viajando a Cañón Torlan";
        if (window.S) window.S.r18Map = targetIdx;
        persist();
      } catch (err) {
        console.error("[R18] Error al viajar a Torlan", err);
        status.textContent = "No se pudo cambiar de mapa.";
      }
    } else {
      window.dispatchEvent(new CustomEvent("mu3d:r18-travel-torlan"));
      status.textContent = "Viajando a Cañón Torlan (Evento R18)";
    }
  });

  closeButton.addEventListener("click", () => {
    dock.hidden = true;
  });

  applySkin();
  modeSelect.value = state.inputMode;
  mountButton.textContent = state.mounted
    ? "🏇 Guardar Ciber Corcel"
    : "🏇 Invocar Ciber Corcel";

  window.MU3D_R18 = {
    version: VERSION,
    skins: SKINS,
    getState: () => ({ ...state }),
    save: persist,
    openPanel: () => { dock.hidden = false; },
    toggleMount: () => updateMount(),
    setSkin: id => {
      if (!SKINS.some(s => s.id === id)) return false;
      state.skin = id;
      applySkin();
      return true;
    }
  };

  console.info("[MU 3D Nexus] Capa R18 inicializada:", VERSION);
})();
