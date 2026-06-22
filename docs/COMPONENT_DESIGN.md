# Diseño Técnico — AppHimnario

## 1. Árbol de Componentes

```
App.tsx
├── ErrorBoundary
│   └── NavigationContainer
│       ├── BottomTabNavigator
│       │   ├── Tab: Himnario → HomeScreen
│       │   ├── Tab: Importar → ImportScreen
│       │   ├── Tab: Repertorios → SetlistsScreen
│       │   └── Tab: Ajustes → SettingsScreen
│       └── Stack Screens
│           ├── HymnDetailScreen
│           │   ├── ChordDiagram (modal)
│           │   ├── Chord Bubble (floating pill)
│           │   └── Metronome Controls
│           └── SetlistDetailScreen
```

## 2. Flujo de Pantallas

```
AppNavigator (Stack)
└── BottomTabNavigator
    ├── HomeScreen ──→ HymnDetailScreen (vía navigation.navigate)
    ├── ImportScreen ──→ HymnDetailScreen (tras importar)
    ├── SetlistsScreen ──→ SetlistDetailScreen
    └── SettingsScreen (sin navegación hija)
```

### Transiciones clave
- **Home → Detalle**: `navigation.navigate('HymnDetail', { hymnId, isCustom, hymn })`
- **Import → Detalle**: Mismo patrón, la canción importada se guarda en store y luego se navega
- **Setlists → SetlistDetail**: `navigation.navigate('SetlistDetail', { setlistId })`
- **SetlistDetail → Detalle**: Mismo que Home

## 3. Flujo de Datos

```
┌─────────────────────────────────────────────────────┐
│                  Zustand Store                        │
│  useAppStore(persist → AsyncStorage)                  │
│                                                       │
│  theme: 'light' | 'dark' | 'system'                   │
│  fontFamily: 'sans' | 'serif' | 'mono'                │
│  fontSize: number                                     │
│  favorites: string[]                                  │
│  customSongs: ScrapedSong[]                           │
│  categoryOverrides: Record<string, string>             │
│  songBPMs: Record<string, number>                     │
│  songNotes: Record<string, string>                    │
│  songPlayCount: Record<string, number>                 │
│  setlists: Setlist[]                                   │
└──────────┬──────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────┐
│                 Capa de Servicios                     │
│  scraperService.ts → fetch + regex → ScrapedSong     │
│                                                       │
│  Dependencias: Ninguna (fetch nativo)                 │
└──────────┬──────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────┐
│               Capa de Utilidades                      │
│  chordTransposer.ts → NOTAS_EN / NOTAS_ES             │
│  lyricsParser.ts → parseLyricsToWords / isChordLine   │
│  extractChords.ts → extrae acordes únicos del texto   │
│  useIsDarkMode.ts → resuelve 'system' a 'light/dark' │
└──────────┬──────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────┐
│                 Capa de Datos                         │
│  hymns.ts → mockHymns: Hymn[]                        │
│  chordDiagrams.ts → chordDiagrams + getChordDiagram  │
└─────────────────────────────────────────────────────┘
```

### Ciclo de vida de datos (ej: transponer acorde)

```
1. Usuario toca [+] en HymnDetailScreen
2. setTransposeSteps(prev => prev + 1)
3. parsedLines se recalcula vía useMemo
   └─ parseLyricsToWords() en lyricsParser.ts
4. uniqueChords se recalcula vía useMemo
   └─ extractUniqueChords() en extractChords.ts
5. Render: cada segmento con acorde llama transposeChord()
   └─ transposeChord() en chordTransposer.ts
6. Chord bubble se actualiza automáticamente
```

### Ciclo de persistencia

```
Acción del usuario → set() en Zustand → AsyncStorage.setItem()
                                        ↓
App offline: carga inicial → AsyncStorage.getItem() → Zustand hydrate
```

## 4. Patrones de UI

### Modal común (reutilizado en 4 lugares)
```typescript
<Modal visible={bool} transparent animationType="fade">
  <TouchableOpacity bg-black/50 onPress={cerrar}>
    <View bg-surface>
      {contenido}
    </View>
  </TouchableOpacity>
</Modal>
```

### Toggle button (reutilizado)
```typescript
<TouchableOpacity onPress={toggle}>
  <Text color={isActive ? primary : muted}>
    {isActive ? 'ACTIVO' : 'INACTIVO'}
  </Text>
</TouchableOpacity>
```
