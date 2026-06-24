# AppHimnario

Aplicación móvil para músicos y líderes de alabanza que necesitan consultar letras con acordes, organizar repertorios y usar herramientas de apoyo musical desde el dispositivo, con enfoque offline y experiencia fluida para ensayo y servicio.

## Qué resuelve

En muchos contextos de iglesia, el repertorio se reparte entre hojas impresas, chats, capturas de pantalla y sitios web que no están pensados para usarse en vivo. AppHimnario busca centralizar esa experiencia en una app rápida, clara y utilizable durante la preparación y la ejecución musical.

## Funcionalidades actuales

- Catálogo base de himnos
- Visualización de letra con acordes
- Transposición por semitonos
- Búsqueda inteligente con `Fuse.js`
- Canciones favoritas
- Repertorios (`setlists`)
- Importación desde URL de LaCuerda
- Categorías por canción
- Modo oscuro / claro
- Tipografía configurable
- Zoom con gesto de pellizco
- Auto-scroll
- Metrónomo visual con BPM persistente
- Modo inmersivo
- Modo proyector
- Notas privadas por canción
- Diagramas de acordes para guitarra y piano
- Exportación e importación de backup

## Stack

- `React Native`
- `Expo SDK 54`
- `TypeScript`
- `Zustand` + `AsyncStorage`
- `React Navigation`
- `NativeWind`
- `FlashList`
- `Jest`
- `ESLint`
- `Husky` + `lint-staged`

## Instalación

Este proyecto ha requerido compatibilidad flexible entre algunas dependencias. Si `npm install` falla por `peerDependencies`, usa `--legacy-peer-deps`.

```bash
npm install --legacy-peer-deps
```

## Ejecución

```bash
npm start
```

Atajos disponibles:

```bash
npm run android
npm run ios
npm run web
```

## Scripts útiles

```bash
npm test
npx tsc --noEmit
npx eslint src/ --max-warnings 10
```

## Calidad actual

El proyecto cuenta con:

- pruebas unitarias con `Jest`
- validación de TypeScript
- linting con `ESLint`
- hooks de pre-commit con `Husky`
- CI en GitHub Actions
- escaneo de dependencias y CodeQL en CI

Estado verificado recientemente:

- `84` tests pasando
- `TypeScript` sin errores
- `ESLint` sin errores bloqueantes

## Estructura

```text
src/
├── components/   # Componentes reutilizables
├── data/         # Datos base y diccionarios
├── navigation/   # Navegación principal
├── screens/      # Pantallas de la aplicación
├── services/     # Servicios, por ejemplo scraper
├── store/        # Estado global con Zustand
└── utils/        # Utilidades y lógica de dominio
```

## Documentación interna

La carpeta `docs/` contiene el seguimiento profesional del proyecto:

- `PROJECT_CHARTER.md`: visión del producto
- `METHODOLOGY.md`: marco de trabajo SDLC
- `ROADMAP.md`: evolución funcional
- `BITACORA.md`: historial de cambios
- `USER_STORIES.md`: necesidades de usuario
- `ADR-001.md` a `ADR-004.md`: decisiones arquitectónicas
- `EVALUACION_PROFESIONAL_2026-06-22.md`: auditoría técnica y documental
- `PLAN_DESARROLLO_PROFESIONAL.md`: plan de continuidad

## Estado del repositorio

El proyecto tiene una base técnica sólida para una app móvil offline de pequeña o mediana escala. Aun así, quedan tareas en curso para terminar de pulirlo de forma completamente profesional:

- cerrar algunos detalles funcionales
- completar el backup de todo el estado relevante
- endurecer tipado en algunas pantallas
- sincronizar ciertos documentos con el estado real del código
- planificar una actualización mayor de dependencias más adelante

## Seguridad y dependencias

Actualmente no hay hallazgos altos en la verificación reciente de `npm audit --audit-level=high`, pero todavía existen vulnerabilidades moderadas transitivas que requieren una actualización mayor del stack para resolverse por completo. Por esa razón, no se recomienda aplicar `npm audit fix --force` sin una migración planificada.

## Licencia

Pendiente de definir.
