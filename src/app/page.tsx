"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import TemplateEditor from "@/components/TemplateEditor";

interface MenuItem {
  name: string;
  price: string;
}

interface MenuSection {
  cat: string;
  items: MenuItem[];
}

interface MenuData {
  vorspeisen: MenuSection[];
  hauptgerichte: MenuSection[];
  desserts: MenuSection[];
  drinks: MenuSection[];
  vinos: MenuSection[];
}

const defaultMenuData: MenuData = {
  vorspeisen: [
    { cat: "Tapas", items: [
      { name: "Aceitunas Verdes", price: "5" },
      { name: "Chorizo Español", price: "10" },
      { name: "Chorizo Criollo", price: "5" },
      { name: "Jamón Serrano", price: "14" },
      { name: "Patatas Bravas", price: "10" },
      { name: "Gegrillte Garnelen", price: "16" },
    ]},
    { cat: "Warme Tapas", items: [
      { name: "Gambas al Ajillo", price: "14" },
      { name: "Oktopus nach galizischer Art", price: "20" },
      { name: "Mejillones a la Plancha", price: "14" },
      { name: "Chipirones Fritos o a la Plancha", price: "14" },
      { name: "Pulpo a la Plancha", price: "22" },
      { name: "Calamari a la Romana", price: "12" },
    ]},
    { cat: "Kalte Tapas", items: [
      { name: "Russischer Salat", price: "12" },
      { name: "Plato de Embutidos", price: "22" },
      { name: "Queso Español", price: "12" },
    ]},
    { cat: "Salate", items: [
      { name: "Grüner Salat", price: "5" },
      { name: "Tomatensalat", price: "6" },
      { name: "Gemischter Salat", price: "7" },
      { name: "Haussalat", price: "9" },
      { name: "Mediterraner Salat", price: "12" },
    ]},
  ],
  hauptgerichte: [
    { cat: "Fleischgerichte", items: [
      { name: "Escalope de Ternera / Empanado o a la Plancha", price: "22" },
      { name: "Barbacoa Gallega Mixta", price: "25" },
      { name: "Chuletón 500g", price: "32" },
      { name: "Entrecot a la Plancha o a la Piedra", price: "52" },
      { name: "Filet Mignon", price: "56" },
    ]},
    { cat: "Fisch & Meeresfrüchte", items: [
      { name: "Gegrillter Tintenfisch", price: "22" },
      { name: "Pangasio a la Plancha", price: "22" },
      { name: "Seehecht-Auflauf", price: "25" },
      { name: "Espagueti a la Marinera", price: "25" },
      { name: "Parrillada de Pescado y Marisco", price: "27" },
      { name: "Gegrillter Seebarsch", price: "29" },
      { name: "Lenguado a la Plancha", price: "29" },
      { name: "Rape a la Cazuela", price: "30" },
      { name: "Parrillada de Marisco", price: "35" },
      { name: "Bogavante Entero", price: "45" },
    ]},
    { cat: "Spanische Gerichte", items: [
      { name: "Spanisches Omelett", price: "9" },
      { name: "Padrón-Paprika", price: "12" },
      { name: "Paella (min. 2 Pers.)", price: "24" },
    ]},
    { cat: "Menú Niños", items: [
      { name: "Escalope Empanado", price: "11" },
      { name: "Pangasio", price: "11" },
    ]},
    { cat: "Beilagen", items: [
      { name: "Bratkartoffeln", price: "7" },
      { name: "Pommes Frites / Kartoffeln / Gemüse / Reis", price: "7" },
    ]},
  ],
  desserts: [
    { cat: "Desserts", items: [
      { name: "Postres Niños", price: "6" },
      { name: "Hausgemachter Flan", price: "8" },
      { name: "Crema Catalana", price: "9" },
      { name: "Zitronensorbet", price: "10" },
      { name: "Hausdessert", price: "12" },
    ]},
    { cat: "Heisse Getränke", items: [
      { name: "Kaffee", price: "" },
    ]},
    { cat: "Alkoholische Getränke", items: [
      { name: "Glas Wein", price: "" },
      { name: "Flasche Wein", price: "" },
      { name: "Glas Champagner", price: "" },
      { name: "Flasche Champagner", price: "" },
      { name: "Sangría", price: "" },
    ]},
    { cat: "Cocktails", items: [
      { name: "Caipirinha", price: "" },
    ]},
    { cat: "Alkoholfreie Getränke", items: [
      { name: "Flasche Wasser", price: "" },
    ]},
  ],
  drinks: [
    { cat: "Cocktails", items: [
      { name: "Caipirinha", price: "14" },
      { name: "Mojito", price: "14" },
      { name: "Piña Colada", price: "14" },
      { name: "Margarita", price: "14" },
      { name: "Cuba Libre", price: "12" },
      { name: "Gin Tonic", price: "13" },
      { name: "Aperol Spritz", price: "12" },
      { name: "Sangría (Glas)", price: "8" },
      { name: "Sangría (Krug 1L)", price: "28" },
      { name: "Tinto de Verano", price: "9" },
    ]},
    { cat: "Bier", items: [
      { name: "Estrella Galicia", price: "6" },
      { name: "San Miguel", price: "6" },
      { name: "Mahou", price: "6" },
    ]},
    { cat: "Alkoholfrei", items: [
      { name: "Wasser (still/sprudel)", price: "4" },
      { name: "Coca Cola / Fanta / Sprite", price: "5" },
      { name: "Orangensaft frisch", price: "6" },
      { name: "Limonada casera", price: "6" },
      { name: "Café / Cortado / Espresso", price: "4" },
    ]},
  ],
  vinos: [
    { cat: "Rotwein (Tinto)", items: [
      { name: "Rioja Crianza", price: "8/38" },
      { name: "Rioja Reserva", price: "10/48" },
      { name: "Ribera del Duero", price: "9/42" },
      { name: "Tempranillo Joven", price: "7/32" },
      { name: "Priorat", price: "12/55" },
    ]},
    { cat: "Weisswein (Blanco)", items: [
      { name: "Albariño", price: "8/38" },
      { name: "Verdejo (Rueda)", price: "7/34" },
      { name: "Txakoli", price: "9/42" },
      { name: "Godello", price: "8/38" },
      { name: "Viura", price: "7/32" },
    ]},
    { cat: "Rosé & Cava", items: [
      { name: "Rosado de Navarra", price: "7/34" },
      { name: "Cava Brut", price: "8/38" },
      { name: "Cava Brut Nature", price: "10/45" },
    ]},
  ],
};

