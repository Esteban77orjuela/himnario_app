# Bitácora del Proyecto (Changelog)

Este documento registra cronológicamente los cambios, decisiones arquitectónicas, configuraciones e implementaciones realizadas en el proyecto, siguiendo metodologías ágiles.

## [1.0.0] - Inicio del Desarrollo Profesional
### Fase 0 - Visión y Setup Inicial
- **Configuración de Proyecto:** Inicialización de Expo SDK 52/54 con React Native 0.81.5 y React 19.1.0.
- **Limpieza de Caché y Dependencias:** Reconfiguración total del ecosistema tras conflictos de Babel y SVG. 
- **Estilos:** Configuración estable de NativeWind v2 con TailwindCSS 3.3.2.
- **Navegación:** Implementación inicial de `@react-navigation/native` (Stack y Bottom Tabs).
- **Metodología:** Integración de la estructura de las 13 Fases del SDLC profesional en el proyecto (`docs/METHODOLOGY.md`).

### Fase 1 - Definición de Requerimientos y Arquitectura Lógica
- **Project Charter:** Creación de `docs/PROJECT_CHARTER.md` documentando el MVP (100% offline, transposición de acordes, scraper web de canciones, favoritos, modo oscuro).
- **Diseño Arquitectónico (Planeación):** Definición de la estructura de la aplicación usando patrón por capas (`src/services`, `src/utils`, `src/store`).

### Fase 3 - Diseño Técnico (Ejecución)
- **Estructura de Carpetas:** Aprobación e inicialización del "Separation of Concerns" bajo la carpeta `/src`.

### Fase 4 - Desarrollo (Motor Musical)
- **Transposition Engine:** Creación de `src/utils/chordTransposer.ts`. Un algoritmo de aritmética modular (base 12) capaz de parsear, normalizar (bemoles a sostenidos) y transponer acordes dinámicamente preservando su sufijo musical.
- **Scraper Service:** Creación de `src/services/scraperService.ts` usando API `fetch` nativa y expresiones regulares para aislar etiquetas `<pre>` y extraer letras y acordes directamente del HTML.

*(Nota: Esta bitácora se actualizará con cada iteración bajo el framework de trabajo)*
