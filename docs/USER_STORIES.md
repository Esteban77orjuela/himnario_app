# User Stories — AppHimnario

Formato: **Como** [rol], **quiero** [acción], **para** [beneficio].

---

## Módulo: Catálogo y Visualización

### US-001 — Catálogo de himnos
**Como** músico de iglesia,  
**quiero** ver una lista de todos los himnos disponibles,  
**para** seleccionar rápida la canción que vamos a tocar.

*Criterios:* Lista ordenada alfabéticamente, cada ítem muestra número + título + categoría.

### US-002 — Letra con acordes inline
**Como** músico de iglesia,  
**quiero** ver la letra del himno con los acordes sobre las sílabas correspondientes,  
**para** tocar los acordes en el momento exacto.

*Criterios:* Acordes alineados sobre la sílaba, formato inline (no separado), toggle para ocultar acordes.

### US-003 — Transposición
**Como** músico de iglesia,  
**quiero** subir o bajar el tono de la canción en semitonos,  
**para** adaptarla al registro vocal del cantante.

*Criterios:* Transponer hacia arriba y abajo, soporte para nombres en inglés y español, los acordes envuelven al octavo semitono.

### US-004 — Búsqueda inteligente
**Como** músico de iglesia,  
**quiero** buscar canciones por título o letra aunque escriba con errores,  
**para** encontrar la canción sin saber el título exacto.

*Criterios:* Fuzzy search con Fuse.js, búsqueda en título + letra, tolerancia a acentos y errores tipográficos.

### US-005 — Zoom de texto
**Como** músico de iglesia con diferentes condiciones de lectura,  
**quiero** aumentar o disminuir el tamaño de la letra, incluido con gesto de pellizco,  
**para** leer cómodamente desde cualquier distancia.

*Criterios:* Botones +/-, pinch-to-zoom, rango 12-40px, persistente entre sesiones.

### US-006 — Diccionario de acordes
**Como** guitarrista principiante,  
**quiero** tocar cualquier acorde en la letra para ver su diagrama en guitarra y piano,  
**para** aprender la posición correcta de los dedos.

*Criterios:* Modal con SVG de diapasón (guitarra) y teclado (piano), toggle entre ambos, soporte para acordes con sostenidos/bemoles.

---

## Módulo: Herramientas en Vivo

### US-007 — Auto-scroll
**Como** músico tocando en vivo,  
**quiero** que la letra se desplace automáticamente,  
**para** no tener que tocar la pantalla mientras toco.

*Criterios:* Scroll suave con requestAnimationFrame, toggle play/pause.

### US-008 — Metrónomo visual
**Como** músico de iglesia,  
**quiero** un metrónomo visual con BPM ajustable,  
**para** mantener el tempo durante el ensayo.

*Criterios:* Flash visual, BPM persistente por canción, rango 40-240.

### US-009 — Modo inmersivo
**Como** músico leyendo en vivo,  
**quiero** ocultar toda la interfaz (cabecera, botones) con un toque,  
**para** maximizar el área de lectura sin distracciones.

*Criterios:* Tap center toggle, animación suave con Moti, restaurar con segundo toque.

### US-010 — Modo proyector
**Como** director de alabanza,  
**quiero** activar un modo con letra grande, fondo negro, sin acordes,  
**para** proyectar la letra en pantalla grande durante el culto.

*Criterios:* Fondo negro, texto blanco, fuente 1.8x, acordes ocultos.

---

## Módulo: Organización

### US-011 — Favoritos
**Como** músico de iglesia,  
**quiero** marcar canciones como favoritas,  
**para** acceder rápidamente a las que más usamos.

### US-012 — Categorías
**Como** músico de iglesia,  
**quiero** asignar cada canción a una categoría (Alabanza/Adoración),  
**para** filtrar el repertorio según el momento del servicio.

### US-013 — Repertorios (Setlists)
**Como** director de alabanza,  
**quiero** crear listas de canciones para cada servicio,  
**para** tener el orden del culto preparado de antemano.

*Criterios:* CRUD completo, arrastrar canciones a la lista, selección desde detalle de canción.

---

## Módulo: Importación

### US-014 — Importar desde LaCuerda
**Como** músico de iglesia,  
**quiero** pegar una URL de LaCuerda.net para importar la canción,  
**para** agregar himnos que no están en el catálogo base.

*Criterios:* Scraper extrae título + letra + acordes, maneja errores de red/parsing, categoría editable.

### US-015 — Backup/Restore
**Como** músico de iglesia,  
**quiero** exportar toda mi biblioteca a un archivo JSON y poder restaurarla,  
**para** no perder mis datos si cambio de dispositivo.

---

## Módulo: Personalización

### US-016 — Tema oscuro/claro
**Como** músico de iglesia,  
**quiero** cambiar entre tema oscuro, claro o automático,  
**para** leer cómodamente según la iluminación del ambiente.

### US-017 — Tipografía
**Como** músico de iglesia,  
**quiero** elegir entre 3 estilos de letra (sans, serif, mono),  
**para** una experiencia de lectura personalizada.

---

## Módulo: Notas y Estadísticas

### US-018 — Notas privadas
**Como** músico de iglesia,  
**quiero** escribir notas personales para cada canción,  
**para** recordar indicaciones específicas (repeticiones, dinámicas).

### US-019 — Estadísticas de uso
**Como** director de alabanza,  
**quiero** ver qué canciones he tocado más veces,  
**para** equilibrar el repertorio y no repetir siempre las mismas.

---

## Priorización

| Prioridad | User Stories | Esfuerzo |
|-----------|-------------|----------|
| Alta | US-001 al US-009 | Fundación |
| Media | US-010 al US-015 | Herramientas |
| Baja | US-016 al US-019 | Extras |