type MenuCategory = "vorspeisen" | "hauptgerichte" | "desserts" | "drinks" | "vinos";

export default function Home() {
  const navRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuModal, setMenuModal] = useState<MenuCategory | null>(null);
  const [menuEditing, setMenuEditing] = useState(false);
  const [menu, setMenu] = useState<MenuData>(defaultMenuData);
  const [editDraft, setEditDraft] = useState<MenuSection[]>([]);
  const [isEditorMode, setIsEditorMode] = useState(false);

  const [eventModal, setEventModal] = useState(false);
  const [eventEditing, setEventEditing] = useState(false);

  interface EventData {
    title: string;
    subtitle: string;
    image: string;
    types: string[];
    menuItems: string[];
  }

  const defaultEvent: EventData = {
    title: "Ihr privates Event",
    subtitle: "Feiern Sie bei uns — wir kümmern uns um alles",
    image: "/imagens/572647358_18530299819015485_6265063719025103180_n.jpg",
    types: ["Geburtstag", "Firmenevent", "Hochzeit", "Familienfeier", "Jubiläum"],
    menuItems: [
      "Tapas-Platte gemischt",
      "Paella für alle Gäste",
      "Chuletón a la Piedra",
      "Gambas al Ajillo",
      "Ensalada Mediterránea",
      "Sangría (Krug pro Tisch)",
      "Hauswein rot/weiss",
      "Crema Catalana",
      "Café & Digestif",
    ],
  };

  const [eventData, setEventData] = useState<EventData>(defaultEvent);
  const [eventDraft, setEventDraft] = useState<EventData>(defaultEvent);

  // Reservation form
  const [resName, setResName] = useState("");
  const [resPersonen, setResPersonen] = useState("2 Personen");
  const [resDatum, setResDatum] = useState("");
  const [resUhrzeit, setResUhrzeit] = useState("12:00");
  const [resTelefon, setResTelefon] = useState("");
  const [resEmail, setResEmail] = useState("");
  const [resWuensche, setResWuensche] = useState("");

  const sendWhatsApp = () => {
    const lines = [
      `Tischreservierung — El Español`,
      ``,
      `Name: ${resName}`,
      `Personen: ${resPersonen}`,
      `Datum: ${resDatum}`,
      `Uhrzeit: ${resUhrzeit}`,
      resTelefon ? `Telefon: ${resTelefon}` : "",
      resEmail ? `E-Mail: ${resEmail}` : "",
      resWuensche ? `Wünsche: ${resWuensche}` : "",
    ].filter(Boolean).join("\n");
    const url = `https://wa.me/41787203134?text=${encodeURIComponent(lines)}`;
    window.open(url, "_blank");
  };

  // Load event data from API
  useEffect(() => {
    fetch("/api/load")
      .then((r) => r.json())
      .then((data) => {
        if (data._eventData) {
          try {
            const val = data._eventData.text ?? data._eventData;
            const parsed = typeof val === "string" ? JSON.parse(val) : val;
            if (parsed && parsed.title) setEventData(parsed);
          } catch { /* use default */ }
        }
      })
      .catch(() => {});
  }, []);

  const saveEventData = (evData: EventData) => {
    setEventData(evData);
    if (window.TemplateEditor) {
      const data = window.TemplateEditor.getData();
      data._eventData = { text: JSON.stringify(evData) };
      window.TemplateEditor.setData(data);
    }
  };

  const openEventModal = (edit: boolean) => {
    setEventModal(true);
    setEventEditing(edit);
    if (edit) setEventDraft(JSON.parse(JSON.stringify(eventData)));
    document.body.style.overflow = "hidden";
  };

  const closeEventModal = () => {
    setEventModal(false);
    setEventEditing(false);
    document.body.style.overflow = "";
  };

  const menuTitleKeys: Record<MenuCategory, string> = {
    vorspeisen: "svc1-title",
    hauptgerichte: "svc2-title",
    desserts: "svc3-title",
    drinks: "svc4-title",
    vinos: "svc5-title",
  };

  const getCardTitle = (key: string, fallback: string) => {
    const el = document.querySelector(`[data-edit-key="${key}"]`);
    return el?.textContent?.trim() || fallback;
  };

  // Watch for te-editing class on body
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsEditorMode(document.body.classList.contains("te-editing"));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);


  // Load menu from API
  useEffect(() => {
    fetch("/api/load")
      .then((r) => r.json())
      .then((data) => {
        if (data._menuData) {
          try {
            const val = data._menuData.text ?? data._menuData;
            const parsed = typeof val === "string" ? JSON.parse(val) : val;
            if (parsed && parsed.vorspeisen) setMenu(parsed);
          } catch { /* use default */ }
        }
      })
      .catch(() => { /* use default */ });
  }, []);

  const saveMenu = (newMenu: MenuData) => {
    setMenu(newMenu);
    if (window.TemplateEditor) {
      const data = window.TemplateEditor.getData();
      data._menuData = { text: JSON.stringify(newMenu) };
      window.TemplateEditor.setData(data);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      navRef.current?.classList.toggle("scrolled", window.pageYOffset > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(".fade-up").forEach((el) => el.classList.add("visible"));
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll(".fade-up").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => {
      document.body.style.overflow = !prev ? "hidden" : "";
      return !prev;
    });
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    document.body.style.overflow = "";
  }, []);

  const openMenuModal = (cat: MenuCategory, edit = false) => {
    setMenuModal(cat);
    if (edit) {
      setEditDraft(JSON.parse(JSON.stringify(menu[cat])));
      setMenuEditing(true);
    } else {
      setMenuEditing(false);
    }
    document.body.style.overflow = "hidden";
  };

  const closeMenuModal = () => {
    setMenuModal(null);
    setMenuEditing(false);
    document.body.style.overflow = "";
  };

  const saveEditDraft = () => {
    if (!menuModal) return;
    const newMenu = { ...menu, [menuModal]: editDraft };
    saveMenu(newMenu);
    setMenuEditing(false);
  };

  // Edit draft helpers
  const updateItem = (sIdx: number, iIdx: number, field: "name" | "price", value: string) => {
    const draft = JSON.parse(JSON.stringify(editDraft)) as MenuSection[];
    draft[sIdx].items[iIdx][field] = value;
    setEditDraft(draft);
  };

  const removeItem = (sIdx: number, iIdx: number) => {
    const draft = JSON.parse(JSON.stringify(editDraft)) as MenuSection[];
    draft[sIdx].items.splice(iIdx, 1);
    setEditDraft(draft);
  };

  const addItem = (sIdx: number) => {
    const draft = JSON.parse(JSON.stringify(editDraft)) as MenuSection[];
    draft[sIdx].items.push({ name: "", price: "" });
    setEditDraft(draft);
  };

  const updateCatName = (sIdx: number, value: string) => {
    const draft = JSON.parse(JSON.stringify(editDraft)) as MenuSection[];
    draft[sIdx].cat = value;
    setEditDraft(draft);
  };

  const removeSection = (sIdx: number) => {
    const draft = JSON.parse(JSON.stringify(editDraft)) as MenuSection[];
    draft.splice(sIdx, 1);
    setEditDraft(draft);
  };

  const addSection = () => {
    const draft = JSON.parse(JSON.stringify(editDraft)) as MenuSection[];
    draft.push({ cat: "Neue Kategorie", items: [{ name: "", price: "" }] });
    setEditDraft(draft);
  };

  const displayData = menuEditing ? editDraft : (menuModal ? menu[menuModal] : []);

  return (
    <>
      {/* NAV */}
      <nav className="c-nav" ref={navRef} data-edit="bgcolor" data-edit-key="nav-bg">
        <a href="#" className="c-nav-logo" style={{ marginLeft: 40 }} data-edit="logo" data-edit-key="nav-logo">
          El Español
        </a>
        <div className="c-nav-links">
          <a href="#about" data-edit="text" data-edit-key="nav-link1">Über uns</a>
          <a href="#services" data-edit="text" data-edit-key="nav-link2">Speisekarte</a>
          <a href="#gallery" data-edit="text" data-edit-key="nav-link3">Galerie</a>
          <a href="#team" data-edit="text" data-edit-key="nav-link4">Highlights</a>
          <a href="#contact" className="c-nav-cta" data-edit="text" data-edit-key="nav-cta">Tisch reservieren</a>
        </div>
        <button
          className={`c-nav-burger${menuOpen ? " open" : ""}`}
          aria-label="Menü"
          onClick={toggleMenu}
        >
          <span></span><span></span><span></span>
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`c-mobile-menu${menuOpen ? " open" : ""}`}>
        <a href="#about" onClick={closeMenu} data-edit="text" data-edit-key="nav-link1">Über uns</a>
        <a href="#services" onClick={closeMenu} data-edit="text" data-edit-key="nav-link2">Speisekarte</a>
        <a href="#gallery" onClick={closeMenu} data-edit="text" data-edit-key="nav-link3">Galerie</a>
        <a href="#team" onClick={closeMenu} data-edit="text" data-edit-key="nav-link4">Highlights</a>
        <a href="#contact" onClick={closeMenu} data-edit="text" data-edit-key="nav-cta">Tisch reservieren</a>
      </div>

      {/* HERO */}
      <section className="c-hero">
        <div className="c-hero-bg" data-edit="image" data-edit-key="hero-bg"></div>
        <div className="c-hero-content">
          <div className="c-hero-tag" data-edit="text" data-edit-key="hero-tag">
            Spanisches Restaurant &amp; Tapas Bar
          </div>
          <h1 data-edit="text" data-edit-key="hero-title">El Español</h1>
          <p className="c-hero-sub" data-edit="text" data-edit-key="hero-sub">
            Authentische spanische Küche, frische Tapas und erlesene Weine
            in gemütlicher Atmosphäre — ein Stück Spanien in der Schweiz.
          </p>
          <div className="c-hero-btns">
            <a href="#contact" className="c-btn c-btn--primary" data-edit="text" data-edit-key="hero-btn1">
              Tisch reservieren
            </a>
            <a href="#services" className="c-btn c-btn--outline" data-edit="text" data-edit-key="hero-btn2">
              Unsere Speisekarte
            </a>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <div data-edit="bgcolor" data-edit-key="about-bg">
      <section className="c-section" id="about">
        <div className="c-about-grid">
          <div className="c-about-img fade-up">
            <img
              src="/imagens/572866302_18530296510015485_692596508240286969_n.jpg"
              alt="Restaurant Interior"
              loading="lazy"
              data-edit="image"
              data-edit-key="about-img"
            />
          </div>
          <div className="c-about-text fade-up">
            <div className="c-section-tag" data-edit="text" data-edit-key="about-tag">Über uns</div>
            <h3 className="c-section-title" data-edit="text" data-edit-key="about-title">
              Authentische spanische Küche
            </h3>
            <p data-edit="text" data-edit-key="about-p1">
              Im El Español bringen wir die Aromen Spaniens direkt nach Buchs. Unsere Küche
              verwendet frische, hochwertige Zutaten und traditionelle Rezepte aus allen Regionen Spaniens.
            </p>
            <p data-edit="text" data-edit-key="about-p2">
              Von klassischen Tapas über Paella bis hin zu erlesenen spanischen Weinen —
              bei uns erleben Sie die wahre spanische Gastfreundschaft.
            </p>
            <div className="c-about-features">
              <div className="c-about-feat"><div className="c-about-feat-dot"></div><span data-edit="text" data-edit-key="about-feat1">Frische Zutaten</span></div>
              <div className="c-about-feat"><div className="c-about-feat-dot"></div><span data-edit="text" data-edit-key="about-feat2">Traditionelle Rezepte</span></div>
              <div className="c-about-feat"><div className="c-about-feat-dot"></div><span data-edit="text" data-edit-key="about-feat3">Spanische Weine</span></div>
              <div className="c-about-feat"><div className="c-about-feat-dot"></div><span data-edit="text" data-edit-key="about-feat4">Gemütliche Atmosphäre</span></div>
            </div>
          </div>
        </div>
      </section>
      </div>

      {/* SPEISEKARTE */}
      <section className="c-services-section" id="services">
        <div className="c-services-bg-edit" data-edit="bgcolor" data-edit-key="services-bg"></div>
        <div className="c-section" style={{ paddingTop: 100, paddingBottom: 100, position: "relative", zIndex: 1 }}>
          <div className="c-section-header fade-up">
            <div className="c-section-tag" data-edit="text" data-edit-key="svc-tag">Speisekarte</div>
            <h2 className="c-section-title" data-edit="text" data-edit-key="svc-title">Unsere Spezialitäten</h2>
            <p className="c-section-desc" data-edit="text" data-edit-key="svc-desc">
              Klicken Sie auf eine Kategorie, um die vollständige Karte zu sehen.
            </p>
            <div className="c-divider"></div>
          </div>
          <div className="c-services-grid">
            {(["vorspeisen", "hauptgerichte", "desserts"] as MenuCategory[]).map((cat, i) => {
              const imgs = [
                "/imagens/589138788_18536655121015485_7270480759128976804_n.jpg",
                "/imagens/589279792_18536655139015485_4424482717676331175_n.jpg",
                "/imagens/589319487_18536655025015485_4407393832845570105_n.jpg",
              ];
              const editKeys = [["svc1-img", "svc1-title", "svc1-desc"], ["svc2-img", "svc2-title", "svc2-desc"], ["svc3-img", "svc3-title", "svc3-desc"]];
              const titles = ["Vorspeisen & Tapas", "Hauptgerichte", "Desserts & Getränke"];
              const descs = [
                "Klassische spanische Tapas, Salate und kalte sowie warme Vorspeisen zum Teilen.",
                "Fleisch vom Grill, frischer Fisch, Meeresfrüchte, Paella und traditionelle spanische Gerichte.",
                "Crema Catalana, hausgemachter Flan, spanische Weine, Sangría und Cocktails.",
              ];
              const ctaKeys = ["svc1-cta", "svc2-cta", "svc3-cta"];
              return (
                <div key={cat} className="c-service-card fade-up">
                  <div className="c-service-img">
                    <img src={imgs[i]} alt={titles[i]} loading="lazy" data-edit="image" data-edit-key={editKeys[i][0]} />
                  </div>
                  <div className="c-service-body">
                    <h3 data-edit="text" data-edit-key={editKeys[i][1]}>{titles[i]}</h3>
                    <p data-edit="text" data-edit-key={editKeys[i][2]}>{descs[i]}</p>
                    <span
                      className="c-service-cta"
                      data-edit="text"
                      data-edit-key={ctaKeys[i]}
                      onClick={() => { if (!isEditorMode) openMenuModal(cat); }}
                    >
                      Karte ansehen
                    </span>
                    {isEditorMode && (
                      <button
                        className="c-service-edit-btn"
                        onClick={() => openMenuModal(cat, true)}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        Platos bearbeiten
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* SEGUNDA FILA: Drinks, Vinos, Eventos */}
          <div className="c-services-grid" style={{ marginTop: 32 }}>
            {/* DRINKS */}
            <div className="c-service-card fade-up">
              <div className="c-service-img">
                <img src="/imagens/588926294_18535300567015485_4397774798160919383_n.jpg" alt="Drinks" loading="lazy" data-edit="image" data-edit-key="svc4-img" />
              </div>
              <div className="c-service-body">
                <h3 data-edit="text" data-edit-key="svc4-title">Drinks &amp; Cocktails</h3>
                <p data-edit="text" data-edit-key="svc4-desc">Cocktails, Sangría, spanisches Bier und alkoholfreie Erfrischungen.</p>
                <span
                  className="c-service-cta"
                  data-edit="text"
                  data-edit-key="svc4-cta"
                  onClick={() => { if (!isEditorMode) openMenuModal("drinks"); }}
                >
                  Karte ansehen
                </span>
                {isEditorMode && (
                  <button className="c-service-edit-btn" onClick={() => openMenuModal("drinks", true)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    Platos bearbeiten
                  </button>
                )}
              </div>
            </div>

            {/* VINOS */}
            <div className="c-service-card fade-up">
              <div className="c-service-img">
                <img src="/imagens/589912264_18536655103015485_3152331592810438615_n.jpg" alt="Vinos" loading="lazy" data-edit="image" data-edit-key="svc5-img" />
              </div>
              <div className="c-service-body">
                <h3 data-edit="text" data-edit-key="svc5-title">Carta de Vinos</h3>
                <p data-edit="text" data-edit-key="svc5-desc">Rioja, Ribera del Duero, Albariño, Cava — erlesene spanische Weine.</p>
                <span
                  className="c-service-cta"
                  data-edit="text"
                  data-edit-key="svc5-cta"
                  onClick={() => { if (!isEditorMode) openMenuModal("vinos"); }}
                >
                  Karte ansehen
                </span>
                {isEditorMode && (
                  <button className="c-service-edit-btn" onClick={() => openMenuModal("vinos", true)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    Platos bearbeiten
                  </button>
                )}
              </div>
            </div>

            {/* EVENTOS */}
            <div className="c-service-card fade-up">
              <div className="c-service-img">
                <img src="/imagens/572647358_18530299819015485_6265063719025103180_n.jpg" alt="Eventos" loading="lazy" data-edit="image" data-edit-key="svc6-img" />
              </div>
              <div className="c-service-body">
                <h3 data-edit="text" data-edit-key="svc6-title">Eventos Privados</h3>
                <p data-edit="text" data-edit-key="svc6-desc">Feiern Sie Ihren besonderen Anlass bei uns — Menü, Getränke und Ambiente nach Wunsch.</p>
                <span
                  className="c-service-cta"
                  data-edit="text"
                  data-edit-key="svc6-cta"
                  onClick={() => { if (!isEditorMode) { setEventModal(true); setEventEditing(false); document.body.style.overflow = "hidden"; } }}
                >
                  Mehr erfahren
                </span>
                {isEditorMode && (
                  <button className="c-service-edit-btn" onClick={() => openEventModal(true)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    Event bearbeiten
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MENU MODAL */}
      {menuModal && (
        <div className="menu-modal-overlay" onClick={closeMenuModal}>
          <div className="menu-modal" onClick={(e) => e.stopPropagation()}>
            <div className="menu-modal-header">
              <h2>{getCardTitle(menuTitleKeys[menuModal], menuModal)}</h2>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {menuEditing && (
                  <button className="menu-modal-save" onClick={saveEditDraft}>Speichern</button>
                )}
                <button className="menu-modal-close" onClick={closeMenuModal}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            </div>
            <div className="menu-modal-body">
              {displayData.map((section, sIdx) => (
                <div key={sIdx} className="menu-modal-section">
                  {menuEditing ? (
                    <div className="menu-edit-cat-row">
                      <input
                        className="menu-edit-cat-input"
                        value={section.cat}
                        onChange={(e) => updateCatName(sIdx, e.target.value)}
                      />
                      <button className="menu-edit-remove-section" onClick={() => removeSection(sIdx)} title="Kategorie löschen">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                    </div>
                  ) : (
                    <h3>{section.cat}</h3>
                  )}
                  <div className="menu-modal-items">
                    {section.items.map((item, iIdx) => (
                      <div key={iIdx} className="menu-modal-item">
                        {menuEditing ? (
                          <>
                            <input
                              className="menu-edit-name"
                              value={item.name}
                              placeholder="Gericht"
                              onChange={(e) => updateItem(sIdx, iIdx, "name", e.target.value)}
                            />
                            <input
                              className="menu-edit-price"
                              value={item.price}
                              placeholder="CHF"
                              onChange={(e) => updateItem(sIdx, iIdx, "price", e.target.value)}
                            />
                            <button className="menu-edit-remove" onClick={() => removeItem(sIdx, iIdx)} title="Löschen">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="menu-modal-name">{item.name}</span>
                            {item.price && <span className="menu-modal-price">{item.price} CHF</span>}
                          </>
                        )}
                      </div>
                    ))}
                    {menuEditing && (
                      <button className="menu-edit-add" onClick={() => addItem(sIdx)}>+ Gericht hinzufügen</button>
                    )}
                  </div>
                </div>
              ))}
              {menuEditing && (
                <button className="menu-edit-add-section" onClick={addSection}>+ Neue Kategorie</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* EVENT MODAL */}
      {eventModal && (() => {
        const d = eventEditing ? eventDraft : eventData;
        return (
          <div className="menu-modal-overlay" onClick={closeEventModal}>
            <div className="menu-modal" onClick={(e) => e.stopPropagation()}>
              <div className="menu-modal-header">
                <h2>{getCardTitle("svc6-title", "Eventos Privados")}</h2>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {eventEditing && (
                    <button className="menu-modal-save" onClick={() => { saveEventData(eventDraft); setEventEditing(false); }}>Speichern</button>
                  )}
                  <button className="menu-modal-close" onClick={closeEventModal}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
              </div>
              <div className="menu-modal-body">
                {/* Header image */}
                <div className="event-header-img" style={{ backgroundImage: `url(${d.image})` }}>
                  <div className="event-header-overlay">
                    {eventEditing ? (
                      <>
                        <input className="event-title-input" value={d.title} onChange={(e) => setEventDraft({ ...eventDraft, title: e.target.value })} />
                        <input className="event-subtitle-input" value={d.subtitle} onChange={(e) => setEventDraft({ ...eventDraft, subtitle: e.target.value })} />
                      </>
                    ) : (
                      <>
                        <h3 className="event-title">{d.title}</h3>
                        <p className="event-subtitle">{d.subtitle}</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Event types */}
                <div className="menu-modal-section">
                  <h3>Art des Events</h3>
                  <div className="event-types">
                    {d.types.map((t, i) => (
                      <div key={i} className="event-type-tag">
                        {eventEditing ? (
                          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                            <input className="menu-edit-name" value={t} onChange={(e) => {
                              const draft = { ...eventDraft, types: [...eventDraft.types] };
                              draft.types[i] = e.target.value;
                              setEventDraft(draft);
                            }} />
                            <button className="menu-edit-remove" onClick={() => {
                              const draft = { ...eventDraft, types: eventDraft.types.filter((_, idx) => idx !== i) };
                              setEventDraft(draft);
                            }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                          </div>
                        ) : (
                          <span>{t}</span>
                        )}
                      </div>
                    ))}
                    {eventEditing && (
                      <button className="menu-edit-add" onClick={() => setEventDraft({ ...eventDraft, types: [...eventDraft.types, ""] })} style={{ marginTop: 4 }}>+ Typ hinzufügen</button>
                    )}
                  </div>
                </div>

                {/* Description or Menu editing */}
                {eventEditing ? (
                  <div className="menu-modal-section">
                    <h3>Menü &amp; Getränke</h3>
                    <div className="menu-modal-items">
                      {d.menuItems.map((item, i) => (
                        <div key={i} className="menu-modal-item">
                          <input className="menu-edit-name" value={item} onChange={(e) => {
                            const items = [...eventDraft.menuItems];
                            items[i] = e.target.value;
                            setEventDraft({ ...eventDraft, menuItems: items });
                          }} />
                          <button className="menu-edit-remove" onClick={() => {
                            setEventDraft({ ...eventDraft, menuItems: eventDraft.menuItems.filter((_, idx) => idx !== i) });
                          }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                          </button>
                        </div>
                      ))}
                      <button className="menu-edit-add" onClick={() => setEventDraft({ ...eventDraft, menuItems: [...eventDraft.menuItems, ""] })}>+ Hinzufügen</button>
                    </div>
                  </div>
                ) : (
                  <div className="menu-modal-section">
                    <h3>Unser Angebot</h3>
                    <p className="event-description">
                      Wir gestalten Ihr Event ganz nach Ihren Wünschen — von einem exklusiven Tapas-Buffet
                      über eine traditionelle Paella bis hin zu einem mehrgängigen Menü mit erlesenen spanischen Weinen.
                      Unser Team kümmert sich um alles: Dekoration, Musik und ein unvergessliches kulinarisches Erlebnis.
                    </p>
                    <p className="event-description">
                      Kontaktieren Sie uns für ein individuelles Angebot — wir beraten Sie gerne persönlich.
                    </p>
                  </div>
                )}

              </div>
            </div>
          </div>
        );
      })()}

      {/* GALLERY */}
      <div data-edit="bgcolor" data-edit-key="gallery-bg">
      <section className="c-section" id="gallery">
        <div className="c-section-header fade-up">
          <div className="c-section-tag" data-edit="text" data-edit-key="gallery-tag">Galerie</div>
          <h2 className="c-section-title" data-edit="text" data-edit-key="gallery-title">Einblicke ins El Español</h2>
          <p className="c-section-desc" data-edit="text" data-edit-key="gallery-desc">Unsere Gerichte, unser Ambiente — lassen Sie sich inspirieren.</p>
          <div className="c-divider"></div>
        </div>
        <div className="c-gallery-grid">
          <div className="c-gallery-item fade-up"><img src="/imagens/572647358_18530299819015485_6265063719025103180_n.jpg" alt="Restaurant 1" loading="lazy" data-edit="image" data-edit-key="gallery1" /></div>
          <div className="c-gallery-item fade-up"><img src="/imagens/572866302_18530296510015485_692596508240286969_n.jpg" alt="Restaurant 2" loading="lazy" data-edit="image" data-edit-key="gallery2" /></div>
          <div className="c-gallery-item fade-up"><img src="/imagens/588926294_18535300567015485_4397774798160919383_n.jpg" alt="Restaurant 3" loading="lazy" data-edit="image" data-edit-key="gallery3" /></div>
          <div className="c-gallery-item fade-up"><img src="/imagens/589138788_18536655121015485_7270480759128976804_n.jpg" alt="Restaurant 4" loading="lazy" data-edit="image" data-edit-key="gallery4" /></div>
          <div className="c-gallery-item fade-up"><img src="/imagens/589279792_18536655139015485_4424482717676331175_n.jpg" alt="Restaurant 5" loading="lazy" data-edit="image" data-edit-key="gallery5" /></div>
          <div className="c-gallery-item fade-up"><img src="/imagens/589912264_18536655103015485_3152331592810438615_n.jpg" alt="Restaurant 6" loading="lazy" data-edit="image" data-edit-key="gallery6" /></div>
        </div>
      </section>
      </div>

      {/* PLATOS ESTRELLA */}
      <section className="c-team-section" id="team" data-edit="bgcolor" data-edit-key="team-bg">
        <div className="c-section" style={{ paddingTop: 100, paddingBottom: 100 }}>
          <div className="c-section-header fade-up">
            <div className="c-section-tag" data-edit="text" data-edit-key="team-tag">Nuestros Favoritos</div>
            <h2 className="c-section-title" data-edit="text" data-edit-key="team-title">Platos Estrella</h2>
            <div className="c-divider"></div>
          </div>
          <div className="c-team-grid">
            <div className="c-team-card fade-up">
              <div className="c-team-img"><img src="/imagens/589912264_18536655103015485_3152331592810438615_n.jpg" alt="Pulpo" loading="lazy" data-edit="image" data-edit-key="team1-img" /></div>
              <h3 data-edit="text" data-edit-key="team1-name">Pulpo a la Gallega</h3>
              <p data-edit="text" data-edit-key="team1-role">Clásico de Galicia</p>
            </div>
            <div className="c-team-card fade-up">
              <div className="c-team-img"><img src="/imagens/572866302_18530296510015485_692596508240286969_n-1.jpg" alt="Patatas" loading="lazy" data-edit="image" data-edit-key="team2-img" /></div>
              <h3 data-edit="text" data-edit-key="team2-name">Patatas Bravas</h3>
              <p data-edit="text" data-edit-key="team2-role">Picantes y crujientes</p>
            </div>
            <div className="c-team-card fade-up">
              <div className="c-team-img"><img src="/imagens/588926294_18535300567015485_4397774798160919383_n.jpg" alt="Chuletón" loading="lazy" data-edit="image" data-edit-key="team3-img" /></div>
              <h3 data-edit="text" data-edit-key="team3-name">Chuletón a la Piedra</h3>
              <p data-edit="text" data-edit-key="team3-role">Servido en piedra caliente</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="c-cta-section" data-edit="image" data-edit-key="cta-bg">
        <div className="c-cta-content fade-up">
          <h2 data-edit="text" data-edit-key="cta-title">Lust auf spanische Küche?</h2>
          <p data-edit="text" data-edit-key="cta-desc">Reservieren Sie jetzt Ihren Tisch und geniessen Sie einen unvergesslichen Abend bei uns.</p>
          <a href="#contact" className="c-btn c-btn--primary" data-edit="text" data-edit-key="cta-btn">Jetzt reservieren</a>
        </div>
      </section>

      {/* CONTACT */}
      <div data-edit="bgcolor" data-edit-key="contact-bg">
      <section className="c-section" id="contact">
        <div className="c-section-header fade-up">
          <div className="c-section-tag" data-edit="text" data-edit-key="contact-tag">Kontakt</div>
          <h2 className="c-section-title" data-edit="text" data-edit-key="contact-title">Tisch reservieren</h2>
          <p className="c-section-desc" data-edit="text" data-edit-key="contact-desc">Reservieren Sie online oder rufen Sie uns an — wir freuen uns auf Ihren Besuch.</p>
          <div className="c-divider"></div>
        </div>
        <div className="c-contact-grid">
          <form className="c-form fade-up" onSubmit={(e) => { e.preventDefault(); sendWhatsApp(); }}>
            <div className="c-form-row">
              <div><label>Name</label><input type="text" placeholder="Ihr Name" value={resName} onChange={(e) => setResName(e.target.value)} required /></div>
              <div><label>Personen</label>
                <select value={resPersonen} onChange={(e) => setResPersonen(e.target.value)}>
                  <option>2 Personen</option><option>3 Personen</option><option>4 Personen</option><option>5 Personen</option><option>6+ Personen</option>
                </select>
              </div>
            </div>
            <div className="c-form-row">
              <div><label>Datum</label><input type="date" value={resDatum} onChange={(e) => setResDatum(e.target.value)} required /></div>
              <div><label>Uhrzeit</label>
                <select value={resUhrzeit} onChange={(e) => setResUhrzeit(e.target.value)}>
                  <option>12:00</option><option>12:30</option><option>13:00</option><option>18:00</option><option>18:30</option><option>19:00</option><option>19:30</option><option>20:00</option><option>20:30</option>
                </select>
              </div>
            </div>
            <div className="c-form-row">
              <div><label>Telefon</label><input type="tel" placeholder="+41 ..." value={resTelefon} onChange={(e) => setResTelefon(e.target.value)} /></div>
              <div><label>E-Mail</label><input type="email" placeholder="ihre@email.ch" value={resEmail} onChange={(e) => setResEmail(e.target.value)} /></div>
            </div>
            <div><label>Besondere Wünsche</label><textarea placeholder="Allergien, Anlass, besondere Wünsche..." value={resWuensche} onChange={(e) => setResWuensche(e.target.value)}></textarea></div>
            <button type="submit" className="c-form-submit">Tisch reservieren</button>
          </form>
          <div className="c-contact-info fade-up">
            <h3 data-edit="text" data-edit-key="contact-info-title">Besuchen Sie uns</h3>
            <div className="c-contact-row">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
              <div><h4>Adresse</h4><p data-edit="text" data-edit-key="contact-address">Langäulistrasse 22, 9470 Buchs SG</p></div>
            </div>
            <div className="c-contact-row">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>
              <div><h4>Telefon</h4><p data-edit="text" data-edit-key="contact-phone">+41 81 756 XX XX</p></div>
            </div>
            <div className="c-contact-row">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              <div><h4>Öffnungszeiten</h4><p data-edit="text" data-edit-key="contact-hours">Di–Sa: 11:30–14:00 &amp; 17:30–22:00 / So–Mo: Geschlossen</p></div>
            </div>
          </div>
        </div>

        {/* MAPA */}
        <div className="c-contact-map fade-up" data-edit="map" data-edit-key="contact-map" style={{ marginTop: 40 }}>
          <iframe
            id="contactMapIframe"
            src="https://maps.google.com/maps?q=Lang%C3%A4ulistrasse+22+9470+Buchs+SG&t=&z=15&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="300"
            style={{ border: 0, borderRadius: 16 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>
      </div>

      {/* FOOTER */}
      <footer className="c-footer" data-edit="bgcolor" data-edit-key="footer-bg">
        <div className="c-footer-logo" data-edit="logo" data-edit-key="footer-logo">El Español</div>
        <div className="c-footer-links">
          <a href="#about" data-edit="text" data-edit-key="footer-link1">Über uns</a>
          <a href="#services" data-edit="text" data-edit-key="footer-link2">Speisekarte</a>
          <a href="#gallery" data-edit="text" data-edit-key="footer-link3">Galerie</a>
          <a href="#team" data-edit="text" data-edit-key="footer-link4">Highlights</a>
          <a href="#contact" data-edit="text" data-edit-key="footer-link5">Kontakt</a>
          <a
            href="#"
            className="c-footer-admin"
            onClick={(e) => {
              e.preventDefault();
              const btn = document.querySelector('.te-toggle') as HTMLButtonElement;
              if (btn) btn.click();
            }}
          >
            Admin
          </a>
        </div>
        <div className="c-footer-social">
          <a href="#" aria-label="Instagram" data-edit="link" data-edit-key="social-instagram" target="_blank" rel="noopener noreferrer"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg></a>
          <a href="#" aria-label="Facebook" data-edit="link" data-edit-key="social-facebook" target="_blank" rel="noopener noreferrer"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg></a>
          <a href="#" aria-label="TikTok" data-edit="link" data-edit-key="social-tiktok" target="_blank" rel="noopener noreferrer"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12a4 4 0 104 4V4a5 5 0 005 5" /></svg></a>
        </div>
        <div className="c-footer-copy" data-edit="text" data-edit-key="footer-copy">© 2026 El Español — Langäulistrasse 22, Buchs SG</div>
      </footer>

      {/* Template Editor */}
      <TemplateEditor
        templateId="espanol"
        clientId="demo"
        apiEndpoint="/api/"
      />
    </>
  );
}
