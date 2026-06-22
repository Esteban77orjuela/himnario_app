/**
 * Fase 4 - Scraper Service
 * Servicio especializado en conectarse a la web y descargar contenido de canciones.
 * Utiliza fetch nativo (que funciona 100% offline después de guardado) para leer páginas web.
 */

import { logger } from '../utils/logger';

export interface ScrapedSong {
  success: boolean;
  title?: string;
  lyrics?: string;
  source?: string;
  error?: string;
  category?: string;
}

export const scrapeSongFromUrl = async (url: string): Promise<ScrapedSong> => {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'es-ES,es;q=0.9'
      }
    });

    if (!response.ok) {
      return {
        success: false,
        error: `La página bloqueó la conexión o no existe (Error ${response.status}).`
      };
    }

    const html = await response.text();

    logger.info('Scraper response', { status: response.status, hasPre: html.toLowerCase().includes('<pre>'), preview: html.substring(0, 100) });

    // IDEA PARTICULAR: LaCuerda inserta un <pre id='tCode'></pre> VACÍO antes del <PRE> real
    // para engañar a los bots. Para vencer esto, buscamos TODOS los bloques <pre> de la página
    // y seleccionamos el más largo (que obviamente será el que contiene toda la canción).
    let rawHtmlBlock = '';
    
    const preBlocks = html.match(/<pre[^>]*>([\s\S]*?)<\/pre>/gi);
    if (preBlocks && preBlocks.length > 0) {
      // Encontrar el bloque <pre> con más caracteres
      const longestPre = preBlocks.reduce((a, b) => a.length > b.length ? a : b, '');
      // Quitarle las etiquetas <pre> de apertura y cierre para quedarnos solo con el contenido
      rawHtmlBlock = longestPre.replace(/<\/?pre[^>]*>/gi, '');
    } else if (html.includes('t_body')) {
      // Fallback extremo
      const tBodyPart = html.split(/id=["']?t_body["']?[^>]*>/i)[1];
      if (tBodyPart) {
         rawHtmlBlock = tBodyPart.split(/<\/div>[\s\n]*<div id=abajo>/i)[0];
      }
    }

    // Extraer el título de la canción
    let title = 'Canción Importada';
    if (html.toLowerCase().includes('<h1')) {
      const titleRaw = html.split(/<h1[^>]*>/i)[1].split(/<\/h1>/i)[0];
      title = titleRaw.replace(/<[^>]+>/g, '').trim();
    }

    if (rawHtmlBlock && rawHtmlBlock.trim().length > 10) {
      // Limpiamos el texto para que quede puro
      let rawLyrics = rawHtmlBlock
        .replace(/<br\s*\/?>/gi, '\n') // Convertir etiquetas <br> a saltos de línea reales
        .replace(/<[^>]+>/g, '')       // Eliminar cualquier botón o enlace sobrante
        .trim();

      // Destruir footers de derechos de autor, diccionarios de acordes y transcripción de LaCuerda
      const stopMarkers = [
        /Este fichero es trabajo propio de su transcriptor[\s\S]*/i,
        /Acordes utilizados:?[\s\S]*/i,
        /Acordes:[\s\S]*/i,
        /Saludos a [\s\S]*/i
      ];
      
      for (const marker of stopMarkers) {
        rawLyrics = rawLyrics.replace(marker, '');
      }
      
      rawLyrics = rawLyrics.trim();

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
  } catch (_error) {
    return {
      success: false,
      error: 'Error de red. Revisa tu conexión a internet.'
    };
  }
};
