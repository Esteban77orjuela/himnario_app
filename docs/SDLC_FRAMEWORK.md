# Marco de Ciclo de Vida de Desarrollo de Software (SDLC)

**Propósito:** Marco de referencia profesional para el desarrollo de software, aplicable a cualquier proyecto.  
**Proyecto:** AppHimnario  
**Versión del marco:** 1.0  
**Última actualización:** 2026-06-30

---

Este documento describe las 14 fases del ciclo de vida profesional del software, desde la visión del producto hasta el mantenimiento continuo. Cada fase se aplica con la profundidad que el producto necesita, no por obligación estética.

---

## FASE 0 — VISIÓN DEL PRODUCTO

Antes de escribir código.

**Preguntas clave:**
- ¿Qué problema resuelve?
- ¿Quién lo usará?
- ¿Cuál es el objetivo de negocio?
- ¿Qué valor entrega?
- ¿Cómo monetiza?
- ¿Qué riesgos existen?

**Herramientas:** Product Thinking, UX, User Stories, BPMN, Domain Modeling  
**Roles:** Product Manager, Business Analyst, Software Architect

**Estado en AppHimnario:** ✅ Documentado en `docs/PROJECT_CHARTER.md`

---

## FASE 1 — REQUERIMIENTOS

Definición de requerimientos funcionales y no funcionales.

**Funcionales:** Login, roles, funcionalidades del negocio  
**No funcionales:** Seguridad, escalabilidad, rendimiento, disponibilidad

**Artefactos:** Historias de usuario, casos de uso, épicas, backlog Agile

**Estado en AppHimnario:** ✅ Documentado en `docs/USER_STORIES.md` y `docs/PROJECT_CHARTER.md`

---

## FASE 2 — ARQUITECTURA

Comienza la ingeniería real.

**Decisiones:**
- Arquitectura: Monolito, Microservicios, Event Driven, Hexagonal, Clean Architecture, Serverless
- Principios: SOLID, DRY, KISS, YAGNI, Separation of Concerns
- Diagramas: C4 Model, UML, Sequence Diagrams, ERD
- Stack: Base de datos, API, mensajería, contenedores, nube

**Cambio de mentalidad:** El desarrollador deja de ser "coder" y se vuelve ingeniero de sistemas.

**Estado en AppHimnario:** ✅ Definida en `docs/ADR-001.md`, `docs/ADR-002.md`, `docs/ADR-003.md`

---

## FASE 3 — DISEÑO TÉCNICO

Definición de estructura de carpetas, patrones de diseño, DTOs, Entities, Services, Repositories, APIs, Contracts, Validaciones.

**Patrones comunes:** Repository, Factory, Strategy, Observer, CQRS, Mediator

**Estado en AppHimnario:** ✅ Documentado en `docs/COMPONENT_DESIGN.md` y `docs/SCHEMA.md`

---

## FASE 4 — DESARROLLO

El código con estándares profesionales.

**Estándares:** Clean Code, Linters, Formatting, Static Analysis  
**Control de versiones:** Git, GitFlow, Trunk Based Development  
**Automatización:** Pre-commit hooks, Husky, SonarQube

**Estado en AppHimnario:** ✅ ESLint, Husky, lint-staged configurados

---

## FASE 5 — BASE DE DATOS

Diseño de modelo relacional, índices, optimización, normalización, migraciones, transacciones.

**Tecnologías:** PostgreSQL, MySQL, Redis, MongoDB, o almacenamiento local

**Estado en AppHimnario:** ✅ AsyncStorage con persistencia vía Zustand. No aplica base de datos relacional (app 100% offline).

---

## FASE 6 — TESTING

Calidad profesional mediante pruebas automatizadas.

**Tipos:** Unit Testing, Integration Testing, E2E, Performance Testing, Security Testing, Contract Testing  
**Enfoques:** TDD, Test Automation, AI-generated tests

