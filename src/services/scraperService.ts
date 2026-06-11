/**
 * Fase 4 - Scraper Service
 * Servicio especializado en conectarse a la web y descargar contenido de canciones.
 * Utiliza fetch nativo (que funciona 100% offline después de guardado) para leer páginas web.
 */

export interface ScrapedSong {
  success: boolean;
  title?: string;
  lyrics?: string;
  source?: string;
  error?: string;
}

export const scrapeSongFromUrl = async (url: string): Promise<ScrapedSong> => {
  try {
    const response = await fetch(url);
    const html = await response.text();

    // IDEA PARTICULAR: Los sitios web de partituras (como LaCuerda) siempre ponen la 
    // letra y los acordes dentro de una etiqueta HTML especial llamada <pre> (Preformatted Text).
    // Usamos esta Expresión Regular para ubicar exactamente esa caja y extraerla ignorando la publicidad.
    const preMatch = html.match(/<pre[^>]*>([\s\S]*?)<\/pre>/i);
    
    // Extraer el título de la canción que suele estar en el título principal (<h1>)
    const titleMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : 'Canción Importada';

    if (preMatch && preMatch[1]) {
      // Limpiamos el texto para que quede puro
      const rawLyrics = preMatch[1]
        .replace(/<br\s*\/?>/gi, '\n') // Convertir etiquetas <br> a saltos de línea reales
        .replace(/<[^>]+>/g, '')       // Eliminar cualquier botón o enlace sobrante
        .trim();

      return {
        title,
        lyrics: rawLyrics,
        source: url,
        success: true
      };
    } else {
      return {
        success: false,
        error: 'No se encontró la estructura de acordes en esta página.'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: 'Error de red. Revisa tu conexión a internet.'
    };
  }
};
