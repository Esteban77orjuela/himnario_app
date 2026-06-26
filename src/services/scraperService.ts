/**
 * Fase 4 - Scraper Service
 * Servicio especializado en conectarse a la web y descargar contenido de canciones.
 * Utiliza fetch nativo (que funciona 100% offline después de guardado) para leer páginas web.
 */

import { logger } from '../utils/logger';

export interface ScrapedSong {
  success: boolean;
  title?: string;
  artist?: string;
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

    // Detectar si es CifraClub
    const isCifraClub = url.toLowerCase().includes('cifraclub.com');

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

    // Extraer el título y artista de la canción
    let title = 'Canción Importada';
    let artist = '';

    // 1) Intentar desde <title>
    const titleTag = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleTag) {
      const raw = titleTag[1].trim();
      
      if (isCifraClub) {
        // Cifraclub formato: "TITULO - Artista - Cifra Club"
        const parts = raw.split(' - ');
        if (parts.length >= 2) {
          title = parts[0].trim();
          artist = parts[1].trim();
        }
      } else {
        // Formato "TITULO: Acordes y Letra... (ARTISTA)" — nuevo formato LaCuerda
        const parenM = raw.match(/\(([^)]+)\)/);
        if (parenM) artist = parenM[1].trim();
        const colonM = raw.match(/^([^:]+?):\s*Acordes/i);
        if (colonM) title = colonM[1].trim();
        else {
          // Formato "Acordes de ARTISTA: TITULO"
          const acordesMatch = raw.match(/^Acordes de\s+(.+?):\s+(.+)/i);
          if (acordesMatch) {
            artist = artist || acordesMatch[1].trim();
            title = acordesMatch[2].trim();
          } else {
            // Formato "ARTISTA - TITULO - LaCuerda"
            const parts = raw.split(' - ').map(s => s.trim()).filter(s => !/lacuerda/i.test(s));
            if (parts.length >= 2) { artist = artist || parts[0]; title = parts.slice(1).join(' - '); }
            else if (parts.length === 1) title = parts[0];
          }
        }
      }
    }

    // 2) Intentar desde <h1>
    if (html.toLowerCase().includes('<h1')) {
      const h1Raw = html.split(/<h1[^>]*>/i)[1].split(/<\/h1>/i)[0];
      const h1Text = h1Raw.replace(/<[^>]+>/g, '').trim();
      // Formato "TITULO, ARTISTA: Acordes"
      const commaColon = h1Text.match(/^(.+?),\s*(.+?):\s*Acordes/i);
      if (commaColon) {
        if (!artist) artist = commaColon[2].trim();
        title = commaColon[1].trim();
      } else {
        // Formato "TITULO ARTISTA" (sin separador, título primero)
        if (artist && h1Text.includes(artist)) {
          title = h1Text.replace(artist, '').trim();
        } else {
          const dashIdx = h1Text.indexOf(' - ');
          if (dashIdx > 0) {
            if (!artist) artist = h1Text.substring(0, dashIdx).trim();
            title = h1Text.substring(dashIdx + 3).trim();
          } else if (title === 'Canción Importada') {
            title = h1Text;
          }
        }
      }
    }

    // 3) Fallback: extraer artista desde la URL
    if (!artist) {
      const urlMatch = url.match(/lacuerda\.net\/([^/]+)/i);
      if (urlMatch) {
        artist = urlMatch[1]
          .replace(/[-_]/g, ' ')
          .replace(/\b\w/g, c => c.toUpperCase())
          .trim();
      }
    }

    // 4) Último fallback: metadato byArtist
    if (!artist) {
      const byArtist = html.match(/itemprop=["']byArtist["'][^>]*>([^<]+)</i);
      if (byArtist) {
        artist = byArtist[1].trim();
      }
    }

    // Capitalizar título (primera letra mayúscula)
    title = title.charAt(0).toUpperCase() + title.slice(1);

    if (rawHtmlBlock && rawHtmlBlock.trim().length > 10) {
      // Limpiamos el texto para que quede puro
      if (isCifraClub) {
        rawHtmlBlock = rawHtmlBlock.replace(/&nbsp;/g, ' ');
      }
      
      let rawLyrics = rawHtmlBlock
        .replace(/<br\s*\/?>/gi, '\n') // Convertir etiquetas <br> a saltos de línea reales
        .replace(/<[^>]+>/g, '')       // Eliminar cualquier botón o enlace sobrante
        .replace(/&#\d+;/g, match => String.fromCharCode(match.slice(2, -1))) // Convertir charcodes como &#233;
        .replace(/&[a-z]+;/gi, ' ') // Quitar entidades HTML sueltas
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
        artist: artist || undefined,
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
