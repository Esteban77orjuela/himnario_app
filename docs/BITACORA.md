# Bitácora del Proyecto — AppHimnario
*(Changelog profesional por iteración Agile)*

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