**Estado en AppHimnario:** ✅ 84 tests unitarios con Jest. Pendiente: E2E, pruebas de componentes.

---

## FASE 7 — CIBERSEGURIDAD (DEVSECOPS)

La seguridad se integra en todo el ciclo de vida.

**Prácticas:** SAST, DAST, Dependency Scanning, Secret Scanning, IAM, JWT, OAuth2, OWASP, Rate limiting  
**Herramientas:** Snyk, Trivy, SonarQube, Vault, Dependabot

**Estado en AppHimnario:** ✅ Dependabot, CodeQL, npm audit. Sin servidores ni datos sensibles.

---

## FASE 8 — DOCKER Y CONTENEDORES

Empaquetado de la aplicación para entornos reproducibles.

**Conceptos:** Dockerfile, Images, Containers, Docker Compose  
**Objetivo:** Eliminar el "funciona en mi máquina"

**Estado en AppHimnario:** ⬜ No implementado. No es prioritario para app móvil sin backend.

---

## FASE 9 — CI/CD

Integración y despliegue continuos.

**CI/CD:** Continuous Integration, Continuous Delivery, Continuous Deployment  
**Pipeline:** Push Code → Run Tests → Run Security → Build → Deploy → Monitor

**Estado en AppHimnario:** ✅ GitHub Actions con calidad (`tsc`, `eslint`, `jest`, `audit`, CodeQL). Pendiente: CD (build/release automático).

---

## FASE 10 — CLOUD

Infraestructura en la nube.

**Proveedores:** AWS, Azure, GCP  
**Servicios:** EC2, S3, RDS, Lambda, Kubernetes

**Estado en AppHimnario:** ⬜ No aplica. App 100% offline sin backend.

---

## FASE 11 — OBSERVABILIDAD

Monitoreo de producción con logs, métricas, trazas y errores.

**Stack moderno:** Prometheus, Grafana, ELK, OpenTelemetry

**Estado en AppHimnario:** ✅ Logger (`src/utils/logger.ts`) + ErrorBoundary. Observabilidad básica. Pendiente: métricas y trazas formales.

---

## FASE 12 — ESCALABILIDAD

Diseño para crecer.

**Conceptos:** Load Balancing, Caching, CDN, Horizontal Scaling, Event Driven, Queues

**Estado en AppHimnario:** ⬜ No aplica a escala actual. Arquitectura local suficiente.

---

## FASE 13 — MANTENIMIENTO Y EVOLUCIÓN

El software nunca termina.

**Prácticas:** Refactoring, Technical Debt, Feature Flags, Versioning, Monitoring, Incident Response

**Estado en AppHimnario:** ✅ Activo. Bitácora, versionado semántico, ADRs.

---

## Aplicación al proyecto

| Fase | Estado | Prioridad |
|------|--------|-----------|
| 0. Visión del Producto | ✅ Documentado | — |
| 1. Requerimientos | ✅ Documentado | — |
| 2. Arquitectura | ✅ Definida | — |
| 3. Diseño Técnico | ✅ Implementado | — |
| 4. Desarrollo | ✅ Completo | — |
| 5. Base de Datos | ✅ AsyncStorage | — |
| 6. Testing | ✅ 84 tests | Crecer cobertura |
| 7. Ciberseguridad | ✅ Básico | Endurecer |
| 8. Docker | ⬛ N/A (móvil) | — |
| 9. CI/CD | ✅ Parcial | Agregar CD |
| 10. Cloud | ⬛ N/A (offline) | — |
| 11. Observabilidad | ⬜ Básico | Mejorar |
| 12. Escalabilidad | ⬛ N/A | — |
| 13. Mantenimiento | ✅ Activo | Continuar |

---

*Este marco está inspirado en prácticas reales de la industria: SDLC tradicional, Agile Manifesto, metodologías DevOps y estándares de seguridad como NIST SP 800-218.*
