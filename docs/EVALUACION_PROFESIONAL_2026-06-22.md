# Evaluación profesional del proyecto — AppHimnario

**Fecha:** 2026-06-22  
**Tipo de revisión:** auditoría estática de código, configuración, documentación y estructura del repositorio  
**Alcance:** revisión completa de `docs/`, `src/`, configuraciones raíz, calidad documental, trazas de publicación pública y contraste con prácticas profesionales modernas

## Dictamen

El proyecto **sí tiene una base profesional real**. No es un proyecto improvisado: tiene visión de producto, backlog, ADRs, pruebas, CI, hooks de pre-commit, política de seguridad y una separación modular razonable para una app móvil offline.

La afirmación de que estas 14 fases aplican a “cualquier proyecto del mundo” es **verdadera solo como marco mental**, no como checklist rígido. Agile prioriza software funcionando, colaboración, adaptación y mejora continua, y Scrum se presenta como un marco liviano y adaptable para trabajo complejo, no como una receta única.[1][2] Además, NIST aclara que la seguridad debe integrarse al SDLC porque muchos modelos no la cubren de forma suficiente.[3] En la práctica, fases como Docker, Cloud, Observabilidad profunda y Escalabilidad masiva **dependen del contexto del producto** y no siempre deben implementarse con la misma intensidad.[2][4][5]

## Veredicto general

**Nivel actual:** semiprofesional alto, cercano a producción para un producto móvil offline de pequeña o mediana escala.  
**Nivel arquitectónico real:** bueno para una app Expo/React Native sin backend.  
**Nivel “senior/architect completo”:** todavía no.  
**Principal problema actual:** hay una diferencia entre lo que algunos documentos declaran y lo que el código realmente garantiza.

## Idea general del producto

AppHimnario resuelve una necesidad concreta: permitir a músicos y líderes de alabanza acceder a letras, acordes, repertorios y herramientas de apoyo musical desde el dispositivo, con operación principalmente offline y una experiencia pensada para ensayo y servicio.

Esa idea de negocio está bien conectada con el código en varios puntos:

- catálogo base de himnos
- importación de canciones desde LaCuerda
- transposición
- repertorios
- notas privadas
- metrónomo visual
- modo proyector
- backup local

La visión existe y es coherente con el producto actual.

## Hallazgos principales

### Lo más fuerte

- Existe visión del producto en `docs/PROJECT_CHARTER.md`.
- Existe metodología y estructura SDLC en `docs/METHODOLOGY.md`.
- Hay trazabilidad documental con `docs/BITACORA.md`, `docs/ROADMAP.md`, `docs/USER_STORIES.md` y ADRs.
- La arquitectura elegida es razonable para el contexto: monolito modular móvil, sin backend, con Zustand + AsyncStorage.
- El código tiene funcionalidades reales y no solo maquetas.
- Hay 84 pruebas unitarias distribuidas en 7 archivos de test.
- Hay CI en GitHub Actions con `tsc`, `eslint`, `jest`, `npm audit` y CodeQL.
- Hay hooks locales con Husky + `lint-staged`.
- No hay secretos visibles ni dependencia de un backend que complique la superficie de ataque.

### Lo más débil

- Falta `README` en la raíz, lo cual baja mucho la profesionalidad pública del repositorio.
- Existía `Chat.md`, que es una traza de conversación y **no debe estar en un repositorio profesional público**.
- Hay deriva documental: varios documentos no están completamente sincronizados con el estado real del código.
- La tipificación TypeScript no está cerrada: varias pantallas usan `any`.
- La navegación dice estar tipada, pero en la práctica no lo está completamente.
- El backup no exporta todo lo que el store realmente persiste.
- La observabilidad declarada es mayor que la observabilidad real.
- No hay validación dinámica en esta auditoría porque no se ejecutó terminal en esta sesión.

## Evaluación por fases

