import { useAppStore } from '../useAppStore';

beforeEach(() => {
  useAppStore.setState({
    theme: 'system',
    fontFamily: 'sans',
    fontSize: 18,
    favorites: [],
    customSongs: [],
    categoryOverrides: {},
    songBPMs: {},
    songNotes: {},
    songPlayCount: {},
    setlists: [],
  });
});

describe('useAppStore', () => {
  describe('theme', () => {
    it('defaults to system', () => {
      expect(useAppStore.getState().theme).toBe('system');
    });

    it('setTheme updates theme', () => {
      useAppStore.getState().setTheme('dark');
      expect(useAppStore.getState().theme).toBe('dark');
    });

    it('toggleTheme switches dark to light', () => {
      useAppStore.getState().setTheme('dark');
      useAppStore.getState().toggleTheme();
      expect(useAppStore.getState().theme).toBe('light');
    });

    it('toggleTheme switches light to dark', () => {
      useAppStore.getState().setTheme('light');
      useAppStore.getState().toggleTheme();
      expect(useAppStore.getState().theme).toBe('dark');
    });
  });

  describe('font', () => {
    it('defaults to sans', () => {
      expect(useAppStore.getState().fontFamily).toBe('sans');
    });

    it('setFontFamily updates font', () => {
      useAppStore.getState().setFontFamily('mono');
      expect(useAppStore.getState().fontFamily).toBe('mono');
    });

    it('setFontSize updates size', () => {
      useAppStore.getState().setFontSize(24);
      expect(useAppStore.getState().fontSize).toBe(24);
    });
  });

  describe('favorites', () => {
    it('toggleFavorite adds id', () => {
      useAppStore.getState().toggleFavorite('1');
      expect(useAppStore.getState().favorites).toContain('1');
    });

    it('toggleFavorite removes id on second call', () => {
      useAppStore.getState().toggleFavorite('1');
      useAppStore.getState().toggleFavorite('1');
      expect(useAppStore.getState().favorites).not.toContain('1');
    });

    it('toggles multiple favorites', () => {
      useAppStore.getState().toggleFavorite('1');
      useAppStore.getState().toggleFavorite('2');
      expect(useAppStore.getState().favorites).toEqual(['1', '2']);
    });
  });

  describe('customSongs', () => {
    const mockSong = { success: true, title: 'Test', lyrics: '[C]test', source: 'url' };

    it('addCustomSong adds a song', () => {
      useAppStore.getState().addCustomSong(mockSong);
      expect(useAppStore.getState().customSongs).toHaveLength(1);
      expect(useAppStore.getState().customSongs[0].title).toBe('Test');
    });

    it('addCustomSong updates existing by title', () => {
      useAppStore.getState().addCustomSong(mockSong);
      useAppStore.getState().addCustomSong({ ...mockSong, lyrics: '[G]new' });
      expect(useAppStore.getState().customSongs).toHaveLength(1);
      expect(useAppStore.getState().customSongs[0].lyrics).toBe('[G]new');
    });

    it('removeCustomSong removes by title', () => {
      useAppStore.getState().addCustomSong(mockSong);
      useAppStore.getState().removeCustomSong('Test');
      expect(useAppStore.getState().customSongs).toHaveLength(0);
    });
  });

  describe('categoryOverrides', () => {
    it('setCategoryOverride stores override', () => {
      useAppStore.getState().setCategoryOverride('1', 'Alabanza');
      expect(useAppStore.getState().categoryOverrides['1']).toBe('Alabanza');
    });

    it('setCategoryOverride overwrites previous', () => {
      useAppStore.getState().setCategoryOverride('1', 'Alabanza');
      useAppStore.getState().setCategoryOverride('1', 'Adoración');
      expect(useAppStore.getState().categoryOverrides['1']).toBe('Adoración');
    });
  });

  describe('songBPMs', () => {
    it('setSongBPM stores and overwrites', () => {
      useAppStore.getState().setSongBPM('1', 120);
      expect(useAppStore.getState().songBPMs['1']).toBe(120);
      useAppStore.getState().setSongBPM('1', 140);
      expect(useAppStore.getState().songBPMs['1']).toBe(140);
    });
  });

  describe('songNotes', () => {
    it('setSongNote stores note', () => {
      useAppStore.getState().setSongNote('1', 'Repetir 2 veces');
      expect(useAppStore.getState().songNotes['1']).toBe('Repetir 2 veces');
    });
  });

  describe('playCount', () => {
    it('incrementPlayCount starts at 1', () => {
      useAppStore.getState().incrementPlayCount('1');
      expect(useAppStore.getState().songPlayCount['1']).toBe(1);
    });

    it('incrementPlayCount increases on second call', () => {
      useAppStore.getState().incrementPlayCount('1');
      useAppStore.getState().incrementPlayCount('1');
      expect(useAppStore.getState().songPlayCount['1']).toBe(2);
    });

    it('incrementPlayCount tracks multiple songs', () => {
      useAppStore.getState().incrementPlayCount('1');
      useAppStore.getState().incrementPlayCount('2');
      useAppStore.getState().incrementPlayCount('2');
      expect(useAppStore.getState().songPlayCount['1']).toBe(1);
      expect(useAppStore.getState().songPlayCount['2']).toBe(2);
    });
  });

  describe('setlists', () => {
    it('createSetlist creates with unique id and empty hymns', () => {
      useAppStore.getState().createSetlist('Culto Dominical');
      const lists = useAppStore.getState().setlists;
      expect(lists).toHaveLength(1);
      expect(lists[0].name).toBe('Culto Dominical');
      expect(lists[0].hymnIds).toEqual([]);
    });

    it('deleteSetlist removes by id', () => {
      useAppStore.getState().createSetlist('Test');
      const listId = useAppStore.getState().setlists[0].id;
      useAppStore.getState().deleteSetlist(listId);
      expect(useAppStore.getState().setlists).toHaveLength(0);
    });

    it('addHymnToSetlist adds hymn id', () => {
      useAppStore.getState().createSetlist('Test');
      const listId = useAppStore.getState().setlists[0].id;
      useAppStore.getState().addHymnToSetlist(listId, '1');
      expect(useAppStore.getState().setlists[0].hymnIds).toContain('1');
    });

    it('addHymnToSetlist does not duplicate', () => {
      useAppStore.getState().createSetlist('Test');
      const listId = useAppStore.getState().setlists[0].id;
      useAppStore.getState().addHymnToSetlist(listId, '1');
      useAppStore.getState().addHymnToSetlist(listId, '1');
      expect(useAppStore.getState().setlists[0].hymnIds).toEqual(['1']);
    });

    it('removeHymnFromSetlist removes hymn id', () => {
      useAppStore.getState().createSetlist('Test');
      const listId = useAppStore.getState().setlists[0].id;
      useAppStore.getState().addHymnToSetlist(listId, '1');
      useAppStore.getState().removeHymnFromSetlist(listId, '1');
      expect(useAppStore.getState().setlists[0].hymnIds).toEqual([]);
    });
  });

  describe('restoreBackup', () => {
    it('restores customSongs and favorites', () => {
      useAppStore.getState().restoreBackup({
        customSongs: [{ success: true, title: 'Restored', lyrics: '[C]ok', source: 'url' }],
        favorites: ['1', '2'],
      });
      expect(useAppStore.getState().customSongs).toHaveLength(1);
      expect(useAppStore.getState().favorites).toEqual(['1', '2']);
    });

    it('restoreBackup does not clear existing data if not provided', () => {
      useAppStore.getState().setSongNote('1', 'nota existente');
      useAppStore.getState().restoreBackup({});
      expect(useAppStore.getState().songNotes['1']).toBe('nota existente');
    });
  });
});
