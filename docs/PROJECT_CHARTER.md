# Documento de Requerimientos (Project Charter)

**Misión:** Construir el "AppHimnario", una aplicación móvil moderna, rápida y 100% offline diseñada para músicos y feligreses.

## FASE 0 - VISIÓN DEL PRODUCTO
- **Público Objetivo:** Músicos de iglesia y feligreses.
- **Problema que resuelve:** Necesidad de acceder a letras de himnos y canciones con sus respectivos acordes musicales sin depender de una conexión a internet durante los servicios.
- **Valor agregado principal:** Motor dinámico de transposición de acordes y capacidad de importar canciones de la web (scraping) para uso offline.

## FASE 1 - REQUERIMIENTOS INICIALES (MVP)

### Requerimientos Funcionales
1. **Base de Datos Local:** Catálogo inicial de himnos (Alabanza y Adoración).
2. **Motor de Transposición:** Botones para subir (+) o bajar (-) el tono (semitonos) de los acordes de la canción visualizada.
3. **Importador Web (Scraper):** Módulo para buscar una canción en internet (ej. LaCuerda), descargar la letra y acordes, y guardarla en la base de datos local del usuario.
4. **Organización:**
   - Ordenamiento alfabético.
   - Categorización (Ej. Alabanza, Adoración).
   - Sistema de Favoritos.
5. **Personalización UI:** Modo Oscuro nativo.

### Requerimientos No Funcionales
1. **Disponibilidad:** 100% Offline (Base de datos local).
2. **Performance:** Tiempos de carga mínimos, transposición de acordes instantánea sin latencia.
3. **UX/UI:** Diseño moderno, limpio, sin distracciones durante la lectura musical (Glassmorphism/Minimalista).