| Fase | Estado real | Evaluación |
|---|---|---|
| 0. Visión del producto | `Fuerte` | Bien planteada y coherente con el código |
| 1. Requerimientos | `Medio-Alto` | Existen, pero algunos criterios no están cerrados ni verificados contra UI |
| 2. Arquitectura | `Alto` | Correcta para app móvil offline; sobria y suficiente |
| 3. Diseño técnico | `Medio-Alto` | Hay estructura y documentación, pero no todo está tipado ni formalizado |
| 4. Desarrollo | `Alto` | Buenas bases de calidad local y CI |
| 5. Persistencia / datos | `Medio` | Funciona, pero falta versión de esquema y backup completo |
| 6. Testing | `Medio-Alto` | Muy buena base unitaria; faltan UI, E2E e integración real |
| 7. Seguridad / DevSecOps | `Medio` | Buen baseline, todavía no es DevSecOps maduro |
| 8. Docker / containers | `Contextual` | No es obligatorio hoy para este producto |
| 9. CI/CD | `Medio` | Hay CI clara; CD real aún no |
| 10. Cloud | `No aplica por ahora` | Producto local/offline; no debe forzarse |
| 11. Observabilidad | `Bajo-Medio` | Logger + ErrorBoundary ayudan, pero no equivalen a observabilidad completa |
| 12. Escalabilidad | `Contextual` | A escala local está bien; no hay problema distribuido que resolver aún |
| 13. Mantenimiento y evolución | `Medio-Alto` | Existe disciplina documental, pero con desalineaciones |

## Detalle por fase

### Fase 0 — Visión del producto

`docs/PROJECT_CHARTER.md` contiene problema, usuario, valor, monetización futura y riesgos. Eso está bien y sí corresponde a práctica profesional.

Fortaleza:

- la visión no es abstracta; conecta con el caso real de músicos de iglesia

Mejora necesaria:

- formalizar una versión breve y pública de esta visión en un `README.md`

### Fase 1 — Requerimientos

`docs/PROJECT_CHARTER.md` y `docs/USER_STORIES.md` muestran requerimientos funcionales y no funcionales. También existe backlog futuro.

Fortalezas:

- user stories reales
- backlog organizado
- enfoque funcional claro

Gaps:

- hay historias con criterios que no están implementados como están escritos
- ejemplo: `docs/USER_STORIES.md` menciona arrastrar canciones en repertorios, pero en `src/` no existe lógica de drag and drop ni reordenamiento
- falta una definición formal de criterios de aceptación por pantalla y por flujo crítico

### Fase 2 — Arquitectura

La arquitectura del proyecto es adecuada para el contexto. `docs/ADR-001.md`, `docs/ADR-002.md` y `docs/ADR-003.md` muestran decisiones sensatas: Expo + React Native, monolito modular, Zustand persistente, navegación por tabs + stack.

Juicio:

- para esta app, usar microservicios, Kafka, Kubernetes o cloud ahora sería sobreingeniería
- la arquitectura actual sí es profesional para un producto móvil offline de esta escala

### Fase 3 — Diseño técnico

Existe diseño técnico en `docs/COMPONENT_DESIGN.md` y `docs/SCHEMA.md`, y la estructura de carpetas es limpia.

Fortalezas:

- separación por `screens`, `services`, `store`, `utils`, `data`, `navigation`
- diseño centrado en dominio funcional

Debilidades:

- no hay contratos de navegación bien cerrados
- hay `any` en varias pantallas y en `restoreBackup`
- el tipado declarado en `src/navigation/AppNavigator.tsx` no coincide con todos los parámetros usados realmente

### Fase 4 — Desarrollo

Esta es una de las fases mejor resueltas:

- `eslint.config.js`
- `jest.config.js`
- `.husky/pre-commit`
- `package.json` con `lint-staged`
- CI en `.github/workflows/ci.yml`

Fortalezas:

- disciplina de calidad local
- pruebas sobre archivos modificados
- revisión automática básica en CI

Debilidades:

- `eslint` permite `any`
- `no-console` está desactivado
- siguen existiendo `console.error` directos en `src/screens/HymnDetailScreen.tsx` y `src/screens/SettingsScreen.tsx`

### Fase 5 — Persistencia / base de datos

Para este proyecto no hay base de datos tradicional; la persistencia local con AsyncStorage es válida. Eso no hace al proyecto “menos profesional”; simplemente cambia el tipo de diseño.

Fortalezas:

- persistencia consistente vía Zustand + AsyncStorage
- backup y restore existen

Debilidades críticas:

- `src/screens/SettingsScreen.tsx` exporta `customSongs`, `favorites`, `setlists`, `categoryOverrides` y `songBPMs`, pero **no exporta** `songNotes`, `songPlayCount`, `theme`, `fontFamily` ni `fontSize`
- `src/store/useAppStore.ts` sí está preparado para restaurar `songNotes` y `songPlayCount`
- por tanto, la promesa documental de “copia completa” no está completamente respaldada por el código

