# Bitácora del Proyecto — AppHimnario
*(Changelog profesional por iteración Agile)*

---

## [1.8.0] — 2026-06-22 | Rediseño HomeScreen: Botones de filtro visuales
### HomeScreen — Nuevo diseño
- **Reemplazo de tabs horizontales** por **3 botones grandes**: Adoración, Alabanza, Favoritos.
- Cada botón tiene icono distintivo (Cross, Music2, Heart), color propio (violeta, rosa, rojo), y badge con conteo.
- Animación spring al activar (MotiView scale 1.1x).
- Fondo activo con color sólido + icono blanco; inactivo con fondo translúcido.
- Al seleccionar un filtro, aparece indicador "Mostrando: X" con botón X para limpiar.
- Tocar el mismo filtro lo desactiva (vuelve a "Todos").
- Se eliminó `songPlayCount` del HomeScreen (ya no se necesita sin pestaña Populares).

---

## [1.7.0] — 2026-06-22 | Fases Profesionales: Diseño, Testing, Seguridad, CI/CD, Observabilidad
### Fase 3 — Diseño Técnico (Profesional ✅)
- `docs/COMPONENT_DESIGN.md`: árbol de componentes, flujo de pantallas, flujo de datos con diagramas ASCII, ciclos de vida (transposición y persistencia), patrones de UI reutilizables.

### Fase 1 — Requerimientos (Profesional ✅)
- `docs/USER_STORIES.md`: 19 user stories formateadas "Como... quiero... para..." con criterios de aceptación y priorización.

### Fase 2 — Arquitectura (Profesional ✅)
- `ADR-002.md`: Navegación — Stack + BottomTabs, por qué NativeStack sobre JS Stack.
- `ADR-003.md`: Estado global — por qué Zustand sobre Redux/Jotai/Context, patrón de selectores.
- `ADR-004.md`: Estrategia de testing — Jest 29, pirámide, mocking, coverage thresholds.

### Fase 6 — Testing (Profesional ✅)
- **84 tests unitarios** (antes 31, ahora +53 nuevos).
- Tests nuevos: `useAppStore` (32 tests), `extractChords` (6 tests), `useIsDarkMode` (6 tests), `chordDiagrams` (14 tests).
- Coverage thresholds: statements 70%, branches 60%, functions 70%, lines 70%.
- **Cobertura real**: statements 86%, branches 77%, functions 88%, lines 87%.
- `jest.setup.js`: mock global de AsyncStorage.
- `coverageThreshold` configurado en `jest.config.js`.

### Fase 7 — Seguridad (Profesional ✅)
- `npm audit` en CI (GitHub Actions).
- `CodeQL` scanning en CI (javascript, security-events write).
- `.github/PULL_REQUEST_TEMPLATE.md`: checklist profesional (tests, tsc, lint).
- `.github/ISSUE_TEMPLATE/bug_report.md` + `feature_request.md`.

### Fase 9 — CI/CD (Profesional ✅)
- GitHub Actions con 2 jobs: `quality` (tsc + eslint + test + audit) + `codeql` (SAST).

### Fase 11 — Observabilidad (Profesional ✅)
- `src/utils/logger.ts`: logger con niveles (info/warn/error), timestamps, prefijo [Himnario]. Silencia info en producción vía `__DEV__`.
- `measureTime()`: mide performance de operaciones críticas, advierte si excede 16ms (frame budget).
- `ErrorBoundary` ahora usa logger en lugar de console.error.
- `scraperService` ahora usa logger en lugar de console.log.

### Testing — Logger cubierto
- Los tests del scraper ejercitan `logger.info()` indirectamente.
- `logger.ts` tiene 38% de cobertura directa (aceptable — es infraestructura).

---

## [1.6.0] — 2026-06-22 | Iteraciones 4-7: Acordes, Proyector, Notas, Estadísticas
### Iteración 4 — Diccionario de Acordes
- **Expansión masiva**: 50+ diagramas de guitarra con posiciones de cejilla (todos los tonos naturales + sostenidos/bemoles + 7ª, maj7, m7).
- **Piano automático**: `generatePianoNotes()` genera teclas iluminadas para cualquier acorde (7ª, m7, sus4, dim, aug, dim7, m7b5) desde teoría musical — sin diagrama manual requerido.
- **Fallback inteligente**: Si no hay diagrama de guitarra, muestra solo el teclado de piano con las teclas correctas presionadas.
- **14 tests nuevos** para `chordDiagrams.test.ts`.

### Iteración 5 — Modo Presentación / Proyector
- Botón Monitor en HymnDetailScreen: fondo negro, letra blanca, fuente 1.8x, sin acordes.
- Ideal para proyectar en pantalla grande durante el culto.

### Iteración 6 — Notas Privadas por Canción
- Nuevo campo `songNotes: Record<string, string>` en el store de Zustand.
- Modal de edición de texto multilínea accesible desde el menú "Opciones" → "Notas".
- Persistencia automática con AsyncStorage + incluido en backup/restore.

