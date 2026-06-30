import { View, Text, ScrollView, TouchableOpacity, Pressable, Alert, Modal, TextInput, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';
import { useAppStore } from '../store/useAppStore';
import { useIsDarkMode } from '../utils/useIsDarkMode';
import { mockHymns, christianSongs } from '../data/hymns';
import { ArrowLeft, Heart, Minus, Plus, ZoomIn, ZoomOut, Share, Edit2, Play, Pause, Activity, ListPlus, X, Monitor, Trash2, MoreVertical, Youtube } from 'lucide-react-native';
import { transposeChord } from '../utils/chordTransposer';
import { MotiView } from 'moti';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import ChordDiagram from '../components/ChordDiagram';

export default function HymnDetailScreen({ route, navigation }: any) {
  const { hymnId, isCustom, hymn: customHymn } = route.params;
  const isDarkMode = useIsDarkMode();
  const fontSize = useAppStore((state) => state.fontSize);
  const setFontSize = useAppStore((state) => state.setFontSize);
  const fontFamily = useAppStore((state) => state.fontFamily);
  const fontClass = fontFamily === 'mono' ? 'font-mono' : fontFamily === 'serif' ? 'font-serif' : 'font-sans';

  const favorites = useAppStore((state) => state.favorites);
  const toggleFavorite = useAppStore((state) => state.toggleFavorite);
  const customSongs = useAppStore((state) => state.customSongs);
  const categoryOverrides = useAppStore((state) => state.categoryOverrides);
  const setCategoryOverride = useAppStore((state) => state.setCategoryOverride);
  const setlists = useAppStore((state) => state.setlists);
  const addHymnToSetlist = useAppStore((state) => state.addHymnToSetlist);
  const incrementPlayCount = useAppStore((state) => state.incrementPlayCount);

  const [showSetlistModal, setShowSetlistModal] = useState(false);
  const [isImmersiveMode, setIsImmersiveMode] = useState(false);
  const [isProjectorMode, setIsProjectorMode] = useState(false);
  const [selectedChord, setSelectedChord] = useState<string | null>(null);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showChordsList, setShowChordsList] = useState(false);
  const songNotes = useAppStore((state) => state.songNotes);
  const setSongNote = useAppStore((state) => state.setSongNote);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [noteText, setNoteText] = useState('');


  // --- PINCH-TO-ZOOM (sin inercia) ---
  const baseFontSize = useRef(fontSize);
  const onPinchGestureEvent = useCallback((event: any) => {
    const newSize = Math.round(Math.min(40, Math.max(12, baseFontSize.current * event.nativeEvent.scale)));
    setFontSize(newSize);
  }, [setFontSize]);
  const onPinchHandlerStateChange = useCallback((event: any) => {
    if (event.nativeEvent.state === State.BEGAN) {
      baseFontSize.current = fontSize;
    }
    if (event.nativeEvent.state === State.END || event.nativeEvent.state === State.CANCELLED) {
      baseFontSize.current = fontSize;
    }
  }, [fontSize]);

  const viewRef = useRef(null);
  const pinchRef = useRef(null);
  const [_isCapturing, setIsCapturing] = useState(false);
  const baseHymn = isCustom
    ? (customSongs.find(s => s.title === customHymn.title) || customHymn)
    : (mockHymns.find(h => h.id === hymnId) || christianSongs.find(s => s.id === hymnId) || customHymn);
  const hymnIdKey = isCustom ? baseHymn.title : baseHymn.id;
  const hymn = { ...baseHymn, category: categoryOverrides[hymnIdKey] || baseHymn.category };

  const [showChords, setShowChords] = useState(true);
  const [transposeSteps, setTransposeSteps] = useState(0);

  // Derived effective values for Projector Mode
  const effectiveShowChords = isProjectorMode ? false : showChords;
  const effectiveFontSize = isProjectorMode ? Math.min(fontSize * 1.8, 48) : fontSize;
  const effectiveIsImmersive = isProjectorMode || isImmersiveMode;

  const isFavorite = favorites.includes(hymnIdKey);

  // --- AUTO-SCROLL LOGIC ---
  const scrollRef = useRef<ScrollView>(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const scrollY = useRef(0);
  const autoScrollFrame = useRef<number>(0);
  const [showStickyHeader, setShowStickyHeader] = useState(false);

  useEffect(() => {
    if (isAutoScrolling) {
      const scroll = () => {
        scrollY.current += 0.5; // Velocidad del scroll
        scrollRef.current?.scrollTo({ y: scrollY.current, animated: false });
        autoScrollFrame.current = requestAnimationFrame(scroll);
      };
      autoScrollFrame.current = requestAnimationFrame(scroll);
    } else {
      if (autoScrollFrame.current) cancelAnimationFrame(autoScrollFrame.current);
    }
    return () => {
      if (autoScrollFrame.current) cancelAnimationFrame(autoScrollFrame.current);
    };
  }, [isAutoScrolling]);

  const _handleScroll = (event: any) => {
    const y = event.nativeEvent.contentOffset.y;
    scrollY.current = y;
    if (y > 100 && !showStickyHeader) setShowStickyHeader(true);
    else if (y <= 100 && showStickyHeader) setShowStickyHeader(false);
  };

  // --- METRONOME LOGIC ---
  const songBPMs = useAppStore((state) => state.songBPMs);
  const setSongBPM = useAppStore((state) => state.setSongBPM);
  const [isMetronomeActive, setIsMetronomeActive] = useState(false);
  const [showMetronomeControls, setShowMetronomeControls] = useState(false);
  const currentBpm = songBPMs[hymnIdKey] || 120;
  const [_flash, setFlash] = useState(false);
  const metronomeInterval = useRef<NodeJS.Timeout>(undefined as unknown as NodeJS.Timeout);

  useEffect(() => { incrementPlayCount(hymnIdKey); }, []);

  useEffect(() => {
    if (isMetronomeActive) {
      const intervalMs = 60000 / currentBpm;
      metronomeInterval.current = setInterval(() => {
        setFlash(true);
        setTimeout(() => setFlash(false), 150); // Duración del flash
      }, intervalMs);
    } else {
      if (metronomeInterval.current) clearInterval(metronomeInterval.current);
      setFlash(false);
    }
    return () => {
      if (metronomeInterval.current) clearInterval(metronomeInterval.current);
    };
  }, [isMetronomeActive, currentBpm]);

  // Extract unique chords directly from raw lyrics (works with chord-only lines format)
  const uniqueChords = useMemo(() => {
    if (!hymn) return [];
    const chordSet = new Set<string>();
    const CHORD_REGEX = /^[A-G][b#]?(?:m|maj|dim|aug|sus|add|[0-9])*(?:\([^)]+\))?(?:\/[A-G][b#]?)?$/;
    hymn.lyrics.split('\n').forEach(line => {
      const withoutChords = line.replace(/\[[^\]]*\]/g, '');
      if (line.trim() !== '' && withoutChords.trim() === '') {
        // chord-only line
        const matches = [...line.matchAll(/\[([^\]]+)\]/g)];
        matches.forEach(m => {
          const chord = m[1].trim();
          if (CHORD_REGEX.test(chord)) {
            chordSet.add(transposeChord(chord, transposeSteps));
          }
        });
      }
    });
    return Array.from(chordSet).sort();
  }, [hymn, transposeSteps]);

  const removeCustomSong = useAppStore((state) => state.removeCustomSong);

  const handleDelete = () => {
    Alert.alert(
      'Eliminar Canción',
      `¿Estás seguro de que deseas eliminar "${hymn.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: () => {
            removeCustomSong(hymn.title);
            navigation.goBack();
          }
        }
      ]
    );
  };

  const handleCategoryPress = () => {
    Alert.alert(
      'Cambiar Categoría',
      'Elige la nueva categoría para esta canción:',
      [
        { text: 'Alabanza', onPress: () => setCategoryOverride(hymnIdKey, 'Alabanza') },
        { text: 'Adoración', onPress: () => setCategoryOverride(hymnIdKey, 'Adoración') },
        { text: 'Otra', onPress: () => setCategoryOverride(hymnIdKey, 'Otra') },
        { text: 'Cancelar', style: 'cancel' }
      ]
    );
  };



  const handleShare = async () => {
    try {
      setIsCapturing(true);
      await new Promise(resolve => setTimeout(resolve, 100));
      const uri = await captureRef(viewRef, {
        format: 'png',
        quality: 0.9,
      });
      await Sharing.shareAsync(uri, {
        dialogTitle: 'Compartir Canción',
        mimeType: 'image/png'
      });
    } catch (error) {
      console.error('Error al capturar la imagen:', error);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleOpenYouTube = useCallback(() => {
    const query = encodeURIComponent(`${hymn.title} himno`);
    const url = `https://www.youtube.com/results?search_query=${query}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'No se pudo abrir YouTube. Revisa tu conexión.');
    });
  }, [hymn]);

  if (!hymn) {
    return (
      <View className={`flex-1 justify-center items-center ${isDarkMode ? 'bg-background-dark' : 'bg-background'}`}>
        <Text className={isDarkMode ? 'text-white' : 'text-black'}>Himno no encontrado</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: isProjectorMode ? '#000000' : (isDarkMode ? '#0f172a' : '#f8fafc') }}>
      <MotiView
        animate={{
          opacity: effectiveIsImmersive ? 0 : 1,
          height: effectiveIsImmersive ? 0 : undefined,
          translateY: effectiveIsImmersive ? -50 : 0
        }}
        transition={{ type: 'timing', duration: 300 }}
        className="flex-row items-center justify-between px-6 py-4 shadow-sm z-10 overflow-hidden"
        style={{ backgroundColor: isDarkMode ? 'rgba(2, 6, 23, 0.8)' : 'rgba(248, 250, 252, 0.8)' }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className={`p-3 rounded-2xl ${isDarkMode ? 'bg-surface-dark' : 'bg-white'} shadow-sm`}
        >
          <ArrowLeft color={isDarkMode ? '#818CF8' : '#4F46E5'} size={24} />
        </TouchableOpacity>

        <View className="flex-1 px-4 items-center justify-center">
          <MotiView animate={{ opacity: showStickyHeader ? 1 : 0, translateY: showStickyHeader ? 0 : 10 }}>
            <Text className={`font-serif font-bold text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`} numberOfLines={1}>
              {hymn.title}
            </Text>
          </MotiView>
        </View>

        <View className="flex-row items-center gap-x-1">
          <TouchableOpacity onPress={() => setIsProjectorMode(!isProjectorMode)} className={`p-3 rounded-2xl ${isProjectorMode ? 'bg-blue-500/20' : ''}`}>
            <Monitor color={isProjectorMode ? '#3B82F6' : (isDarkMode ? '#9CA3AF' : '#6B7280')} size={20} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFontSize(Math.min(fontSize + 2, 32))} className="p-3">
            <ZoomIn color={isDarkMode ? '#9CA3AF' : '#6B7280'} size={20} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFontSize(Math.max(fontSize - 2, 12))} className="p-3">
            <ZoomOut color={isDarkMode ? '#9CA3AF' : '#6B7280'} size={20} />
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => setShowOptionsMenu(true)}
            className={`p-2 ml-1 rounded-2xl ${isDarkMode ? 'bg-surface-dark' : 'bg-white'} shadow-sm`}
          >
            <MoreVertical color={isDarkMode ? '#9CA3AF' : '#6B7280'} size={24} />
          </TouchableOpacity>
        </View>
      </MotiView>

      <Modal visible={showOptionsMenu} transparent animationType="fade">
        <TouchableOpacity 
          className="flex-1 bg-black/50 justify-center items-center" 
          activeOpacity={1} 
          onPress={() => setShowOptionsMenu(false)}
        >
          <View className={`w-3/4 max-w-sm rounded-3xl overflow-hidden shadow-2xl ${isDarkMode ? 'bg-surface-dark' : 'bg-white'}`}>
            <View className={`p-4 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
              <Text className={`font-bold text-lg text-center ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Opciones
              </Text>
            </View>
            <ScrollView className="max-h-96">
              <TouchableOpacity 
                className={`p-4 flex-row items-center border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}
                onPress={() => {
                  setShowOptionsMenu(false);
                  toggleFavorite(hymnIdKey);
                }}
              >
                <View className="w-8">
                  <Heart color={isFavorite ? '#EF4444' : (isDarkMode ? '#9CA3AF' : '#6B7280')} fill={isFavorite ? '#EF4444' : 'transparent'} size={20} />
                </View>
                <Text className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {isFavorite ? 'Quitar de Favoritos' : 'Añadir a Favoritos'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                className={`p-4 flex-row items-center border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}
                onPress={() => {
                  setShowOptionsMenu(false);
                  setIsAutoScrolling(!isAutoScrolling);
                }}
              >
                <View className="w-8">
                  {isAutoScrolling ? <Pause color={isDarkMode ? '#818CF8' : '#4F46E5'} size={20} /> : <Play color={isDarkMode ? '#9CA3AF' : '#6B7280'} size={20} />}
                </View>
                <Text className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {isAutoScrolling ? 'Pausar Auto-Scroll' : 'Iniciar Auto-Scroll'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                className={`p-4 flex-row items-center border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}
                onPress={() => {
                  setShowOptionsMenu(false);
                  setShowMetronomeControls(!showMetronomeControls);
                }}
              >
                <View className="w-8">
                  <Activity color={isMetronomeActive ? '#EF4444' : (isDarkMode ? '#9CA3AF' : '#6B7280')} size={20} />
                </View>
                <Text className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Metrónomo</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                className={`p-4 flex-row items-center border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}
                onPress={() => {
                  setShowOptionsMenu(false);
                  if (setlists.length === 0) {
                    Alert.alert('Sin Repertorios', 'Ve a la pestaña "Repertorios" para crear uno nuevo.');
                  } else {
                    setShowSetlistModal(true);
                  }
                }}
              >
                <View className="w-8"><ListPlus color={isDarkMode ? '#9CA3AF' : '#6B7280'} size={20} /></View>
                <Text className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Añadir a Repertorio</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                className={`p-4 flex-row items-center border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}
                onPress={() => {
                  setShowOptionsMenu(false);
                  setNoteText(songNotes[hymnIdKey] || '');
                  setShowNotesModal(true);
                }}
              >
                <View className="w-8"><Edit2 color={isDarkMode ? '#9CA3AF' : '#6B7280'} size={20} /></View>
                <Text className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Notas</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                className={`p-4 flex-row items-center border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}
                onPress={() => {
                  setShowOptionsMenu(false);
                  handleShare();
                }}
              >
                <View className="w-8"><Share color={isDarkMode ? '#9CA3AF' : '#6B7280'} size={20} /></View>
                <Text className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Compartir Imagen</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                className="p-4 flex-row items-center"
                onPress={() => {
                  setShowOptionsMenu(false);
                  if (isCustom) {
                    handleDelete();
                  } else {
                    Alert.alert('Acción no permitida', 'No puedes eliminar canciones nativas del himnario, solo aquellas que hayas importado de LaCuerda.');
                  }
                }}
              >
                <View className="w-8">
                  <Trash2 color={isCustom ? "#EF4444" : (isDarkMode ? "#4B5563" : "#9CA3AF")} size={20} />
                </View>
                <Text className={`font-bold ${isCustom ? "text-red-500" : (isDarkMode ? "text-gray-500" : "text-gray-400")}`}>
                  Eliminar Canción
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {showMetronomeControls && !isImmersiveMode && (
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          className={`px-6 py-3 flex-row justify-between items-center z-0 border-b ${isDarkMode ? 'border-slate-800 bg-surface-dark/90' : 'border-slate-100 bg-white/90'}`}
        >
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => setIsMetronomeActive(!isMetronomeActive)} className={`px-4 py-2 rounded-full ${isMetronomeActive ? 'bg-red-500' : (isDarkMode ? 'bg-primary-dark' : 'bg-primary')}`}>
              <Text className="text-white font-bold text-xs tracking-wider">{isMetronomeActive ? 'DETENER' : 'INICIAR'}</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row items-center bg-black/5 rounded-full px-2">
            <TouchableOpacity onPress={() => setSongBPM(hymnIdKey, Math.max(40, currentBpm - 5))} className="p-2">
              <Minus size={16} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
            </TouchableOpacity>
            <Text className={`font-mono font-bold text-base px-2 w-14 text-center ${isDarkMode ? 'text-white' : 'text-black'}`}>
              {currentBpm}
            </Text>
            <TouchableOpacity onPress={() => setSongBPM(hymnIdKey, Math.min(240, currentBpm + 5))} className="p-2">
              <Plus size={16} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
            </TouchableOpacity>
          </View>
        </MotiView>
      )}

      <PinchGestureHandler
        ref={pinchRef}
        simultaneousHandlers={scrollRef}
        onGestureEvent={onPinchGestureEvent}
        onHandlerStateChange={onPinchHandlerStateChange}
      >
        <ScrollView 
          ref={scrollRef}
          onScroll={_handleScroll}
          scrollEventThrottle={16}
          className="flex-1 px-4" 
          contentContainerStyle={{ paddingBottom: 150 }}
          showsVerticalScrollIndicator={false}
        >
          <Pressable className="flex-1" onPress={() => !isProjectorMode && setIsImmersiveMode(!isImmersiveMode)}>
            <View collapsable={false} ref={viewRef} className={`pt-6 ${isProjectorMode ? 'bg-black' : ''}`}>
              <MotiView
                animate={{
                  opacity: effectiveIsImmersive ? 0 : 1,
                  height: effectiveIsImmersive ? 0 : undefined,
                }}
                className="mb-8"
              >
                <View>
                  <Text className={`text-3xl font-bold font-serif ${isDarkMode ? 'text-white' : 'text-black'}`}>
                    {hymn.title}
                  </Text>
                </View>
                {hymn.artist ? (
                  <Text className={`font-sans text-sm mt-1 mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {hymn.artist}
                  </Text>
                ) : null}
                <View className="flex-row items-center">
                  {!isCustom && (
                    <>
                      <View className={`px-3 py-1 rounded-full ${isDarkMode ? 'bg-primary-dark/20' : 'bg-primary/10'}`}>
                        <Text className={`font-sans font-bold tracking-widest text-xs uppercase ${isDarkMode ? 'text-primary-dark' : 'text-primary'}`}>
                          Himno {hymn.number?.toString().padStart(2, '0') || ''}
                        </Text>
                      </View>
                      <View className="h-1 w-1 rounded-full mx-3 bg-muted" />
                    </>
                  )}
                  <TouchableOpacity
                    onPress={handleCategoryPress}
                    className="flex-row items-center"
                  >
                    <Text className={`font-sans text-xs uppercase tracking-wider ${isDarkMode ? 'text-muted-dark' : 'text-muted'}`}>
                      {hymn.category}
                    </Text>
                    <View className="ml-1 opacity-60">
                      <Edit2 color={isDarkMode ? '#9CA3AF' : '#6B7280'} size={12} />
                    </View>
                  </TouchableOpacity>
                </View>
              </MotiView>

              <MotiView
                animate={{ height: isImmersiveMode ? 0 : 'auto', opacity: isImmersiveMode ? 0 : 1 }}
                className={`flex-row p-1.5 mb-4 rounded-2xl ${isDarkMode ? 'bg-surface-dark/80' : 'bg-white/80'} shadow-sm border border-slate-200/20 overflow-hidden`}
              >
                <Pressable
                  onPress={() => setShowChords(false)}
                  className={`flex-1 py-3 rounded-xl items-center ${!showChords ? (isDarkMode ? 'bg-primary-dark' : 'bg-primary') : ''}`}
                >
                  <Text className={`font-sans font-bold ${!showChords ? 'text-white' : (isDarkMode ? 'text-muted-dark' : 'text-muted')}`}>
                    Letra
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setShowChords(true)}
                  className={`flex-1 py-3 rounded-xl items-center ${showChords ? (isDarkMode ? 'bg-primary-dark' : 'bg-primary') : ''}`}
                >
                  <Text className={`font-sans font-bold ${showChords ? 'text-white' : (isDarkMode ? 'text-muted-dark' : 'text-muted')}`}>
                    Con Notas
                  </Text>
                </Pressable>
              </MotiView>

              <MotiView 
                className="mt-2"
                animate={{
                  scale: effectiveIsImmersive ? 1.05 : 1,
                  translateY: effectiveIsImmersive ? 20 : 0
                }}
                transition={{ type: 'spring', damping: 20 }}
              >
                  {hymn.lyrics.split('\n').map((rawLine, lineIndex) => {
                    // Strip [chord] markers to get the raw text for lyric detection
                    const withoutChords = rawLine.replace(/\[[^\]]*\]/g, '');
                    const isChordOnlyLine = rawLine.trim() !== '' && withoutChords.trim() === '';
                    // A line is a section label if it has no chords and is short uppercase text (like CORO, Coro:, I, II)
                    const isSectionLabel = !isChordOnlyLine && rawLine.trim().length > 0 && rawLine.trim().length <= 20 && /^[A-ZÁÉÍÓÚ0-9IVX][A-ZÁÉÍÓÚa-záéíóú0-9IVX.:/ -]*:?\s*$/.test(rawLine.trim()) && !/[a-záéíóúñ]{3,}/.test(rawLine);
                    const isEmpty = rawLine.trim() === '';

                    if (isEmpty) {
                      return <View key={lineIndex} style={{ height: effectiveFontSize * 0.5 }} />;
                    }

                    if (isChordOnlyLine && effectiveShowChords) {
                      // Render chord line: replace [Chord] with transposed chord, keep spaces
                      const chordLineText = rawLine.replace(/\[([^\]]+)\]/g, (_match, chord) => {
                        const trimmed = chord.trim();
                        return transposeChord(trimmed, transposeSteps);
                      });
                      return (
                        <Text
                          key={lineIndex}
                          selectable={false}
                          style={{
                            fontFamily: 'Courier New',
                            fontSize: effectiveFontSize * 0.9,
                            lineHeight: effectiveFontSize * 1.1,
                            color: isDarkMode ? '#7CB9FF' : '#0066CC',
                            fontWeight: 'bold',
                            marginBottom: -2,
                          }}
                        >
                          {chordLineText}
                        </Text>
                      );
                    }

                    if (isSectionLabel) {
                      return (
                        <Text
                          key={lineIndex}
                          style={{
                            fontSize: effectiveFontSize * 0.85,
                            lineHeight: effectiveFontSize * 1.4,
                            fontWeight: 'bold',
                            color: isDarkMode ? '#9CA3AF' : '#555555',
                            marginTop: effectiveFontSize * 0.4,
                          }}
                        >
                          {rawLine}
                        </Text>
                      );
                    }

                    // Regular lyric line — strip any remaining inline chords if chords hidden
                    const lyricText = effectiveShowChords
                      ? rawLine.replace(/\[[^\]]*\]/g, '')
                      : rawLine.replace(/\[[^\]]*\]/g, '');

                    return (
                      <Text
                        key={lineIndex}
                        style={{
                          fontFamily: 'Courier New',
                          fontSize: effectiveFontSize,
                          lineHeight: effectiveFontSize * 1.25,
                          color: isProjectorMode
                            ? '#FFFFFF'
                            : isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.87)',
                          marginBottom: 2,
                        }}
                      >
                        {lyricText}
                      </Text>
                    );
                  })}

              </MotiView>
            </View>
          </Pressable>

          {/* YouTube card */}
          {!effectiveIsImmersive && (
          <MotiView
            from={{ opacity: 0, translateY: 30 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'spring', damping: 18, delay: 300 }}
            className="mx-4 mb-6"
          >
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleOpenYouTube}
              className={`rounded-3xl overflow-hidden border ${isDarkMode ? 'border-red-900/40' : 'border-red-200/60'}`}
              style={{
                shadowColor: '#FF0000',
                shadowOpacity: isDarkMode ? 0.3 : 0.15,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 4 },
                elevation: 8,
              }}
            >
              <View className="flex-row items-center px-5 py-4"
                style={{
                  backgroundColor: isDarkMode ? 'rgba(127, 29, 29, 0.25)' : 'rgba(254, 242, 242, 0.9)',
                }}
              >
                <View className="w-12 h-12 rounded-full items-center justify-center mr-4"
                  style={{
                    backgroundColor: '#FF0000',
                    shadowColor: '#FF0000',
                    shadowOpacity: 0.5,
                    shadowRadius: 8,
                    shadowOffset: { width: 0, height: 2 },
                    elevation: 6,
                  }}
                >
                  <Youtube color="#FFFFFF" size={22} fill="#FFFFFF" />
                </View>
                <View className="flex-1">
                  <Text className={`font-sans font-bold text-base ${isDarkMode ? 'text-red-200' : 'text-red-800'}`}>
                    Escuchar en YouTube
                  </Text>
                  <Text className={`font-sans text-xs mt-0.5 ${isDarkMode ? 'text-red-300/70' : 'text-red-600/70'}`} numberOfLines={1}>
                    {hymn.title}
                  </Text>
                </View>
                <Play color="#FF0000" size={20} fill="#FF0000" />
              </View>
            </TouchableOpacity>
          </MotiView>
          )}
        </ScrollView>
      </PinchGestureHandler>

      {effectiveShowChords && uniqueChords.length > 0 && (
        <>
          <TouchableOpacity
            onPress={() => setShowChordsList(!showChordsList)}
            className="absolute right-3 z-50"
            style={{ top: 80 }}
            activeOpacity={0.7}
          >
            <MotiView
              animate={{ opacity: effectiveIsImmersive ? 0 : 1, scale: effectiveIsImmersive ? 0.5 : 1 }}
              className={`w-12 h-12 rounded-full items-center justify-center shadow-lg border ${isDarkMode ? 'bg-accent-dark/90 border-accent-dark/30' : 'bg-accent/90 border-accent/30'}`}
            >
              <Text className="text-white font-mono font-bold text-xs text-center leading-tight">
                {uniqueChords.length}{'\n'}Ac
              </Text>
            </MotiView>
          </TouchableOpacity>

          {showChordsList && (
            <TouchableOpacity
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 40 }}
              activeOpacity={1}
              onPress={() => setShowChordsList(false)}
            >
              <MotiView
                from={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-4 shadow-2xl z-50"
                style={{ top: 140 }}
              >
                <View className={`px-4 py-3 rounded-2xl border shadow-lg ${isDarkMode ? 'bg-surface-dark border-slate-700/80' : 'bg-white border-slate-200'}`}>
                  <Text className={`text-xs font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-muted-dark' : 'text-muted'}`}>
                    Acordes
                  </Text>
                  <View className="flex-row flex-wrap" style={{ maxWidth: 160, gap: 6 }}>
                    {uniqueChords.map((chord, idx) => (
                      <View key={idx} className={`px-2.5 py-1 rounded-md ${isDarkMode ? 'bg-accent-dark/20' : 'bg-accent/10'}`}>
                        <Text className={`font-mono font-bold text-sm ${isDarkMode ? 'text-accent-dark' : 'text-accent'}`}>
                          {chord}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </MotiView>
            </TouchableOpacity>
          )}
        </>
      )}

      {effectiveShowChords && (
        <MotiView
          animate={{ opacity: effectiveIsImmersive ? 0 : 1, translateY: effectiveIsImmersive ? 150 : 0, scale: effectiveIsImmersive ? 0.9 : 1 }}
          className={`absolute bottom-8 self-center flex-row items-center justify-between px-6 py-4 rounded-3xl shadow-2xl border ${isDarkMode ? 'bg-surface-dark border-slate-700/50 shadow-primary-dark/20' : 'bg-white border-slate-100 shadow-primary/20'
            }`}
          style={{ width: '85%', maxWidth: 320 }}
          pointerEvents={effectiveIsImmersive ? 'none' : 'auto'}
        >
          <TouchableOpacity
            onPress={() => setTransposeSteps(prev => prev - 1)}
            className={`p-3 rounded-full ${isDarkMode ? 'bg-background-dark' : 'bg-background'}`}
          >
            <Minus size={24} color={isDarkMode ? '#818CF8' : '#4F46E5'} />
          </TouchableOpacity>

          <View className="items-center px-4">
            <Text className={`font-sans text-xs uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Tono</Text>
            <Text className={`font-mono font-bold text-lg ${isDarkMode ? 'text-white' : 'text-black'}`}>
              {transposeSteps > 0 ? `+${transposeSteps}` : transposeSteps}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => setTransposeSteps(prev => prev + 1)}
            className={`p-3 rounded-full ${isDarkMode ? 'bg-background-dark' : 'bg-background'}`}
          >
            <Plus size={24} color={isDarkMode ? '#818CF8' : '#4F46E5'} />
          </TouchableOpacity>
        </MotiView>
      )}

      <Modal visible={!!selectedChord} transparent animationType="fade" onRequestClose={() => setSelectedChord(null)}>
        <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' }} activeOpacity={1} onPress={() => setSelectedChord(null)}>
          <View className={`p-8 rounded-3xl ${isDarkMode ? 'bg-surface-dark' : 'bg-white'}`} style={{ width: 220, alignItems: 'center' }}>
            {selectedChord && <ChordDiagram chordName={selectedChord} />}
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal visible={showNotesModal} transparent animationType="fade" onRequestClose={() => setShowNotesModal(false)}>
        <TouchableOpacity className="flex-1 bg-black/50 justify-center items-center" activeOpacity={1} onPress={() => setShowNotesModal(false)}>
          <TouchableOpacity activeOpacity={1} onPress={() => {}} className={`w-5/6 max-w-md rounded-3xl p-6 ${isDarkMode ? 'bg-surface-dark' : 'bg-white'}`}>
            <Text className={`font-bold text-lg mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Notas — {hymn.title}
            </Text>
            <TextInput
              multiline
              placeholder="Escribe tus notas aquí..."
              placeholderTextColor={isDarkMode ? '#64748B' : '#9CA3AF'}
              value={noteText}
              onChangeText={setNoteText}
              className={`min-h-[160px] p-4 rounded-2xl text-base leading-relaxed ${isDarkMode ? 'bg-background-dark text-white' : 'bg-gray-50 text-slate-900'}`}
            />
            <View className="flex-row justify-end mt-4 gap-x-3">
              <TouchableOpacity
                onPress={() => setShowNotesModal(false)}
                className={`px-5 py-3 rounded-xl ${isDarkMode ? 'bg-background-dark' : 'bg-gray-100'}`}
              >
                <Text className={`font-semibold ${isDarkMode ? 'text-muted-dark' : 'text-muted'}`}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setSongNote(hymnIdKey, noteText);
                  setShowNotesModal(false);
                }}
                className={`px-5 py-3 rounded-xl ${isDarkMode ? 'bg-primary-dark' : 'bg-primary'}`}
              >
                <Text className="font-semibold text-white">Guardar</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <Modal visible={showSetlistModal} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/50">
          <View className={`rounded-t-3xl p-6 pb-12 ${isDarkMode ? 'bg-surface-dark' : 'bg-white'}`}>
            <View className="flex-row justify-between items-center mb-6">
              <Text className={`font-serif text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                Añadir a Repertorio
              </Text>
              <TouchableOpacity onPress={() => setShowSetlistModal(false)} className={`p-2 rounded-full ${isDarkMode ? 'bg-background-dark' : 'bg-slate-100'}`}>
                <X color={isDarkMode ? '#fff' : '#000'} size={20} />
              </TouchableOpacity>
            </View>
            <ScrollView className="max-h-80">
              {setlists.map(list => (
                <TouchableOpacity
                  key={list.id}
                  onPress={() => {
                    addHymnToSetlist(list.id, hymnIdKey);
                    setShowSetlistModal(false);
                    Alert.alert('¡Añadido!', `La canción se añadió a "${list.name}"`);
                  }}
                  className={`flex-row items-center p-4 mb-3 rounded-2xl border ${isDarkMode ? 'bg-background-dark border-slate-700' : 'bg-slate-50 border-slate-200'}`}
                >
                  <ListPlus color={isDarkMode ? '#818CF8' : '#4F46E5'} size={24} />
                  <Text className={`ml-4 font-bold text-lg ${isDarkMode ? 'text-white' : 'text-black'}`}>
                    {list.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