### Fase 6 — Testing

Aquí el proyecto está bien parado. Hay 84 pruebas unitarias repartidas entre utilidades, store, datos y servicio de scraping.

Fortalezas:

- buena cobertura de lógica de dominio
- store testeado
- scraper testeado
- utilidades críticas testeadas

Debilidades:

- no hay pruebas de componentes
- no hay E2E
- no hay pruebas reales de navegación
- no hay pruebas de backup/export/import completo desde UI

Observación documental importante:

- `docs/ADR-004.md` quedó desactualizado: allí todavía aparecen como pendientes pruebas que ya existen, y además menciona `ts-jest`, dependencia que no aparece en `package.json`

### Fase 7 — Seguridad / DevSecOps

La seguridad base es aceptable, pero no debe sobredeclararse. NIST recomienda integrar prácticas de desarrollo seguro dentro del SDLC porque muchos modelos no cubren seguridad suficientemente por sí solos.[3]

Fortalezas:

- `.gitignore` razonable
- `SECURITY.md`
- `dependabot.yml`
- `npm audit`
- CodeQL

Debilidades:

- no hay secret scanning explícito configurado en repo más allá de buenas prácticas
- no hay política de dependencias aprobadas
- no hay revisión formal de permisos del importador web
- no hay endurecimiento específico para inputs externos

Conclusión:

- hay una base buena de higiene de seguridad
- aún no corresponde llamar a esto “DevSecOps completo”

### Fase 8 — Docker y containers

No hay Dockerfile ni Compose. En este proyecto **no es un defecto inmediato**.

Juicio:

- Docker sirve muy bien para estandarizar entornos, empaquetar aplicaciones y reforzar flujos CI/CD.[4]
- pero para una app Expo móvil sin backend, en esta etapa, no es una prioridad crítica

Conclusión:

- `No implementado`, pero **tampoco es una carencia grave hoy**

### Fase 9 — CI/CD

Hay CI real, pero todavía no CD real.

Lo que sí existe:

- validación en push y pull request a `main`
- `tsc`
- `eslint`
- `jest`
- `npm audit`
- CodeQL

Lo que falta para hablar de CD más maduro:

- pipeline de release
- build de APK / AAB / IPA
- versionado sincronizado
- changelog/release artifact automatizado

### Fase 10 — Cloud

No hay cloud. Para este producto actual, eso **no es un problema**.

Forzar AWS, Azure o GCP ahora no aportaría valor al objetivo principal del negocio. Agile insiste en maximizar el valor y la simplicidad, y el trabajo debe adaptarse al contexto del producto.[1]

### Fase 11 — Observabilidad

Aquí el proyecto está parcialmente bien, pero los documentos lo presentan como más maduro de lo que realmente es.

Lo que sí existe:

- `src/components/ErrorBoundary.tsx`
- `src/utils/logger.ts`

Lo que no existe todavía:

- métricas de producto
- métricas técnicas
- trazas distribuidas
- correlación formal de eventos
- tableros o alertas

OpenTelemetry define observabilidad alrededor de señales como logs, métricas y trazas, y explica que los logs por sí solos no bastan para entender completamente el comportamiento del sistema.[5]

Conclusión:

- hay **manejo básico de errores y logging**
- no hay observabilidad plena

### Fase 12 — Escalabilidad

Para una app local/offline, la escalabilidad debe evaluarse de otra forma:

- rendimiento local
- tamaño de estado persistido
- capacidad de crecer en número de canciones
- mantenibilidad del código

Fortalezas:

- arquitectura simple
- `FlashList`
- `useMemo`
- store central

Límites:

- el scraping depende de HTML externo frágil
- el store crecerá sin versionado ni estrategia de migración
- no hay medición real de performance

### Fase 13 — Mantenimiento y evolución

Existe disciplina documental y eso es una gran fortaleza.

Fortalezas:

- `docs/BITACORA.md`
- `docs/ROADMAP.md`
- ADRs
- historias de usuario

Debilidades:

- deriva documental
- versiones desalineadas entre `docs/BITACORA.md`, `docs/PROJECT_CHARTER.md`, `package.json` y `app.json`

Ejemplo claro:

- `app.json` y `package.json` siguen en `1.0.0`
- la bitácora ya va por `1.8.0`

## Hallazgos técnicos concretos

### 1. Riesgo público / GitHub

`Chat.md` era un rastro directo de conversación y asistencia. Eso no debe vivir en un repositorio profesional público.

