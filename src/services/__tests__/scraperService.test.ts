import { scrapeSongFromUrl } from '../scraperService';

const mockHtmlWithPre = `
<html>
  <head><title>Test Song</title></head>
  <body>
    <h1>Test Song</h1>
    <pre id="tCode"></pre>
    <pre>C G Am\nMi vida entera te alaba</pre>
    <div>Acordes utilizados: C G Am</div>
  </body>
</html>`;

const mockHtmlWithTitle = `
<html>
  <head><title>Otra Cancion</title></head>
  <body>
    <h1>Otra Cancion</h1>
    <pre>C Dm G7\nLetra de prueba aqui</pre>
  </body>
</html>`;

const mockHtmlNoPre = `
<html>
  <head><title>No Song</title></head>
  <body>
    <div>No hay acordes aqui</div>
  </body>
</html>`;

describe('scrapeSongFromUrl', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('extracts lyrics from a page with <pre> block', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: jest.fn().mockResolvedValue(mockHtmlWithPre),
    });

    const result = await scrapeSongFromUrl('https://example.com/song');
    expect(result.success).toBe(true);
    expect(result.lyrics).toContain('Mi vida entera te alaba');
    expect(result.title).toBe('Test Song');
  });

  it('extracts title from h1 tag', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: jest.fn().mockResolvedValue(mockHtmlWithTitle),
    });

    const result = await scrapeSongFromUrl('https://example.com/otra');
    expect(result.success).toBe(true);
    expect(result.title).toBe('Otra Cancion');
    expect(result.lyrics).toContain('Letra de prueba aqui');
  });

  it('returns error when no <pre> block found', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: jest.fn().mockResolvedValue(mockHtmlNoPre),
    });

    const result = await scrapeSongFromUrl('https://example.com/no-song');
    expect(result.success).toBe(false);
    expect(result.error).toContain('No se encontr');
  });

  it('returns error on HTTP failure', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 404,
    });

    const result = await scrapeSongFromUrl('https://example.com/404');
    expect(result.success).toBe(false);
    expect(result.error).toContain('Error 404');
  });

  it('returns error on network failure', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

    const result = await scrapeSongFromUrl('https://example.com/fail');
    expect(result.success).toBe(false);
    expect(result.error).toContain('Error de red');
  });

  it('cleans footer markers from lyrics', async () => {
    const htmlWithFooter = `
    <html><body>
      <pre>G D\nLetra de cancion\nAcordes utilizados: G D Em C\nSaludos a todos</pre>
    </body></html>`;

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: jest.fn().mockResolvedValue(htmlWithFooter),
    });

    const result = await scrapeSongFromUrl('https://example.com/footer');
    expect(result.success).toBe(true);
    expect(result.lyrics).not.toContain('Acordes utilizados');
    expect(result.lyrics).not.toContain('Saludos');
    expect(result.lyrics).toContain('Letra de cancion');
  });
});