### Iteración 7 — Estadísticas de Uso
- `incrementPlayCount()` se dispara al abrir cualquier canción.
- Nueva pestaña **"Populares"** en HomeScreen: ordena canciones por número de reproducciones.
- Badge con el conteo visible en cada tarjeta dentro de la pestaña Populares.

### Testing
- **45 tests unitarios** pasando (14 nuevos de chordDiagrams).
- **0 errores TypeScript**, **0 warnings ESLint**.

---

## [1.5.0] — 2026-06-22 | Fase 4 (Pre-commit), Documentación Técnica, Mejora CI/CD
### Pre-commit Hooks (Fase 4)
- **Husky + lint-staged**: `pre-commit` ejecuta `npx lint-staged` (eslint + tests) sobre archivos staged.
- `.husky/pre-commit`: hook configurado y funcional.
- `.husky/.gitignore`: excluye directorio `_` interno.

### Documentación Técnica
- `docs/ADR-001.md`: Architecture Decision Record — documenta decisiones clave (monolito, Zustand, NativeWind v2, scraper, transposición).
- `docs/SCHEMA.md`: Esquema de AsyncStorage con interfaces TypeScript completas (AppState, ScrapedSong, Setlist).

### CI/CD (Fase 9 — mejora)
- `.github/workflows/ci.yml` ahora ejecuta: TypeScript check (`tsc --noEmit`), ESLint, tests, y `npm audit`.
- Cache de npm para acelerar ejecuciones.
- Corre en PRs además de push a main.

### TypeScript & Linting
- **Fix TypeScript errors (6)**: agregado `isCustom?: boolean` a interfaz `Hymn`, argumentos iniciales para `useRef`.
- **Migración ESLint a flat config**: `.eslintrc.js` → `eslint.config.js` (ESLint v10 compatible).
- **0 errores, 0 warnings** en ESLint (con varsIgnorePattern + caughtErrors).
- **TypeScript check (`tsc --noEmit`)**: 0 errores.

---

## [1.4.0] — 2026-06-19 | Fases 9 a 13: CI/CD, Cloud, Mantenimiento
### CI/CD (Fase 9)
- **GitHub Actions** configurado en `.github/workflows/ci.yml`.
- En cada push a `main` corre: `npm install --legacy-peer-deps` + `npm test`.
- Escaneo semanal de dependencias con Dependabot.

### Observabilidad (Fase 11)
- **ErrorBoundary** (`src/components/ErrorBoundary.tsx`): captura errores de renderizado en toda la app y muestra pantalla amigable con botón de reintentar.
- Envuelve el contenido de `App.tsx` para protección global.

### Cloud (Fase 10) y Escalabilidad (Fase 12)
- Backup/restore JSON desde Ajustes (completado en iteración anterior).
- Rendimiento: FlashList, memo, useMemo ya implementados.

### Nuevas Funcionalidades
- **Burbuja flotante de acordes**: círculo con número de acordes en la esquina derecha de la pantalla de canción. Al tocarlo, despliega la lista completa. Se actualiza automáticamente al subir/bajar de tono.
- **`extractChords.ts`**: utilidad que extrae acordes únicos desde `parsedLines` y aplica transposición.

### Mantenimiento (Fase 13)
- Versionado semántico estable (v1.4.0).
- ESLint configurado (`.eslintrc.js`) con TypeScript.
- Toda la documentación en `docs/` actualizada.

---

## [1.3.0] — 2026-06-19 | Fase 6 y 7: Testing y Seguridad
### Testing (Fase 6)
- **Jest + jest-expo** configurados con 31 tests unitarios pasando.
- **chordTransposer.test.ts** (11 tests): transposición inglés/español, sostenidos, bemoles, sufijos, envolvente de octava.
- **lyricsParser.test.ts** (9 tests): parseo de acordes inline, detección de líneas de acordes, texto plano, conversión a inline.
- **scraperService.test.ts** (6 tests): extracción de `<pre>`, limpieza de footer, manejo de errores HTTP y de red.
- **Corrección de bugs**: regex de acordes prioriza nombres españoles, `transposeLine` solo transpone corchetes cuando hay brackets en la línea.
- `jest.config.js` con `testPathIgnorePatterns` para excluir archivos sueltos.

### Seguridad (Fase 7)
- `.github/dependabot.yml`: escaneo semanal de dependencias npm con `--legacy-peer-deps`.
- `SECURITY.md`: política de seguridad del repositorio.
- ESLint instalado (`@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin`).
- `.gitignore` verificado: sin fugas de secretos, builds, IDE o `.env`.

