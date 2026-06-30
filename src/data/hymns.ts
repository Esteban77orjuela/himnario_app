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

export const mockHymns: Hymn[] = [];
