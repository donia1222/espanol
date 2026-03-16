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
  const [showLoader, setShowLoader] = useState(true);
  const [loaderModalOpen, setLoaderModalOpen] = useState(false);
  const [loaderEnabled, setLoaderEnabled] = useState(true);
  const [loaderBg, setLoaderBg] = useState('#fdf8f0');
  const [loaderText, setLoaderText] = useState('El Español Buchs');
  const [loaderTagline, setLoaderTagline] = useState('Spanisches Restaurant & Tapas Bar — Buchs SG');
  const [loaderImg, setLoaderImg] = useState('/logo-1.png');
  const [loaderTextColor, setLoaderTextColor] = useState('#2c2c2c');
  const [loaderTaglineColor, setLoaderTaglineColor] = useState('#8a8a8a');
  const [chipsModalOpen, setChipsModalOpen] = useState(false);
  const [evtChips, setEvtChips] = useState(['Tapas','Paella','Rioja','Sangría','Jamón','Olé','Churros','Gazpacho','Cava','Tortilla']);
  const [evtChipsColor, setEvtChipsColor] = useState('#c9362c');
  const [evtChipsOpacity, setEvtChipsOpacity] = useState(0.3);
  const [showCookie, setShowCookie] = useState(false);
  const [heroLogoModalOpen, setHeroLogoModalOpen] = useState(false);
  const [heroBgImages, setHeroBgImages] = useState([
    '/imagens/572647358_18530299819015485_6265063719025103180_n.jpg'
  ]);
  const [heroBgIndex, setHeroBgIndex] = useState(0);
  const [heroBgModalOpen, setHeroBgModalOpen] = useState(false);
  const [heroBgOverlayColor, setHeroBgOverlayColor] = useState('#000000');
  const [heroBgOverlayOpacity, setHeroBgOverlayOpacity] = useState(0.55);
  const [heroLogoBg, setHeroLogoBg] = useState('#ffffff');
  const [heroLogoBgOpacity, setHeroLogoBgOpacity] = useState(1);
  const [heroLogoVisible, setHeroLogoVisible] = useState(true);
  const [legalModal, setLegalModal] = useState<'datenschutz' | 'agb' | null>(null);
  const [datenschutzText, setDatenschutzText] = useState(`Datenschutzerklärung

El Español, Langäulistrasse 22, 9470 Buchs SG, Schweiz

1. Verantwortliche Stelle
Verantwortlich für die Datenverarbeitung auf dieser Website ist El Español, Langäulistrasse 22, 9470 Buchs SG.

2. Erhebung und Verarbeitung personenbezogener Daten
Beim Besuch unserer Website werden automatisch Informationen allgemeiner Natur erfasst (z.B. Browsertyp, Betriebssystem, Uhrzeit des Zugriffs). Diese Daten lassen keine Rückschlüsse auf Ihre Person zu und werden ausschliesslich zur Sicherstellung eines störungsfreien Betriebs und zur Verbesserung unseres Angebots ausgewertet.

3. Cookies
Diese Website verwendet Cookies, um die Benutzerfreundlichkeit zu verbessern. Sie können die Speicherung von Cookies in Ihren Browsereinstellungen deaktivieren.

4. Kontaktformular und Reservierungen
Wenn Sie uns per Kontaktformular, Telefon oder WhatsApp kontaktieren, werden Ihre Angaben zur Bearbeitung Ihrer Anfrage gespeichert. Eine Weitergabe an Dritte erfolgt nicht.

5. Google Maps
Diese Website nutzt Google Maps zur Darstellung unseres Standorts. Dabei können Daten an Google übertragen werden. Weitere Informationen finden Sie in der Datenschutzerklärung von Google.

6. Ihre Rechte
Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung Ihrer personenbezogenen Daten. Kontaktieren Sie uns hierzu unter den oben genannten Kontaktdaten.

7. Änderungen
Wir behalten uns vor, diese Datenschutzerklärung jederzeit anzupassen.`);

  const [agbText, setAgbText] = useState(`Allgemeine Geschäftsbedingungen (AGB)

El Español, Langäulistrasse 22, 9470 Buchs SG, Schweiz

1. Geltungsbereich
Diese AGB gelten für alle Reservierungen und Bestellungen im Restaurant El Español.

2. Reservierungen
Reservierungen können telefonisch, per WhatsApp oder über unsere Website vorgenommen werden. Bei Nichterscheinen oder kurzfristiger Stornierung (weniger als 24 Stunden vorher) behalten wir uns vor, eine Aufwandsentschädigung zu berechnen.

3. Preise und Zahlung
Alle Preise verstehen sich in Schweizer Franken (CHF) inklusive Mehrwertsteuer. Wir akzeptieren Barzahlung, EC-Karte und gängige Kreditkarten.

4. Haftung
El Español haftet nicht für persönliche Gegenstände der Gäste. Die Nutzung der Garderobe erfolgt auf eigene Gefahr.

5. Privatveranstaltungen
Für Privatveranstaltungen gelten gesonderte Vereinbarungen, die schriftlich festgehalten werden. Stornierungen müssen mindestens 7 Tage vor dem Termin erfolgen.

6. Hausordnung
Wir bitten unsere Gäste um respektvollen Umgang miteinander und mit unserem Personal. Das Restaurant behält sich das Hausrecht vor.

7. Gutscheine
Gutscheine sind ab Ausstellungsdatum 12 Monate gültig und können nicht gegen Bargeld eingelöst werden.

8. Anwendbares Recht
Es gilt Schweizer Recht. Gerichtsstand ist Buchs SG.`);

  useEffect(() => {
    const cookieAccepted = localStorage.getItem('cookie-accepted');
    if (!cookieAccepted) setShowCookie(true);
  }, []);

  useEffect(() => {
    try {
      const ds = localStorage.getItem('legal-datenschutz');
      if (ds) setDatenschutzText(ds);
      const ag = localStorage.getItem('legal-agb');
      if (ag) setAgbText(ag);
    } catch {}
  }, []);

  const applyConfigFromData = useCallback((data: Record<string, unknown>) => {
    const lc = data['__loader_config'] as Record<string, unknown> | undefined;
    if (lc) {
      if (lc.enabled === false) setLoaderEnabled(false);
      if (lc.bg) setLoaderBg(lc.bg as string);
      if (lc.text) setLoaderText(lc.text as string);
      if (lc.tagline) setLoaderTagline(lc.tagline as string);
      if (lc.img) setLoaderImg(lc.img as string);
      if (lc.textColor) setLoaderTextColor(lc.textColor as string);
      if (lc.taglineColor) setLoaderTaglineColor(lc.taglineColor as string);
    }
    const cc = data['__chips_config'] as Record<string, unknown> | undefined;
    if (cc) {
      if (cc.chips) setEvtChips(cc.chips as string[]);
      if (cc.color) setEvtChipsColor(cc.color as string);
      if (cc.opacity !== undefined) setEvtChipsOpacity(cc.opacity as number);
    }
    if (data['__legal_datenschutz']) setDatenschutzText(data['__legal_datenschutz'] as string);
    if (data['__legal_agb']) setAgbText(data['__legal_agb'] as string);
    const hb = data['__hero_bg_images'] as string[] | undefined;
    if (hb && hb.length > 0) setHeroBgImages(hb);
    const ho = data['__hero_overlay'] as Record<string, unknown> | undefined;
    if (ho) {
      if (ho.color) setHeroBgOverlayColor(ho.color as string);
      if (ho.opacity !== undefined) setHeroBgOverlayOpacity(ho.opacity as number);
    }
    const hl = data['__hero_logo_config'] as Record<string, unknown> | undefined;
    if (hl) {
      if (hl.bg) setHeroLogoBg(hl.bg as string);
      if (hl.bgOpacity !== undefined) setHeroLogoBgOpacity(hl.bgOpacity as number);
      if (hl.visible === false) setHeroLogoVisible(false);
    }
  }, []);

  // Save config directly to server API (reliable, not dependent on TemplateEditor)
  const saveConfigToServer = useCallback(async (key: string, value: unknown) => {
    try {
      // 1. Load current data from server
      const loadRes = await fetch('/api/load');
      const allData = await loadRes.json();
      // 2. Merge our config
      allData[key] = value;
      // 3. Save back
      await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(allData),
      });
      // 4. Also update template editor local cache if available
      if (window.TemplateEditor) {
        const teData = window.TemplateEditor.getData();
        teData[key] = value;
        window.TemplateEditor.setData(teData);
      }
    } catch (err) {
      console.error('[Config] Save to server failed:', err);
    }
  }, []);

  useEffect(() => {
    // Load from localStorage first (fast)
    try {
      const saved = localStorage.getItem('loader-config');
      if (saved) {
        const c = JSON.parse(saved);
        if (c.enabled === false) setLoaderEnabled(false);
        if (c.bg) setLoaderBg(c.bg);
        if (c.text) setLoaderText(c.text);
        if (c.tagline) setLoaderTagline(c.tagline);
        if (c.img) setLoaderImg(c.img);
        if (c.textColor) setLoaderTextColor(c.textColor);
        if (c.taglineColor) setLoaderTaglineColor(c.taglineColor);
      }
    } catch {}
    try {
      const chipsRaw = localStorage.getItem('events-chips-config');
      if (chipsRaw) {
        const cc = JSON.parse(chipsRaw);
        if (cc.chips) setEvtChips(cc.chips);
        if (cc.color) setEvtChipsColor(cc.color);
        if (cc.opacity !== undefined) setEvtChipsOpacity(cc.opacity);
      }
    } catch {}
    try {
      const hbRaw = localStorage.getItem('hero-bg-images');
      if (hbRaw) {
        const hb = JSON.parse(hbRaw);
        if (Array.isArray(hb) && hb.length > 0) setHeroBgImages(hb);
      }
    } catch {}
    try {
      const hoRaw = localStorage.getItem('hero-overlay-config');
      if (hoRaw) {
        const ho = JSON.parse(hoRaw);
        if (ho.color) setHeroBgOverlayColor(ho.color);
        if (ho.opacity !== undefined) setHeroBgOverlayOpacity(ho.opacity);
      }
    } catch {}
    try {
      const hlRaw = localStorage.getItem('hero-logo-config');
      if (hlRaw) {
        const hl = JSON.parse(hlRaw);
        if (hl.bg) setHeroLogoBg(hl.bg);
        if (hl.bgOpacity !== undefined) setHeroLogoBgOpacity(hl.bgOpacity);
        if (hl.visible === false) setHeroLogoVisible(false);
      }
    } catch {}
    // Load configs directly from server API (reliable, no TemplateEditor dependency)
    fetch('/api/load')
      .then(r => r.json())
      .then(data => applyConfigFromData(data))
      .catch(() => {});
    const timer = setTimeout(() => setShowLoader(false), 2000);
    return () => { clearTimeout(timer); };
  }, []);

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
    image: "/imagens/651545438_18561993517015485_8719417173028106237_n.jpg",
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
      navRef.current?.classList.toggle("scrolled", window.pageYOffset > window.innerHeight - 100);
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

  // Hero background carousel
  useEffect(() => {
    if (heroBgImages.length <= 1) return;
    const iv = setInterval(() => {
      setHeroBgIndex((prev) => (prev + 1) % heroBgImages.length);
    }, 4000);
    return () => clearInterval(iv);
  }, [heroBgImages]);

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

  // Star SVG for testimonials
  const starSvg = <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>;

  return (
    <>
      {/* LOADER */}
      {showLoader && loaderEnabled && (
        <div className="c-loader" style={{ background: loaderBg }}>
          <div className="c-loader-content">
            <img src={loaderImg} alt="El Español" style={{ width: 120, display: 'block', margin: '0 auto 20px' }} className="c-loader-logo" />
            <div className="c-loader-name" style={{ color: loaderTextColor }}>{loaderText}</div>
            <div className="c-loader-tagline" style={{ color: loaderTaglineColor }}>{loaderTagline}</div>
          </div>
        </div>
      )}

      {/* NAV */}
      <nav className="c-nav" ref={navRef}>
        <div className="c-nav-bg-edit" data-edit="bgcolor" data-edit-key="nav-bg" data-edit-target="parent">🎨 Header BG</div>
        <div style={{ position: 'relative', marginLeft: 10 }}>
          <a href="#" className="c-nav-logo" data-edit="logo" data-edit-key="nav-logo">
            <img src="/logo-1.png" alt="El Español" className="c-nav-logo-img" />
          </a>
          {isEditorMode && (
            <div className="c-nav-logo-edit" onClick={(e) => {
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
              const el = e.currentTarget.parentElement?.querySelector('[data-edit-key="nav-logo"]') as HTMLElement;
              if (el) el.click();
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </div>
          )}
        </div>
        <div className="c-nav-links">
          <a href="#about" data-edit="text" data-edit-key="nav-link1">Über uns</a>
          <a href="#services" data-edit="text" data-edit-key="nav-link2">Speisekarte</a>
          <a href="#gallery" data-edit="text" data-edit-key="nav-link3">Galerie</a>
          <a href="#team" data-edit="text" data-edit-key="nav-link4">Highlights</a>
          <a href="#contact" className="c-nav-cta" data-edit="text" data-edit-key="nav-link5">Tisch reservieren</a>
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
      <div className={`c-mobile-menu${menuOpen ? " open" : ""}`} data-edit="bgcolor" data-edit-key="mobile-menu-bg">
        <img src="/logo-1.png" alt="El Español" style={{ width: 100, marginBottom: 20 }} />
        <a href="#about" onClick={closeMenu} data-edit="text" data-edit-key="mobile-link1" style={{ color: '#2c2c2c', fontSize: 22, fontFamily: 'var(--sans)' }}>Über uns</a>
        <a href="#services" onClick={closeMenu} data-edit="text" data-edit-key="mobile-link2" style={{ color: '#2c2c2c', fontSize: 22, fontFamily: 'var(--sans)' }}>Speisekarte</a>
        <a href="#gallery" onClick={closeMenu} data-edit="text" data-edit-key="mobile-link3" style={{ color: '#2c2c2c', fontSize: 22, fontFamily: 'var(--sans)' }}>Galerie</a>
        <a href="#team" onClick={closeMenu} data-edit="text" data-edit-key="mobile-link4" style={{ color: '#2c2c2c', fontSize: 22, fontFamily: 'var(--sans)' }}>Highlights</a>
        <a href="#contact" onClick={closeMenu} data-edit="text" data-edit-key="mobile-link5" style={{ color: '#2c2c2c', fontSize: 22, fontFamily: 'var(--sans)' }}>Tisch reservieren</a>
        <div style={{ marginTop: 40, textAlign: 'center', opacity: 0.5 }}>
          <div data-edit="text" data-edit-key="mobile-info-name" style={{ fontFamily: 'var(--serif)', fontSize: 18, color: '#2c2c2c', marginBottom: 4 }}>El Español Buchs</div>
          <div data-edit="text" data-edit-key="mobile-info-tagline" style={{ fontSize: 12, color: '#8a8a8a', letterSpacing: '0.08em' }}>Spanisches Restaurant &amp; Tapas Bar — Buchs SG</div>
        </div>
      </div>

      {/* HERO */}
      <section className="c-hero">
        {heroBgImages.map((img, i) => (
          <div
            key={img + i}
            className="c-hero-bg"
            style={{
              backgroundImage: `url('${img}')`,
              opacity: i === heroBgIndex ? 1 : 0,
              transition: 'opacity 1.2s ease-in-out',
            }}
          />
        ))}
        <div className="c-hero-overlay" style={{
          position: 'absolute', inset: 0, zIndex: 0,
          background: `linear-gradient(180deg, ${heroBgOverlayColor}${Math.round(heroBgOverlayOpacity * 0.55 * 255).toString(16).padStart(2, '0')} 0%, ${heroBgOverlayColor}${Math.round(heroBgOverlayOpacity * 255).toString(16).padStart(2, '0')} 50%, ${heroBgOverlayColor}${Math.round(Math.min(1, heroBgOverlayOpacity * 1.27) * 255).toString(16).padStart(2, '0')} 100%)`,
        }} />
        {isEditorMode && (
          <div onClick={(e) => { e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); setHeroBgModalOpen(true); }} style={{ position: 'absolute', bottom: 20, right: 20, zIndex: 10, width: 36, height: 36, borderRadius: '50%', background: 'rgba(76,175,80,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
          </div>
        )}
        <div className="c-hero-content">
          <div className="c-hero-ornament">
            <div className="c-hero-ornament-line"></div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <div className="c-hero-ornament-line"></div>
          </div>
          <div className="c-hero-tag" data-edit="text" data-edit-key="hero-tag">
            Spanisches Restaurant &amp; Tapas Bar
          </div>
          {heroLogoVisible && (
            <div style={{ position: 'relative', display: 'inline-block', margin: '0 auto 20px' }}>
              <img src="/logo-1.png" alt="El Español" style={{ maxWidth: 220, display: 'block', background: `rgba(${parseInt(heroLogoBg.slice(1,3),16)},${parseInt(heroLogoBg.slice(3,5),16)},${parseInt(heroLogoBg.slice(5,7),16)},${heroLogoBgOpacity})`, borderRadius: '50%', padding: 12 }} data-edit="image" data-edit-key="hero-logo" />
              {isEditorMode && (
                <div onClick={(e) => { e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); setHeroLogoModalOpen(true); }} style={{ position: 'absolute', bottom: -8, right: -8, width: 32, height: 32, borderRadius: '50%', background: 'rgba(76,175,80,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
                </div>
              )}
            </div>
          )}
          {!heroLogoVisible && isEditorMode && (
            <div onClick={() => setHeroLogoModalOpen(true)} style={{ margin: '0 auto 20px', padding: '12px 24px', borderRadius: 12, background: 'rgba(76,175,80,0.15)', color: '#4CAF50', fontSize: 13, cursor: 'pointer', fontFamily: 'var(--sans)', border: '1px solid rgba(76,175,80,0.3)', display: 'inline-block' }}>
              Logo (oculto) — Config
            </div>
          )}
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
        {heroBgImages.length > 1 && (
          <div className="c-hero-dots">
            {heroBgImages.map((_, i) => (
              <span key={i} className={`c-hero-dot${i === heroBgIndex ? ' active' : ''}`} onClick={() => setHeroBgIndex(i)} />
            ))}
          </div>
        )}

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
            <div className="c-ornamental-divider" style={{ margin: '16px 0 24px', justifyContent: 'flex-start' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 4a2 2 0 110 4 2 2 0 010-4zm0 14c-2.7 0-5.1-1.4-6.5-3.5 0-2.2 4.3-3.4 6.5-3.4s6.5 1.2 6.5 3.4C17.1 18.6 14.7 20 12 20z"/></svg>
            </div>
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

      {/* STATS BANNER */}
      <section className="c-stats-section" data-edit="bgcolor" data-edit-key="stats-bg">
        <div className="c-stats-grid">
          <div className="c-stat fade-up">
            <div className="c-stat-number" data-edit="text" data-edit-key="stat1-number">50<span>+</span></div>
            <div className="c-stat-label" data-edit="text" data-edit-key="stat1-label">Gerichte</div>
          </div>
          <div className="c-stat fade-up fade-up-delay-1">
            <div className="c-stat-number" data-edit="text" data-edit-key="stat2-number">100<span>%</span></div>
            <div className="c-stat-label" data-edit="text" data-edit-key="stat2-label">Spanisch</div>
          </div>
          <div className="c-stat fade-up fade-up-delay-2">
            <div className="c-stat-number" data-edit="text" data-edit-key="stat3-number">30<span>+</span></div>
            <div className="c-stat-label" data-edit="text" data-edit-key="stat3-label">Spanische Weine</div>
          </div>
          <div className="c-stat fade-up fade-up-delay-3">
            <div className="c-stat-number" data-edit="text" data-edit-key="stat4-number">5<span>★</span></div>
            <div className="c-stat-label" data-edit="text" data-edit-key="stat4-label">Bewertung</div>
          </div>
        </div>
      </section>

      {/* SPEISEKARTE */}
      <section className="c-services-section" id="services">
        <div className="c-services-bg-edit" data-edit="bgcolor" data-edit-key="services-bg"></div>
        <div className="c-events-floating-words">
          {evtChips.map((word, i) => {
            const positions = [
              { top: '22%', left: '2%' }, { top: '30%', right: '2%' }, { top: '50%', left: '1%' },
              { top: '60%', right: '1%' }, { top: '80%', left: '3%' }, { top: '40%', right: '1%' },
              { top: '70%', left: '2%' }, { top: '90%', right: '3%' }, { top: '85%', right: '50%' }
            ];
            const pos = positions[i % positions.length];
            return <span key={i} className="c-float-word" style={{ ...pos, animationDelay: `${(i * 0.35) % 2.5}s`, color: evtChipsColor, opacity: evtChipsOpacity }}>{word}</span>;
          })}
        </div>
        <div className="c-section" style={{ paddingTop: 120, paddingBottom: 120, position: "relative", zIndex: 1 }}>
          <div className="c-section-header fade-up">
            <div className="c-section-tag" data-edit="text" data-edit-key="svc-tag">Speisekarte</div>
            <h2 className="c-section-title" data-edit="text" data-edit-key="svc-title">Unsere Spezialitäten</h2>
            <p className="c-section-desc" data-edit="text" data-edit-key="svc-desc">
              Klicken Sie auf eine Kategorie, um die vollständige Karte zu sehen.
            </p>
            <div className="c-ornamental-divider">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            </div>
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
                <div key={cat} className={`c-service-card fade-up fade-up-delay-${i + 1}`}>
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

          {/* SEGUNDA FILA: Drinks, Vinos */}
          <div className="c-services-grid c-services-grid--2col" style={{ marginTop: 32 }}>
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
            <div className="c-service-card fade-up fade-up-delay-1">
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
          </div>
        </div>
      </section>

      {/* EVENTOS SECTION */}
      {isEditorMode && (
        <div className="c-chips-editor-wrap" onClick={() => setChipsModalOpen(true)}>
          <div className="c-chips-editor-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
            Chips Config
          </div>
        </div>
      )}
      <section className="c-events-section" data-edit="bgcolor" data-edit-key="events-bg">
        <div className="c-events-floating-words">
          {evtChips.map((word, i) => {
            const positions = [
              { top: '8%', left: '5%' }, { top: '20%', right: '8%' }, { top: '45%', left: '3%' },
              { top: '70%', right: '5%' }, { top: '85%', left: '8%' }, { top: '35%', right: '3%' },
              { top: '60%', left: '6%' }, { top: '15%', left: '40%' }, { top: '75%', right: '12%' },
              { top: '50%', right: '15%' }
            ];
            const pos = positions[i % positions.length];
            return <span key={i} className="c-float-word" style={{ ...pos, animationDelay: `${(i * 0.3) % 2.5}s`, color: evtChipsColor, opacity: evtChipsOpacity }}>{word}</span>;
          })}
        </div>
        <div className="c-section" style={{ paddingTop: 60, paddingBottom: 60, position: 'relative', zIndex: 1 }}>
          <div className="c-events-layout fade-up">
            <div className="c-events-text">
              <div className="c-section-tag" data-edit="text" data-edit-key="events-tag">Events</div>
              <h2 className="c-section-title" data-edit="text" data-edit-key="events-title" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="1.5"><path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/></svg>
                Eventos
              </h2>
              <p className="c-section-desc" data-edit="text" data-edit-key="events-desc">Feiern Sie Ihren besonderen Anlass bei uns — Menü, Getränke und Ambiente ganz nach Ihren Wünschen.</p>
              <div className="c-ornamental-divider" style={{ margin: '20px 0 0', justifyContent: 'flex-start' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              </div>
            </div>
            <div
              className="c-events-img"
              onClick={() => { if (!isEditorMode) { setEventModal(true); setEventEditing(false); document.body.style.overflow = "hidden"; } }}
              style={{ cursor: isEditorMode ? 'default' : 'pointer' }}
            >
              <img
                src="/imagens/651545438_18561993517015485_8719417173028106237_n.jpg"
                alt="Eventos"
                className="c-events-banner-img"
                data-edit="image"
                data-edit-key="events-banner-img"
              />
              {!isEditorMode && (
                <div className="c-events-img-overlay">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                </div>
              )}
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
            <div className="menu-modal" onClick={(e) => e.stopPropagation()} style={{ padding: 0, overflow: 'hidden' }}>
              <button className="menu-modal-close" onClick={closeEventModal} style={{ position: 'absolute', top: 12, right: 12, zIndex: 10, background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
              <img src={d.image} alt="Eventos" style={{ width: '100%', display: 'block' }} data-edit="image" data-edit-key="events-modal-img" />
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
          <div className="c-ornamental-divider">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          </div>
        </div>
        <div className="c-gallery-grid">
          <div className="c-gallery-item fade-up"><img src="/imagens/572647358_18530299819015485_6265063719025103180_n.jpg" alt="Restaurant 1" loading="lazy" data-edit="image" data-edit-key="gallery1" /></div>
          <div className="c-gallery-item fade-up fade-up-delay-1"><img src="/imagens/572866302_18530296510015485_692596508240286969_n.jpg" alt="Restaurant 2" loading="lazy" data-edit="image" data-edit-key="gallery2" /></div>
          <div className="c-gallery-item fade-up fade-up-delay-2"><img src="/imagens/588926294_18535300567015485_4397774798160919383_n.jpg" alt="Restaurant 3" loading="lazy" data-edit="image" data-edit-key="gallery3" /></div>
          <div className="c-gallery-item fade-up fade-up-delay-3"><img src="/imagens/589138788_18536655121015485_7270480759128976804_n.jpg" alt="Restaurant 4" loading="lazy" data-edit="image" data-edit-key="gallery4" /></div>
          <div className="c-gallery-item fade-up"><img src="/imagens/589279792_18536655139015485_4424482717676331175_n.jpg" alt="Restaurant 5" loading="lazy" data-edit="image" data-edit-key="gallery5" /></div>
          <div className="c-gallery-item fade-up fade-up-delay-1"><img src="/imagens/589912264_18536655103015485_3152331592810438615_n.jpg" alt="Restaurant 6" loading="lazy" data-edit="image" data-edit-key="gallery6" /></div>
        </div>
      </section>
      </div>

      {/* PARALLAX QUOTE */}
      <section className="c-parallax-quote" data-edit="image" data-edit-key="quote-bg">
        <div className="c-parallax-content fade-up">
          <div className="c-parallax-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151C7.563 6.068 6 8.789 6 11h4v10H0z"/></svg>
          </div>
          <p className="c-parallax-text" data-edit="text" data-edit-key="quote-text">
            Kochen ist Liebe, die man schmecken kann — und bei El Español bringen wir diese Liebe in jedes Gericht.
          </p>
          <div className="c-parallax-author" data-edit="text" data-edit-key="quote-author">— El Español Team</div>
        </div>
      </section>

      {/* PLATOS ESTRELLA */}
      <section className="c-team-section" id="team" data-edit="bgcolor" data-edit-key="team-bg">
        <div className="c-section" style={{ paddingTop: 120, paddingBottom: 120 }}>
          <div className="c-section-header fade-up">
            <div className="c-section-tag" data-edit="text" data-edit-key="team-tag">Nuestros Favoritos</div>
            <h2 className="c-section-title" data-edit="text" data-edit-key="team-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
              <svg className="c-platos-emoji" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              Platos Estrella
              <svg className="c-platos-emoji" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            </h2>
            <div className="c-ornamental-divider">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            </div>
          </div>
          <div className="c-team-grid">
            <div className="c-team-card fade-up">
              <div className="c-team-img"><img src="/imagens/589912264_18536655103015485_3152331592810438615_n.jpg" alt="Pulpo" loading="lazy" data-edit="image" data-edit-key="team1-img" /></div>
              <div className="c-team-card-body">
                <h3 data-edit="text" data-edit-key="team1-name">Pulpo a la Gallega</h3>
                <p data-edit="text" data-edit-key="team1-role">Clásico de Galicia</p>
              </div>
            </div>
            <div className="c-team-card fade-up fade-up-delay-1">
              <div className="c-team-img"><img src="/imagens/572866302_18530296510015485_692596508240286969_n-1.jpg" alt="Patatas" loading="lazy" data-edit="image" data-edit-key="team2-img" /></div>
              <div className="c-team-card-body">
                <h3 data-edit="text" data-edit-key="team2-name">Patatas Bravas</h3>
                <p data-edit="text" data-edit-key="team2-role">Picantes y crujientes</p>
              </div>
            </div>
            <div className="c-team-card fade-up fade-up-delay-2">
              <div className="c-team-img"><img src="/imagens/588926294_18535300567015485_4397774798160919383_n.jpg" alt="Chuletón" loading="lazy" data-edit="image" data-edit-key="team3-img" /></div>
              <div className="c-team-card-body">
                <h3 data-edit="text" data-edit-key="team3-name">Chuletón a la Piedra</h3>
                <p data-edit="text" data-edit-key="team3-role">Servido en piedra caliente</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="c-testimonials-section" data-edit="bgcolor" data-edit-key="testimonials-bg">
        <div className="c-section" style={{ paddingTop: 120, paddingBottom: 120 }}>
          <div className="c-section-header fade-up">
            <div className="c-section-tag" data-edit="text" data-edit-key="testimonials-tag">Kundenstimmen</div>
            <h2 className="c-section-title" data-edit="text" data-edit-key="testimonials-title">Was unsere Gäste sagen</h2>
            <p className="c-section-desc" data-edit="text" data-edit-key="testimonials-desc">
              Echte Bewertungen von zufriedenen Gästen aus Buchs und der Region.
            </p>
            <div className="c-ornamental-divider">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            </div>
          </div>
          <div className="c-testimonials-grid">
            <div className="c-testimonial-card fade-up">
              <div className="c-testimonial-stars">
                {starSvg}{starSvg}{starSvg}{starSvg}{starSvg}
              </div>
              <p className="c-testimonial-text" data-edit="text" data-edit-key="testimonial1-text">
                &ldquo;Das beste spanische Restaurant in der Region! Die Paella war einfach himmlisch und die Sangría perfekt. Wir kommen definitiv wieder.&rdquo;
              </p>
              <div className="c-testimonial-author">
                <div className="c-testimonial-avatar">M</div>
                <div>
                  <div className="c-testimonial-name" data-edit="text" data-edit-key="testimonial1-name">Marco W.</div>
                  <div className="c-testimonial-source" data-edit="text" data-edit-key="testimonial1-source">Google Bewertung</div>
                </div>
              </div>
            </div>
            <div className="c-testimonial-card fade-up fade-up-delay-1">
              <div className="c-testimonial-stars">
                {starSvg}{starSvg}{starSvg}{starSvg}{starSvg}
              </div>
              <p className="c-testimonial-text" data-edit="text" data-edit-key="testimonial2-text">
                &ldquo;Fantastische Tapas und eine sehr gemütliche Atmosphäre. Das Personal ist super freundlich und die Portionen grosszügig. Absolut empfehlenswert!&rdquo;
              </p>
              <div className="c-testimonial-author">
                <div className="c-testimonial-avatar">S</div>
                <div>
                  <div className="c-testimonial-name" data-edit="text" data-edit-key="testimonial2-name">Sandra K.</div>
                  <div className="c-testimonial-source" data-edit="text" data-edit-key="testimonial2-source">Google Bewertung</div>
                </div>
              </div>
            </div>
            <div className="c-testimonial-card fade-up fade-up-delay-2">
              <div className="c-testimonial-stars">
                {starSvg}{starSvg}{starSvg}{starSvg}{starSvg}
              </div>
              <p className="c-testimonial-text" data-edit="text" data-edit-key="testimonial3-text">
                &ldquo;Wir haben hier unseren Geburtstag gefeiert — ein unvergesslicher Abend! Die Chuletón war perfekt und der Wein hervorragend. Wie in Spanien!&rdquo;
              </p>
              <div className="c-testimonial-author">
                <div className="c-testimonial-avatar">T</div>
                <div>
                  <div className="c-testimonial-name" data-edit="text" data-edit-key="testimonial3-name">Thomas B.</div>
                  <div className="c-testimonial-source" data-edit="text" data-edit-key="testimonial3-source">TripAdvisor</div>
                </div>
              </div>
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
          <div className="c-ornamental-divider">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          </div>
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
              <div className="c-contact-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
              </div>
              <div><h4>Adresse</h4><p data-edit="text" data-edit-key="contact-address">Langäulistrasse 22, 9470 Buchs SG</p></div>
            </div>
            <div className="c-contact-row">
              <div className="c-contact-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>
              </div>
              <div><h4>Telefon</h4><p data-edit="text" data-edit-key="contact-phone">+41 81 756 XX XX</p></div>
            </div>
            <div className="c-contact-row">
              <div className="c-contact-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              </div>
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
            style={{ border: 0, borderRadius: 20 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>
      </div>

      {/* FOOTER */}
      <footer className="c-footer" data-edit="bgcolor" data-edit-key="footer-bg">
        <div className="c-footer-banner" data-edit="bgcolor" data-edit-key="footer-banner">
          <img src="/logo-1.png" alt="El Español" className="c-footer-banner-logo" data-edit="image" data-edit-key="footer-banner-logo" />
          <div className="c-footer-banner-text">
            <div className="c-footer-banner-name" data-edit="text" data-edit-key="footer-banner-name">El Español Buchs</div>
            <div className="c-footer-banner-tagline" data-edit="text" data-edit-key="footer-banner-tagline">Spanisches Restaurant &amp; Tapas Bar — Buchs SG</div>
          </div>
        </div>
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
            aria-label="Editor Mode"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          </a>
        </div>
        <div className="c-footer-social">
          <a href="#" aria-label="Instagram" data-edit="link" data-edit-key="social-instagram" target="_blank" rel="noopener noreferrer"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg></a>
          <a href="#" aria-label="Facebook" data-edit="link" data-edit-key="social-facebook" target="_blank" rel="noopener noreferrer"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg></a>
          <a href="#" aria-label="TikTok" data-edit="link" data-edit-key="social-tiktok" target="_blank" rel="noopener noreferrer"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12a4 4 0 104 4V4a5 5 0 005 5" /></svg></a>
        </div>
        <div className="c-footer-divider"></div>
        <div className="c-footer-copy" data-edit="text" data-edit-key="footer-copy">© 2026 El Español — Langäulistrasse 22, Buchs SG</div>
        <div className="c-footer-legal">
          <a href="#" data-edit="text" data-edit-key="footer-datenschutz" onClick={(e) => { e.preventDefault(); setLegalModal('datenschutz'); }}>Datenschutz</a>
          {isEditorMode && (
            <span className="c-legal-edit-icon" onClick={(e) => { e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); setLegalModal('datenschutz'); }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </span>
          )}
          <span>|</span>
          <a href="#" data-edit="text" data-edit-key="footer-agb" onClick={(e) => { e.preventDefault(); setLegalModal('agb'); }}>AGB</a>
          {isEditorMode && (
            <span className="c-legal-edit-icon" onClick={(e) => { e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); setLegalModal('agb'); }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </span>
          )}
        </div>
      </footer>
      {isEditorMode && (
        <div className="c-loader-editor-wrap" onClick={() => setLoaderModalOpen(true)}>
          <div className="c-loader-editor-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
            Loader Config
          </div>
        </div>
      )}

      {isEditorMode && (
        <div className="c-loader-editor-wrap" style={{ marginTop: 0 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <div className="c-loader-editor-btn" onClick={() => setLegalModal('datenschutz')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Datenschutz
            </div>
            <div className="c-loader-editor-btn" onClick={() => setLegalModal('agb')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              AGB
            </div>
          </div>
        </div>
      )}

      {/* Loader Config Modal */}
      {loaderModalOpen && (
        <div className="c-loader-modal-overlay" onClick={() => setLoaderModalOpen(false)}>
          <div className="c-loader-modal" onClick={(e) => e.stopPropagation()}>
            <div className="c-loader-modal-header">
              <h3>Loader Konfiguration</h3>
              <button onClick={() => setLoaderModalOpen(false)} className="c-loader-modal-close">&times;</button>
            </div>
            <div className="c-loader-modal-body">
              <div className="c-loader-modal-toggle">
                <label>Loader aktiv</label>
                <button
                  className={`c-toggle-btn${loaderEnabled ? ' active' : ''}`}
                  onClick={() => setLoaderEnabled(!loaderEnabled)}
                >{loaderEnabled ? 'AN' : 'AUS'}</button>
              </div>
              <div className="c-loader-modal-group">
                <label>Hintergrundfarbe</label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input type="color" value={loaderBg} onChange={(e) => setLoaderBg(e.target.value)} />
                  <span style={{ fontSize: 13, color: '#888' }}>{loaderBg}</span>
                </div>
              </div>
              <div className="c-loader-modal-group">
                <label>Titel</label>
                <input type="text" value={loaderText} onChange={(e) => setLoaderText(e.target.value)} className="c-loader-modal-input" />
              </div>
              <div className="c-loader-modal-group">
                <label>Titel Farbe</label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input type="color" value={loaderTextColor} onChange={(e) => setLoaderTextColor(e.target.value)} />
                  <span style={{ fontSize: 13, color: '#888' }}>{loaderTextColor}</span>
                </div>
              </div>
              <div className="c-loader-modal-group">
                <label>Untertitel</label>
                <input type="text" value={loaderTagline} onChange={(e) => setLoaderTagline(e.target.value)} className="c-loader-modal-input" />
              </div>
              <div className="c-loader-modal-group">
                <label>Untertitel Farbe</label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input type="color" value={loaderTaglineColor} onChange={(e) => setLoaderTaglineColor(e.target.value)} />
                  <span style={{ fontSize: 13, color: '#888' }}>{loaderTaglineColor}</span>
                </div>
              </div>
              <div className="c-loader-modal-group">
                <label>Logo URL</label>
                <input type="text" value={loaderImg} onChange={(e) => setLoaderImg(e.target.value)} className="c-loader-modal-input" placeholder="/logo-1.png" />
              </div>
              <div className="c-loader-modal-preview">
                <label>Vorschau</label>
                <div className="c-loader-modal-preview-box" style={{ background: loaderBg }}>
                  <img src={loaderImg} alt="" style={{ width: 60, display: 'block', margin: '0 auto 10px' }} />
                  <div style={{ fontFamily: 'var(--serif)', fontSize: 16, color: loaderTextColor, marginBottom: 4 }}>{loaderText}</div>
                  <div style={{ fontSize: 11, color: loaderTaglineColor }}>{loaderTagline}</div>
                </div>
              </div>
            </div>
            <div className="c-loader-modal-footer">
              <button className="c-loader-modal-save" onClick={() => {
                const config = { enabled: loaderEnabled, bg: loaderBg, text: loaderText, tagline: loaderTagline, img: loaderImg, textColor: loaderTextColor, taglineColor: loaderTaglineColor };
                localStorage.setItem('loader-config', JSON.stringify(config));
                saveConfigToServer('__loader_config', config);
                setLoaderModalOpen(false);
              }}>Speichern</button>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Float */}
      <a
        href="https://wa.me/41787203134?text=Hallo%2C%20ich%20möchte%20gerne%20einen%20Tisch%20reservieren.%20Vielen%20Dank!"
        target="_blank"
        rel="noopener noreferrer"
        className="c-whatsapp-float"
        aria-label="WhatsApp Reservierung"
        data-edit="link"
        data-edit-key="whatsapp-float"
        data-edit-color-target="background"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>

      {/* Hero Logo Config Modal */}
      {heroLogoModalOpen && (
        <div className="c-loader-modal-overlay" onClick={() => setHeroLogoModalOpen(false)}>
          <div className="c-loader-modal" onClick={(e) => e.stopPropagation()}>
            <div className="c-loader-modal-header">
              <h3>Hero Logo</h3>
              <button onClick={() => setHeroLogoModalOpen(false)} className="c-loader-modal-close">&times;</button>
            </div>
            <div className="c-loader-modal-body">
              <div className="c-loader-modal-toggle">
                <label>Logo anzeigen</label>
                <button
                  className={`c-toggle-btn${heroLogoVisible ? ' active' : ''}`}
                  onClick={() => setHeroLogoVisible(!heroLogoVisible)}
                >{heroLogoVisible ? 'AN' : 'AUS'}</button>
              </div>
              <div className="c-loader-modal-group">
                <label>Hintergrundfarbe</label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input type="color" value={heroLogoBg} onChange={(e) => setHeroLogoBg(e.target.value)} />
                  <span style={{ fontSize: 13, color: '#888' }}>{heroLogoBg}</span>
                </div>
              </div>
              <div className="c-loader-modal-group">
                <label>Hintergrund Transparenz ({Math.round(heroLogoBgOpacity * 100)}%)</label>
                <input type="range" min="0" max="1" step="0.05" value={heroLogoBgOpacity} onChange={(e) => setHeroLogoBgOpacity(parseFloat(e.target.value))} style={{ width: '100%' }} />
              </div>
              <div className="c-loader-modal-preview">
                <label>Vorschau</label>
                <div style={{ textAlign: 'center', padding: 20, background: '#1a1a1a', borderRadius: 12 }}>
                  <img src="/logo-1.png" alt="" style={{ width: 100, background: `rgba(${parseInt(heroLogoBg.slice(1,3),16)},${parseInt(heroLogoBg.slice(3,5),16)},${parseInt(heroLogoBg.slice(5,7),16)},${heroLogoBgOpacity})`, borderRadius: '50%', padding: 8 }} />
                </div>
              </div>
            </div>
            <div className="c-loader-modal-footer">
              <button className="c-loader-modal-save" onClick={() => {
                const config = { bg: heroLogoBg, bgOpacity: heroLogoBgOpacity, visible: heroLogoVisible };
                localStorage.setItem('hero-logo-config', JSON.stringify(config));
                saveConfigToServer('__hero_logo_config', config);
                setHeroLogoModalOpen(false);
              }}>Speichern</button>
            </div>
          </div>
        </div>
      )}

      {/* Hero BG Carousel Sidebar */}
      <div className={`c-sidebar-panel${heroBgModalOpen ? ' open' : ''}`}>
        <div className="c-sidebar-panel-header">
          <h3>Hero Hintergrund</h3>
          <button onClick={() => setHeroBgModalOpen(false)} className="c-sidebar-panel-close">&times;</button>
        </div>
        <div className="c-sidebar-panel-body">
          <div className="c-loader-modal-group">
            <label>Bilder (max. 4) — Karussell alle 4 Sek.</label>
            {heroBgImages.map((img, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                <div style={{ width: 60, height: 40, borderRadius: 6, backgroundImage: `url('${img}')`, backgroundSize: 'cover', backgroundPosition: 'center', border: '1px solid rgba(0,0,0,0.1)', flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 11, color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{img.split('/').pop()}</span>
                {heroBgImages.length > 1 && (
                  <button onClick={() => setHeroBgImages(heroBgImages.filter((_, j) => j !== i))} style={{ background: 'rgba(201,54,44,0.1)', color: 'var(--rose)', border: 'none', borderRadius: 6, width: 32, height: 32, cursor: 'pointer', fontSize: 16, flexShrink: 0 }}>&times;</button>
                )}
              </div>
            ))}
            {heroBgImages.length < 4 && (
              <label style={{ display: 'block', background: 'rgba(76,175,80,0.1)', color: '#4CAF50', border: '1px solid rgba(76,175,80,0.3)', borderRadius: 8, padding: '10px 16px', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--sans)', width: '100%', marginTop: 4, textAlign: 'center' }}>
                + Bild hochladen
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const fd = new FormData();
                  fd.append('image', file);
                  fd.append('field', 'hero-bg-' + Date.now());
                  try {
                    const res = await fetch('/api/upload', { method: 'POST', body: fd });
                    const data = await res.json();
                    if (data.path) {
                      setHeroBgImages(prev => [...prev, data.path]);
                    }
                  } catch (err) {
                    console.error('Upload failed:', err);
                  }
                  e.target.value = '';
                }} />
              </label>
            )}
          </div>
          <div className="c-loader-modal-preview" style={{ marginTop: 16 }}>
            <label>Vorschau</label>
            <div style={{ display: 'flex', gap: 6, overflowX: 'auto' }}>
              {heroBgImages.filter(u => u).map((img, i) => (
                <div key={i} style={{ width: 80, height: 50, borderRadius: 8, backgroundImage: `url('${img}')`, backgroundSize: 'cover', backgroundPosition: 'center', border: i === heroBgIndex ? '2px solid var(--rose)' : '1px solid rgba(0,0,0,0.1)', flexShrink: 0 }} />
              ))}
            </div>
          </div>
          <div style={{ marginTop: 20, borderTop: '1px solid #eee', paddingTop: 16 }}>
            <div className="c-loader-modal-group">
              <label>Overlay Farbe</label>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input type="color" value={heroBgOverlayColor} onChange={(e) => setHeroBgOverlayColor(e.target.value)} />
                <span style={{ fontSize: 13, color: '#888' }}>{heroBgOverlayColor}</span>
              </div>
            </div>
            <div className="c-loader-modal-group">
              <label>Overlay Intensität ({Math.round(heroBgOverlayOpacity * 100)}%)</label>
              <input type="range" min="0" max="1" step="0.05" value={heroBgOverlayOpacity} onChange={(e) => setHeroBgOverlayOpacity(parseFloat(e.target.value))} style={{ width: '100%' }} />
            </div>
          </div>
        </div>
        <div className="c-sidebar-panel-footer">
          <button className="c-loader-modal-save" onClick={() => {
            const filtered = heroBgImages.filter(u => u.trim());
            if (filtered.length === 0) return;
            setHeroBgImages(filtered);
            setHeroBgIndex(0);
            localStorage.setItem('hero-bg-images', JSON.stringify(filtered));
            saveConfigToServer('__hero_bg_images', filtered);
            const overlayConfig = { color: heroBgOverlayColor, opacity: heroBgOverlayOpacity };
            localStorage.setItem('hero-overlay-config', JSON.stringify(overlayConfig));
            saveConfigToServer('__hero_overlay', overlayConfig);
            setHeroBgModalOpen(false);
          }}>Speichern</button>
        </div>
      </div>
      {heroBgModalOpen && <div className="c-sidebar-panel-overlay" onClick={() => setHeroBgModalOpen(false)} />}

      {/* Chips Config Modal */}
      {chipsModalOpen && (
        <div className="c-loader-modal-overlay" onClick={() => setChipsModalOpen(false)}>
          <div className="c-loader-modal" onClick={(e) => e.stopPropagation()}>
            <div className="c-loader-modal-header">
              <h3>Floating Chips</h3>
              <button onClick={() => setChipsModalOpen(false)} className="c-loader-modal-close">&times;</button>
            </div>
            <div className="c-loader-modal-body">
              <div className="c-loader-modal-group">
                <label>Farbe</label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input type="color" value={evtChipsColor} onChange={(e) => setEvtChipsColor(e.target.value)} />
                  <span style={{ fontSize: 13, color: '#888' }}>{evtChipsColor}</span>
                </div>
              </div>
              <div className="c-loader-modal-group">
                <label>Intensität ({Math.round(evtChipsOpacity * 100)}%)</label>
                <input type="range" min="0.05" max="1" step="0.05" value={evtChipsOpacity} onChange={(e) => setEvtChipsOpacity(parseFloat(e.target.value))} style={{ width: '100%' }} />
              </div>
              <div className="c-loader-modal-group">
                <label>Wörter (eines pro Zeile)</label>
                <textarea
                  className="c-loader-modal-input"
                  style={{ height: 180, resize: 'vertical' }}
                  value={evtChips.join('\n')}
                  onChange={(e) => setEvtChips(e.target.value.split('\n').filter(w => w.trim()))}
                />
              </div>
              <div className="c-loader-modal-preview">
                <label>Vorschau</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: 16, background: '#f9f5ef', borderRadius: 12 }}>
                  {evtChips.map((w, i) => (
                    <span key={i} style={{ fontFamily: 'var(--serif)', fontSize: 20, fontStyle: 'italic', color: evtChipsColor, opacity: evtChipsOpacity }}>{w}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="c-loader-modal-footer">
              <button className="c-loader-modal-save" onClick={() => {
                const chipsConfig = { chips: evtChips, color: evtChipsColor, opacity: evtChipsOpacity };
                localStorage.setItem('events-chips-config', JSON.stringify(chipsConfig));
                saveConfigToServer('__chips_config', chipsConfig);
                setChipsModalOpen(false);
              }}>Speichern</button>
            </div>
          </div>
        </div>
      )}

      {/* Cookie Banner */}
      {showCookie && (
        <div className="c-cookie-banner" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 99998, background: 'rgba(28,28,28,0.95)', backdropFilter: 'blur(12px)', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, margin: 0, fontFamily: 'var(--sans)', lineHeight: 1.5 }}>Diese Website verwendet Cookies, um Ihnen die bestmögliche Erfahrung zu bieten.</p>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexShrink: 0 }}>
            <button onClick={() => { localStorage.setItem('cookie-accepted', '1'); setShowCookie(false); }} style={{ padding: '8px 20px', borderRadius: 20, border: 'none', background: 'var(--rose)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--sans)' }}>Akzeptieren</button>
            <a href="#" onClick={(e) => { e.preventDefault(); setLegalModal('datenschutz'); }} style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, textDecoration: 'underline', fontFamily: 'var(--sans)' }}>Mehr erfahren</a>
          </div>
        </div>
      )}

      {/* Legal Modal */}
      {legalModal && (
        <div className="c-loader-modal-overlay" onClick={() => setLegalModal(null)}>
          <div className="c-loader-modal c-legal-modal" onClick={(e) => e.stopPropagation()}>
            <div className="c-loader-modal-header">
              <h3>{legalModal === 'datenschutz' ? 'Datenschutzerklärung' : 'AGB'}</h3>
              <button onClick={() => setLegalModal(null)} className="c-loader-modal-close">&times;</button>
            </div>
            <div className="c-loader-modal-body">
              {isEditorMode ? (
                <textarea
                  className="c-legal-textarea"
                  value={legalModal === 'datenschutz' ? datenschutzText : agbText}
                  onChange={(e) => {
                    if (legalModal === 'datenschutz') setDatenschutzText(e.target.value);
                    else setAgbText(e.target.value);
                  }}
                />
              ) : (
                <div className="c-legal-content">
                  {(legalModal === 'datenschutz' ? datenschutzText : agbText).split('\n').map((line, i) => (
                    <p key={i}>{line || '\u00A0'}</p>
                  ))}
                </div>
              )}
            </div>
            {isEditorMode && (
              <div className="c-loader-modal-footer">
                <button className="c-loader-modal-save" onClick={() => {
                  if (legalModal === 'datenschutz') {
                    localStorage.setItem('legal-datenschutz', datenschutzText);
                    saveConfigToServer('__legal_datenschutz', datenschutzText);
                  } else {
                    localStorage.setItem('legal-agb', agbText);
                    saveConfigToServer('__legal_agb', agbText);
                  }
                  setLegalModal(null);
                }}>Speichern</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Template Editor */}
      <TemplateEditor
        templateId="espanol"
        clientId="demo"
        apiEndpoint="/api/"
      />
    </>
  );
}