### Rediseño de Tema Oscuro/Claro
- **Nuevo hook `useIsDarkMode`**: resuelve correctamente el modo `'system'` usando `useColorScheme()`.
- **Paleta renovada**: fondos cálidos en modo claro (#F7F4F0), púrpura profundo en oscuro (#0B0815), violetas y rosas vibrantes.
- **App.tsx**: ahora espera la hidratación de Zustand antes de renderizar (elimina flash de tema).
- **Bug fix**: se agregó `toggleTheme` al store de Zustand que faltaba en la interfaz.
- **Todas las pantallas** actualizadas para usar `useIsDarkMode()` en lugar de la selectora directa.

---

## [1.2.0] — 2026-06-17 | Iteración 3: UX Premium
### Nuevas Funcionalidades
- **Búsqueda Inteligente (Fuzzy Search):** Se integró la librería `fuse.js`. El motor de búsqueda ahora tolera errores ortográficos y busca tanto en título como en letra de las canciones.
- **Modo Inmersivo:** Al tocar el centro de la pantalla de un himno, la interfaz (cabecera, controles) desaparece con animación suave (`MotiView`), dejando solo la letra. Un segundo toque la restaura.
- **Tipografía Personalizable:** Se añadió el estado `fontFamily: 'sans' | 'serif' | 'mono'` al store de Zustand. El usuario puede elegir entre 3 estilos de letra en la pantalla de Ajustes y el cambio se aplica globalmente.
- **Zoom con Pellizco (Pinch-to-Zoom):** Integración de `PinchGestureHandler` de `react-native-gesture-handler` para ajustar el tamaño de la letra con dos dedos directamente en la pantalla de la canción.

### Cambios Técnicos
- `HomeScreen.tsx`: Importación y uso de `Fuse.js` en el `useMemo` de filtrado.
- `useAppStore.ts`: Nuevo campo `fontFamily` en la interfaz y estado, con su método `setFontFamily`.
- `SettingsScreen.tsx`: Nueva sección "TIPOGRAFÍA" con 3 botones de selección reactivos al store.
- `HymnDetailScreen.tsx`: Integración de `PinchGestureHandler`, `isImmersiveMode` y uso dinámico de `fontClass` en todos los textos de la canción.

---

## [1.1.0] — 2026-06-17 | Iteración 2: Organización y Herramientas en Vivo
### Nuevas Funcionalidades
- **Auto-Scroll:** Desplazamiento automático de la letra sin tocar la pantalla para músicos en vivo.
- **Metrónomo Visual:** Pulso visual configurado por BPM, con memoria de velocidad por canción (guardado en el store).
- **Sistema de Repertorios (Setlists):** Reemplazo completo del sistema de Favoritos por Repertorios. Creación, gestión y eliminación de listas personalizadas (ej. "Culto de Domingo", "Ensayo Voces").
- **Añadir a Repertorio:** Modal bottom-sheet en `HymnDetailScreen` para agregar la canción actual a cualquier repertorio creado.
- **Copia de Seguridad (Backup/Restore):** Sistema de exportación e importación de toda la biblioteca como archivo `himnario_backup.json`, sin dependencia de servidores externos.
- **Categorías:** Filtros de Alabanza / Adoración. Cada canción puede reasignarse a una categoría diferente desde su pantalla de detalle.

### Cambios Técnicos
- `useAppStore.ts`: Nuevas interfaces `Setlist`, nuevos campos `setlists`, `songBPMs`, métodos CRUD para setlists y `restoreBackup`.
- `SetlistsScreen.tsx`: Nueva pantalla principal de Repertorios (reemplaza FavoritesScreen).
- `SetlistDetailScreen.tsx`: Pantalla de detalle de un repertorio.
- `BottomTabNavigator.tsx`: Pestaña "Favoritos" sustituida por "Repertorios".
- `AppNavigator.tsx`: Nueva ruta para `SetlistDetailScreen`.
- `SettingsScreen.tsx`: Nueva sección de Copia de Seguridad.

### Dependencias Añadidas
- `expo-file-system`, `expo-document-picker`, `expo-sharing` (con `--legacy-peer-deps`)

---

## [1.0.0] — 2026-06-09 | Iteración 1: Fundación y MVP
### Funcionalidades MVP
- Catálogo base de himnos en `src/data/hymns.ts`.
- Motor de transposición de acordes (`src/utils/chordTransposer.ts`). Algoritmo de aritmética modular base-12.
- Scraper de canciones web (`src/services/scraperService.ts`). Extrae letras/acordes de HTML con regex.
- Importación de canciones desde URL directa (LaCuerda.net).
- Sistema de Favoritos con persistencia.
- Modo Oscuro / Claro con persistencia.
- Visualización de letra con y sin acordes.
- Zoom de texto (botones + y -).

### Setup Técnico
- **Framework:** Expo SDK 54, React Native 0.81.5, React 19.1.0.
- **Estilos:** NativeWind v2 con TailwindCSS 3.3.2.
- **Estado:** Zustand + AsyncStorage (`himnario-storage`).
- **Navegación:** React Navigation (Stack + BottomTabs).
- **UI Extras:** `@shopify/flash-list`, `moti`, `lucide-react-native`.
- **Primer commit** a GitHub con `.gitignore` profesional.
- **Documentación inicial:** `docs/PROJECT_CHARTER.md`, `docs/METHODOLOGY.md`, `docs/BITACORA.md`.
