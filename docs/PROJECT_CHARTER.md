# Documento de Visión y Requerimientos (Project Charter)

**Proyecto:** AppHimnario  
**Versión:** 1.2.0  
**Última actualización:** 2026-06-17  
**Metodología:** Agile / Scrum (iteraciones cortas, entrega continua de valor)

---

## FASE 0 — VISIÓN DEL PRODUCTO

### Problema que resuelve
Los grupos de alabanza y músicos de iglesia necesitan acceder a letras de himnos y canciones **con sus acordes musicales durante los ensayos y servicios**, sin depender de conexión a internet, de hojas impresas desordenadas, ni de plataformas externas que no están adaptadas a su flujo de trabajo en vivo.

### Público Objetivo (Usuarios)
- **Usuario Principal:** Músico del grupo de alabanza (guitarra, piano, bajo, batería).
- **Usuario Secundario:** Director de alabanza o líder de worship.
- **Uso:** Ensayos semanales, cultos de domingo, vigilias, eventos especiales.

### Objetivo de Negocio / Valor
Construir una herramienta musical profesional, rápida, 100% offline y personalizable que mejore la experiencia de preparación y ejecución del repertorio musical en una iglesia.

### Monetización (actual)
- Herramienta interna / comunitaria. No monetiza directamente.
- Potencial futuro: licencia para otras iglesias.

### Riesgos Identificados
| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| Canciones importadas con formato incorrecto | Alta | Parser robusto + filtros de limpieza |
| Pérdida de datos del usuario | Media | Sistema de Backup/Restore local (JSON) |
| Incompatibilidad de dependencias npm | Alta | `--legacy-peer-deps` documentado |

---

## FASE 1 — REQUERIMIENTOS

### Requerimientos Funcionales (Implementados ✅)
1. **Catálogo base de himnos** con número, título, letra y acordes.
2. **Motor de transposición de acordes** (semitonos + y -).
3. **Importador Web (Scraper):** Importa canciones desde URLs externas (LaCuerda.net).
4. **Categorización:** Alabanza / Adoración. Editable por canción.
5. **Sistema de Favoritos.**
6. **Repertorios (Setlists):** Crear, gestionar y organizar listas de canciones por culto/ensayo.
7. **Modo Oscuro / Claro** con persistencia.
8. **Metrónomo visual** con BPM guardado por canción.
9. **Auto-scroll** para lectura en vivo sin tocar la pantalla.
10. **Búsqueda inteligente** (Fuzzy Search con Fuse.js, tolerante a errores).
11. **Modo Inmersivo:** Ocultar interfaz con un toque para lectura sin distracciones.
12. **Tipografía personalizable:** Moderna (Sans), Clásica (Serif), Exacta (Mono).
13. **Zoom con dedos (Pinch-to-Zoom)** para ajustar el tamaño de la letra.
14. **Copia de Seguridad (Backup/Restore):** Exportar e importar toda la biblioteca como archivo JSON.

### Requerimientos Funcionales (Backlog — Pendiente 🔲)
1. **Diccionario Visual de Acordes:** Visualización gráfica del diagrama de acordes para guitarra.
2. **Modo Presentación (Proyector):** Vista limpia del himno para proyectar en pantalla grande.
3. **Estadísticas de uso:** Canciones más cantadas, historial de repertorios.
4. **Notas privadas por canción:** El músico puede añadir anotaciones personales.

### Requerimientos No Funcionales
| Requerimiento | Descripción |
|---|---|
| **Disponibilidad** | 100% Offline. Sin dependencia de red para el uso core. |
| **Performance** | Transposición instantánea. Carga de lista < 300ms. |
| **Persistencia** | Zustand + AsyncStorage (`himnario-storage`). |
| **UX/UI** | Diseño moderno (NativeWind/Tailwind), Modo Oscuro nativo. |
| **Seguridad** | Sin datos sensibles de usuario. Sin servidor externo. |

---

## FASE 2 — ARQUITECTURA

### Decisiones Arquitectónicas
- **Arquitectura:** Monolito modular (Clean por capas). Apropiada para app móvil de esta escala.
- **Framework:** React Native + Expo SDK 54.
- **Estilos:** NativeWind v2 (Tailwind para React Native).
- **Estado Global:** Zustand con middleware `persist` (AsyncStorage).
- **Navegación:** React Navigation (Stack + Bottom Tabs).
- **Principios aplicados:** Separation of Concerns, DRY, KISS.

### Estructura de Capas
```
src/
├── data/          # Capa de Datos (himnos base - estáticos)
├── store/         # Capa de Estado Global (Zustand)
├── services/      # Capa de Servicios (ScraperService)
├── utils/         # Capa de Utilidades (ChordTransposer, LyricsParser)
├── screens/       # Capa de Presentación (UI)
└── navigation/    # Capa de Navegación
```
