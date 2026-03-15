# El Español — Spanisches Restaurant & Tapas Bar

Website para **El Español**, restaurante español y tapas bar ubicado en Buchs SG, Suiza.

**Live:** [https://espanol-lac.vercel.app](https://espanol-lac.vercel.app)

---

## Sobre el proyecto

Web moderna y elegante para un restaurante español con sistema de edicion visual integrado. Permite al administrador modificar textos, imagenes, colores y contenido directamente desde el navegador sin necesidad de tocar codigo.

### Funcionalidades principales

- **Pagina principal** con secciones: Hero, Sobre nosotros, Estadisticas, Speisekarte (carta), Platos Estrella, Galeria, Eventos, Testimonios, Contacto y Footer
- **Template Editor visual** — sistema de edicion inline activable con codigo de acceso. Permite editar textos, imagenes, colores de fondo, links, mapa y logo directamente en la web
- **Carta digital** — menu completo con categorias (Vorspeisen, Hauptgerichte, Desserts, Getranke, Weine) editables desde el panel admin
- **Eventos privados** — seccion con imagen expandible en modal
- **Galeria** — grid de imagenes con scroll horizontal en movil
- **Loader configurable** — pantalla de carga con logo animado, textos y colores editables desde admin
- **Floating chips** — palabras decorativas flotantes con texto, color e intensidad configurables
- **Boton WhatsApp** — boton flotante para reservas por WhatsApp con numero editable
- **Cookie banner** — aviso de cookies discreto con enlace a politica de privacidad
- **Paginas legales** — Datenschutz (privacidad) y AGB (terminos) con textos editables en modo admin
- **SEO optimizado** — metadatos completos, Open Graph, geo-localizacion
- **Responsive** — diseno adaptado a movil, tablet y desktop
- **Animaciones** — scroll animations (fade-up), parallax, efectos hover, loader animado

### Stack tecnico

- **Next.js 16** (App Router, React 19)
- **TypeScript**
- **CSS** vanilla con custom properties
- **Google Fonts** (Cormorant Garamond + Outfit)
- **Template Editor** (vanilla JS) para edicion visual
- **API Routes** proxy a backend PHP para persistencia
- **Vercel** para hosting y deploy

### Modo editor

1. Hacer scroll hasta el footer
2. Pulsar el icono de lapiz verde
3. Introducir el codigo de acceso
4. Una vez activado, hacer clic en cualquier elemento editable para modificarlo
5. Los cambios se guardan automaticamente via API

### Configuracion

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build
npm run build
```

Variables de entorno (`.env.local`):

```
NEXT_PUBLIC_API_URL=https://tu-backend.com/php/
EDITOR_CODE=tu-codigo-secreto
```

---

Desarrollado con Next.js y desplegado en Vercel.
