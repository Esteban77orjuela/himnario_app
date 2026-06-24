export interface Hymn {
  id: string;
  number: number;
  title: string;
  category: string;
  lyrics: string;
  artist?: string;
  musicalKey?: string;
  isCustom?: boolean;
}

export type { ChristianSong } from './christianSongs';
export { christianSongs } from './christianSongs';

export const mockHymns: Hymn[] = [
  {
    id: "1",
    number: 1,
    title: "Cuán Grande es Él",
    category: "Adoración",
    artist: "Tradicional",
    lyrics: `[G]Señor, mi Dios, al contemplar los [C]cielos,
El firma[G]mento y las es[D]trellas [G]mil,
[G]Al oír tu voz en los potentes [C]truenos
Y ver bri[G]llar al [D]sol en su ce[G]nit.

Coro:
Mi corazón en[C]tona la can[G]ción:
¡Cuán grande es [D]Él! ¡Cuán grande es [G]Él!
Mi corazón en[C]tona la can[G]ción:
¡Cuán grande es [D]Él! ¡Cuán grande es [G]Él!`
  },
  {
    id: "2",
    number: 2,
    title: "Sublime Gracia (Amazing Grace)",
    category: "Alabanza",
    artist: "Tradicional",
    lyrics: `Su[G]blime gracia del Se[C]ñor,
Que a un [G]pecador sal[D]vó;
Fui [G]ciego mas hoy [C]veo [G]yo,
Per[G]dido y [D]Él me ha[G]lló.`
  },
  {
    id: "3",
    number: 3,
    title: "Santo, Santo, Santo",
    category: "Adoración",
    artist: "Tradicional",
    lyrics: `[C]Santo, [Am]santo, [G]santo, [C]Señor [F]Omnipo[C]tente,
[G]Siempre el labio [Am]mío [D]loores te da[G]rá;
[C]Santo, [Am]santo, [G]santo, [C]te ado[F]ro reve[C]rente,
[Am]Dios en tres [F]per[C]sonas, [Dm]bendita [G]Trini[C]dad.`
  },
  {
    id: "4",
    number: 4,
    title: "Cerca de Ti, Señor",
    category: "Adoración",
    artist: "Tradicional",
    lyrics: `[G]Cerca de [C]Ti, Se[G]ñor, [Em]quiero mo[D]rar;
[G]Tu grande y [C]tierno a[G]mor [D]quiero go[G]zar.
[G]Llena mi [C]pobre [G]ser, [G]limpia mi [C]cora[G]zón;
[G]Hazme tu [C]rostro [G]ver [Em]en co[D]mu[G]nión.`
  }
];
