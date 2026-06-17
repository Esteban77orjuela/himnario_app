# Hoja de Ruta del Producto — AppHimnario
*(Roadmap Agile — Backlog ordenado por valor e impacto)*

---

## ✅ COMPLETADO

### Iteración 1 — Fundación MVP
- [x] Catálogo base de himnos
- [x] Motor de transposición de acordes
- [x] Importador web (Scraper LaCuerda)
- [x] Favoritos con persistencia
- [x] Modo Oscuro / Claro

### Iteración 2 — Herramientas en Vivo y Organización
- [x] Auto-scroll para lectura en vivo
- [x] Metrónomo visual con BPM por canción
- [x] Sistema de Repertorios (Setlists)
- [x] Categorías Alabanza / Adoración
- [x] Backup/Restore local (JSON)

### Iteración 3 — UX Premium
- [x] Búsqueda inteligente (Fuzzy Search con Fuse.js)
- [x] Modo Inmersivo (pantalla limpia)
- [x] Tipografía personalizable (3 estilos)
- [x] Zoom con pellizco (Pinch-to-Zoom)

---

## 🔲 PRÓXIMAS ITERACIONES (Backlog)

### Iteración 4 — Diccionario de Acordes (Alta prioridad)
*Valor: El músico puede aprender o recordar la posición de los acordes en la guitarra sin salir de la app.*
- [ ] Crear `src/data/chordDiagrams.ts` con posiciones SVG de acordes comunes (Do, Re, Mi, Fa, Sol, La, Si y sus variantes).
- [ ] Crear componente `ChordDiagramModal.tsx`.
- [ ] Al tocar un acorde en la letra, mostrar su diagrama visual.

### Iteración 5 — Modo Presentación / Proyector (Media prioridad)
*Valor: El director puede mostrar la letra en una pantalla grande durante el culto.*
- [ ] Vista simplificada de letra grande, sin acordes, sin controles.
- [ ] Opción de activar desde el detalle de la canción.
- [ ] Controles de avance de estrofa con gestos.

### Iteración 6 — Notas Privadas por Canción (Media prioridad)
*Valor: Cada músico puede añadir sus propias anotaciones (ej. "esta parte la cantamos 2 veces").*
- [ ] Campo de texto editable por canción en el store.
- [ ] Mostrar nota en la pantalla de detalle.

### Iteración 7 — Estadísticas de Uso (Baja prioridad)
*Valor: Visibilidad de qué canciones se usan más.*
- [ ] Contador de reproducciones por canción.
- [ ] Pantalla de "Más cantadas".

### Iteración 8 — Testing y Calidad (FASE 6 del SDLC)
*Valor: Garantizar que el motor de transposición nunca falla.*
- [ ] Configurar Jest para React Native.
- [ ] Pruebas unitarias para `chordTransposer.ts` (todos los tonos, bemoles, sostenidos).
- [ ] Pruebas unitarias para `lyricsParser.ts`.
- [ ] Pruebas unitarias para `scraperService.ts` (HTML mockeado).

### Iteración 9 — CI/CD con GitHub Actions (FASE 9 del SDLC)
*Valor: Cada push al repositorio es verificado automáticamente.*
- [ ] Crear `.github/workflows/ci.yml`.
- [ ] Pipeline: Instalar dependencias → Correr Linter (ESLint) → Correr Tests (Jest).

---

## 🧭 FASES DEL SDLC APLICADAS A ESTE PROYECTO

| Fase | Nombre | Estado |
|---|---|---|
| 0 | Visión del Producto | ✅ Documentado |
| 1 | Requerimientos | ✅ Documentado |
| 2 | Arquitectura | ✅ Definida |
| 3 | Diseño Técnico | ✅ Implementado |
| 4 | Desarrollo | 🔄 En progreso |
| 5 | Base de Datos | ✅ AsyncStorage (Offline) |
| 6 | Testing | 🔲 Pendiente |
| 7 | Ciberseguridad | ✅ Sin datos sensibles |
| 8 | Docker | ⬛ N/A (app móvil) |
| 9 | CI/CD | 🔲 Pendiente |
| 10 | Cloud | ⬛ N/A (100% offline) |
| 11 | Observabilidad | 🔲 Pendiente (Sentry) |
| 12 | Escalabilidad | ⬛ N/A (escala local) |
| 13 | Mantenimiento | 🔄 Activo (bitácora) |
