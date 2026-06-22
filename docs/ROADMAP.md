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

### Iteración 4 — Diccionario de Acordes
- [x] Diagramas SVG para guitarra + piano de 50+ acordes
- [x] Auto-generación de notas de piano para cualquier acorde (7ª, sus, dim, aug)
- [x] Modal al tocar un acorde en la letra

### Iteración 5 — Modo Presentación / Proyector
- [x] Botón Monitor en HymnDetailScreen
- [x] Fondo negro, letra blanca 1.8x, sin acordes

### Iteración 6 — Notas Privadas por Canción
- [x] `songNotes` en el store de Zustand
- [x] Modal de edición de texto desde el menú de opciones
- [x] Persistencia y backup

### Iteración 7 — Estadísticas de Uso
- [x] Contador de reproducciones (`songPlayCount`)
- [x] Pestaña "Populares" en HomeScreen
- [x] Badge de conteo en las tarjetas

### Fases 0-13 del SDLC
- [x] Visión, Requerimientos, Arquitectura, Diseño, DB, Seguridad
- [x] Testing (45 tests unitarios)
- [x] CI/CD (GitHub Actions con tsc + eslint + test + audit)
- [x] Observabilidad (ErrorBoundary)
- [x] Mantenimiento (bitácora, versionado, ADR)

---

## 🔲 BACKLOG FUTURO

### Ideas para próximas versiones
- Controles de avance de estrofa con gestos en Modo Proyector
- Más diagramas de guitarra (variantes con cejilla en diferentes posiciones)
- Sincronización entre dispositivos (vía archivo compartido)
- Modo oscuro por horario automático
- Más idiomas para el scraper

---

## 🧭 FASES DEL SDLC APLICADAS A ESTE PROYECTO

| Fase | Nombre | Estado |
|---|---|---|
| 0 | Visión del Producto | ✅ Documentado |
| 1 | Requerimientos | ✅ Documentado |
| 2 | Arquitectura | ✅ Definida |
| 3 | Diseño Técnico | ✅ Implementado |
| 4 | Desarrollo | ✅ Completo |
| 5 | Base de Datos | ✅ AsyncStorage (Offline) |
| 6 | Testing | ✅ 45 tests |
| 7 | Ciberseguridad | ✅ Sin datos sensibles |
| 8 | Docker | ⬛ N/A (app móvil) |
| 9 | CI/CD | ✅ GitHub Actions |
| 10 | Cloud | ⬛ N/A (100% offline) |
| 11 | Observabilidad | ✅ ErrorBoundary |
| 12 | Escalabilidad | ⬛ N/A (escala local) |
| 13 | Mantenimiento | ✅ Activo (bitácora) |