### 2. Bug funcional potencial en favoritos de canciones importadas

En `src/screens/ImportScreen.tsx`, la navegación a detalle inmediato de canción importada envía `hymn` e `isCustom`, pero no `hymnId`.  
En `src/screens/HymnDetailScreen.tsx`, la acción de favoritos usa `toggleFavorite(hymnId)`.

Eso puede provocar un favorito inconsistente o incorrecto para canciones importadas abiertas inmediatamente después de importarse.

### 3. Tipado incompleto

Hay uso de `any` en:

- `src/screens/HomeScreen.tsx`
- `src/screens/HymnDetailScreen.tsx`
- `src/screens/ImportScreen.tsx`
- `src/screens/SetlistsScreen.tsx`
- `src/screens/SetlistDetailScreen.tsx`
- `src/store/useAppStore.ts`

Para decir “TypeScript estricto profesional”, esto debe corregirse.

### 4. Tema inconsistente en navegación inferior

`src/navigation/BottomTabNavigator.tsx` calcula `isDarkMode` comparando solo `theme === 'dark'`, ignorando el caso `system`.  
Eso puede desalinear la barra inferior respecto al resto de la app, donde sí se usa `useIsDarkMode()`.

### 5. Backup incompleto

La exportación no incluye todo el estado útil del usuario. Este es uno de los hallazgos más importantes porque toca confiabilidad del producto.

### 6. Código y documentación desalineados

- `docs/ROADMAP.md` presenta varias fases como completas de forma demasiado optimista
- `docs/ADR-004.md` está parcialmente viejo
- hay historias de usuario cuyos criterios no reflejan exactamente la implementación actual

### 7. Falta de README

Sin `README`, el proyecto pierde claridad pública, onboarding, explicación del propósito y guía de ejecución.

## Profesionalidad real del proyecto

La respuesta honesta es esta:

**Sí, el proyecto ya es profesional en varios aspectos.**  
**No, todavía no está profesionalmente cerrado al nivel que dicen algunos documentos.**

La diferencia entre un proyecto bueno y un proyecto realmente senior no está en poner nombres de fases, sino en que:

- la documentación coincida con el código
- la calidad sea verificable
- los riesgos estén controlados
- el repositorio público esté limpio
- la operación y evolución del producto sean sostenibles

## Prioridades inmediatas recomendadas

### Prioridad alta

1. crear `README.md`
2. corregir el bug de favoritos para canciones importadas
3. completar el backup con todo el estado relevante
4. eliminar cualquier rastro público de asistencia por IA
5. sincronizar versiones y documentos

### Prioridad media

1. tipar correctamente navegación y pantallas
2. reemplazar `console.error` por `logger`
3. ajustar `BottomTabNavigator` para respetar modo `system`
4. agregar pruebas del flujo de backup y de los casos custom song/favoritos

### Prioridad futura

1. pruebas de componentes
2. E2E
3. release pipeline
4. monitoreo más formal si en el futuro hay backend, sync o servicios remotos

## Qué sí vale guardar de tu marco 0-13

Sí vale guardarlo como marco de trabajo del proyecto, pero con esta regla:

**cada fase se aplica con la profundidad que el producto necesita, no por obligación estética.**

Para este proyecto:

- Visión, Requerimientos, Arquitectura, Diseño, Desarrollo, Persistencia, Testing, Seguridad, CI y Mantenimiento son totalmente pertinentes
- Docker, Cloud, Observabilidad avanzada y Escalabilidad distribuida son contextuales y se activan cuando el producto lo necesite

## Validación dinámica pendiente

Esta auditoría fue estática. La validación final queda pendiente hasta que se ejecuten en terminal los siguientes comandos:

```bash
npm test
npx tsc --noEmit
npx eslint src/ --max-warnings 10
npm audit --audit-level=high
```

## Fuentes externas consultadas

1. [Principles behind the Agile Manifesto](https://agilemanifesto.org/principles.html)
2. [The Scrum Guide 2020](https://scrumguides.org/docs/scrumguide/v2020/2020-Scrum-Guide-US.pdf)
3. [NIST SP 800-218 Secure Software Development Framework](https://csrc.nist.gov/pubs/sp/800/218/final)
4. [Docker Docs — What is Docker?](https://docs.docker.com/get-started/docker-overview/)
5. [OpenTelemetry Observability primer](https://opentelemetry.io/docs/concepts/observability-primer/)
