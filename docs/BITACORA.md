# Bitácora del Proyecto — AppHimnario
*(Changelog profesional por iteración Agile)*

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
