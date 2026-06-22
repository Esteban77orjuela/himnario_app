# Esquema de Almacenamiento (AsyncStorage)

**Clave en AsyncStorage:** `himnario-storage`

## Interfaces

### AppState (almacenado completo)
```typescript
{
  theme: 'light' | 'dark' | 'system';
  fontFamily: 'sans' | 'serif' | 'mono';
  fontSize: number;               // 12-40, default 18
  favorites: string[];            // IDs de himnos favoritos
  customSongs: ScrapedSong[];     // Canciones importadas
  categoryOverrides: Record<string, string>;  // { [id]: 'Alabanza' | 'Adoracion' | 'Otra' }
  songBPMs: Record<string, number>;  // { [id]: BPM }
  setlists: Setlist[];            // Listas de repertorio
}
```

### ScrapedSong
```typescript
{
  success: boolean;
  title: string;
  lyrics: string;     // Texto con acordes en formato LaCuerda
  source: string;     // URL de origen
  category?: string;
}
```

### Setlist
```typescript
{
  id: string;         // Date.now().toString()
  name: string;       // Ej: "Culto de Domingo"
  hymnIds: string[];  // IDs de himnos en la lista
}
```

## Notas
- No hay migraciones. Al agregar un campo nuevo, Zustand hace merge automático.
- Backup exporta estos datos como JSON para restauración externa.
