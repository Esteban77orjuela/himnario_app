export function detectArtistFromTitle(title: string): string | null {
  const dashIndex = title.indexOf(' - ');
  if (dashIndex > 0) {
    const artist = title.substring(0, dashIndex).trim();
    const song = title.substring(dashIndex + 3).trim();
    if (artist && song && artist.length < 40) {
      return artist;
    }
  }
  return null;
}
