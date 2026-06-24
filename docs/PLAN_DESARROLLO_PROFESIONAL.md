# Plan de desarrollo profesional — AppHimnario

**Fecha inicial:** 2026-06-22  
**Enfoque de trabajo:** iterativo, incremental, con control documental dentro del proyecto

## Idea general

AppHimnario es una app móvil para músicos y líderes de alabanza que necesitan consultar, organizar, adaptar e interpretar canciones con acordes de forma rápida y confiable, especialmente en contextos de ensayo y servicio donde la fluidez importa más que la complejidad técnica.

## Cómo vamos a trabajar

Se seguirá una dinámica simple:

1. definir con claridad qué problema se resuelve
2. revisar el estado actual del código
3. diseñar el cambio mínimo correcto
4. implementar
5. verificar
6. documentar lo hecho en la bitácora
7. pasar al siguiente bloque

Este proyecto no va a crecer por “acumulación de features”, sino por iteraciones pequeñas con cierre real.

## Reglas del proyecto

### 1. Toda mejora debe conectarse con la idea general

Antes de tocar una pantalla, función, dependencia o documento, la pregunta será:

`¿Esto mejora la experiencia real del músico o la salud profesional del producto?`

Si la respuesta es no, no se prioriza.

### 2. La documentación debe seguir al código

Cada cambio importante debe reflejarse, como mínimo, en alguno de estos archivos:

- `docs/BITACORA.md`
- `docs/ROADMAP.md`
- `docs/USER_STORIES.md`
- `docs/PROJECT_CHARTER.md`
- ADRs si la decisión cambia arquitectura o estrategia

### 3. No dejar rastros públicos de asistencia por IA

Para publicar en GitHub o cualquier entorno público:

- no subir conversaciones
- no dejar archivos de chat o prompts
- no dejar comentarios tipo “generado por IA”
- no dejar commits o documentos con lenguaje que delate asistencia automática

La ayuda puede existir en el proceso privado, pero no debe quedar como artefacto público del producto.

### 4. La calidad mínima antes de dar algo por terminado

Un cambio se considera cerrado cuando cumple lo siguiente:

- resuelve un problema concreto
- no rompe el flujo principal
- queda documentado
- pasa verificación técnica
- no degrada la claridad del código

## Definition of Done para este proyecto

Un cambio queda “hecho” solo si:

1. el comportamiento funciona
2. el código queda claro y coherente con la arquitectura actual
3. la documentación aplicable se actualiza
4. no quedan trazas públicas impropias
5. las verificaciones manuales y técnicas esperadas pasan

## Orden de prioridades actuales

### Bloque 1 — Higiene profesional del repositorio

- mantener fuera del repo cualquier traza de conversación
- crear `README.md`
- sincronizar versiones y documentos

### Bloque 2 — Corrección de brechas reales

- corregir favoritos de canciones importadas
- completar backup/restore
- corregir incoherencias del tema `system`
- cerrar tipado de navegación y pantallas

### Bloque 3 — Fortalecimiento técnico

- ampliar pruebas de flujos críticos
- endurecer validaciones
- mejorar consistencia de UI y estados límite

### Bloque 4 — Preparación pública

- README público
- limpieza final del repositorio
- revisión de seguridad y dependencias
- preparación de subida a GitHub

## Artefactos vivos del proyecto

Estos documentos quedan como base activa:

- `docs/PROJECT_CHARTER.md`: visión y contexto del producto
- `docs/METHODOLOGY.md`: marco SDLC general
- `docs/EVALUACION_PROFESIONAL_2026-06-22.md`: auditoría actual
- `docs/BITACORA.md`: historial de cambios
- `docs/ROADMAP.md`: dirección de evolución
- `docs/USER_STORIES.md`: necesidades funcionales

## Regla de versiones

Cuando se cierre una mejora significativa:

- actualizar versión funcional del proyecto en la bitácora
- mantener consistencia entre `app.json`, `package.json` y documentación pública

## Comandos de verificación que ejecutarás tú

Cuando hagamos cambios técnicos, la validación base será esta:

```bash
npm test
npx tsc --noEmit
npx eslint src/ --max-warnings 10
npm audit --audit-level=high
```

## Siguiente tramo recomendado

El siguiente paso lógico después de esta auditoría es:

1. corregir higiene pública del repo
2. crear `README.md`
3. arreglar bug de favoritos para canciones importadas
4. completar backup
5. sincronizar documentos con el estado real

## Nota de trabajo

Este plan no congela el proyecto. Si aparece una necesidad más importante durante una iteración, se ajusta. La referencia sigue siendo Agile: software funcionando, valor real, mejora continua y adaptación al contexto.[1][2]

## Fuentes externas consultadas

1. [Principles behind the Agile Manifesto](https://agilemanifesto.org/principles.html)
2. [The Scrum Guide 2020](https://scrumguides.org/docs/scrumguide/v2020/2020-Scrum-Guide-US.pdf)
