import { View, Text, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useMemo, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import { mockHymns } from '../data/hymns';
import { ArrowLeft, Heart, Minus, Plus, ZoomIn, ZoomOut, Share } from 'lucide-react-native';
import { parseLyricsToWords } from '../utils/lyricsParser';
import { transposeChord } from '../utils/chordTransposer';
import { MotiView } from 'moti';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

export default function HymnDetailScreen({ route, navigation }: any) {
  const { hymnId, isCustom, hymn: customHymn } = route.params;
  const isDarkMode = useAppStore((state) => state.theme === 'dark');
  const fontSize = useAppStore((state) => state.fontSize);
  const setFontSize = useAppStore((state) => state.setFontSize);
  const favorites = useAppStore((state) => state.favorites);
  const toggleFavorite = useAppStore((state) => state.toggleFavorite);
  
  const viewRef = useRef(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const hymn = isCustom ? customHymn : mockHymns.find(h => h.id === hymnId);
  const [showChords, setShowChords] = useState(true);
  const [transposeSteps, setTransposeSteps] = useState(0);
  
  const isFavorite = favorites.includes(hymnId || (hymn?.title));

  const parsedLines = useMemo(() => {
    if (!hymn) return [];
    return parseLyricsToWords(hymn.lyrics);
  }, [hymn]);

  const renderColoredPlainText = (lyrics: string, steps: number, showChords: boolean, isDark: boolean) => {
    if (!showChords) {
      const lines = lyrics.split('\n');
      const cleanLines: string[] = [];
      
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) {
          if (cleanLines.length > 0 && cleanLines[cleanLines.length - 1] !== '') {
            cleanLines.push('');
          }
          continue;
        }
        const words = trimmed.split(/[\s/|-]+/).filter(w => w.length > 0 && !w.includes('//'));
        const chordCount = words.filter(w => /^[CDEFGAB][b#]?(?:m|maj|dim|aug|sus|add|[0-9])*$/i.test(w) || /^(Do|Re|Mi|Fa|Sol|La|Si)[b#]?(?:m|maj|dim|aug|sus|add|[0-9])*$/i.test(w)).length;
        const isChordLine = words.length > 0 && chordCount / words.length >= 0.6;
        if (!isChordLine && !/^[-\s]+$/.test(trimmed)) {
          cleanLines.push(trimmed);
        }
      }
      return <Text className="text-center">{cleanLines.join('\n')}</Text>;
    }

    const lines = lyrics.split('\n');
    return lines.map((line, i) => {
      const trimmed = line.trim();
      const words = trimmed.split(/[\s/|-]+/).filter(w => w.length > 0 && !w.includes('//'));
      const chordCount = words.filter(w => /^[A-G][b#]?(?:m|maj|dim|aug|sus|add|[0-9])*$/.test(w)).length;
      const isChordLine = words.length > 0 && chordCount / words.length >= 0.6;

      if (isChordLine) {
        const chordRegexExact = /^[A-G][b#]?(?:m|maj|dim|aug|sus|add|[0-9])*$/;
        const chunks = line.split(/(\s+)/).map((chunk, j) => {
          if (chordRegexExact.test(chunk)) {
            return <Text key={j} className={isDark ? "text-accent-dark font-bold" : "text-accent font-bold"}>{transposeChord(chunk, steps)}</Text>;
          }
          return <Text key={j}>{chunk}</Text>;
        });
        return <Text key={i}>{chunks}{'\n'}</Text>;
      }
      return <Text key={i}>{line}{'\n'}</Text>;
    });
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

  if (!hymn) {
    return (
      <View className={`flex-1 justify-center items-center ${isDarkMode ? 'bg-background-dark' : 'bg-background'}`}>
        <Text className={isDarkMode ? 'text-white' : 'text-black'}>Himno no encontrado</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-background-dark' : 'bg-background'}`}>
      <View className="flex-row items-center justify-between px-6 py-4 shadow-sm z-10" style={{ backgroundColor: isDarkMode ? 'rgba(2, 6, 23, 0.8)' : 'rgba(248, 250, 252, 0.8)' }}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className={`p-3 rounded-2xl ${isDarkMode ? 'bg-surface-dark' : 'bg-white'} shadow-sm`}
        >
          <ArrowLeft color={isDarkMode ? '#818CF8' : '#4F46E5'} size={24} />
        </TouchableOpacity>
        
        <View className="flex-row items-center gap-x-2">
          <TouchableOpacity onPress={() => setFontSize(Math.min(fontSize + 2, 32))} className="p-3">
            <ZoomIn color={isDarkMode ? '#9CA3AF' : '#6B7280'} size={20} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFontSize(Math.max(fontSize - 2, 12))} className="p-3">
            <ZoomOut color={isDarkMode ? '#9CA3AF' : '#6B7280'} size={20} />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleShare}
            className={`p-3 rounded-2xl ${isDarkMode ? 'bg-surface-dark' : 'bg-white'} shadow-sm ${isCapturing ? 'opacity-50' : ''}`}
            disabled={isCapturing}
          >
            <Share color={isDarkMode ? '#9CA3AF' : '#6B7280'} size={20} />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => toggleFavorite(hymnId)}
            className={`p-3 rounded-2xl ${isDarkMode ? 'bg-surface-dark' : 'bg-white'} shadow-sm`}
          >
            <MotiView animate={{ scale: isFavorite ? 1.2 : 1 }} transition={{ type: 'spring' }}>
              <Heart 
                color={isFavorite ? '#EF4444' : (isDarkMode ? '#F9FAFB' : '#111827')} 
                fill={isFavorite ? '#EF4444' : 'transparent'}
                size={24} 
              />
            </MotiView>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <View ref={viewRef} collapsable={false} className={isDarkMode ? 'bg-background-dark' : 'bg-background'}>
          <MotiView 
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            className="mt-4 mb-8"
          >
            <View className="flex-row items-center mb-3">
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
              <Text className={`font-sans text-xs uppercase tracking-wider ${isDarkMode ? 'text-muted-dark' : 'text-muted'}`}>
                {hymn.category}
              </Text>
            </View>
            <Text className={`font-serif text-5xl font-bold leading-tight tracking-tight ${isDarkMode ? 'text-text-dark' : 'text-text'}`}>
              {hymn.title}
            </Text>
          </MotiView>

          <View className={`flex-row p-1.5 mb-8 rounded-2xl ${isDarkMode ? 'bg-surface-dark/80' : 'bg-white/80'} shadow-sm border border-slate-200/20`}>
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
          </View>

          <MotiView 
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 200 }}
            className="pb-32"
          >
            {isCustom ? (
               <Text 
                  className={`font-mono ${isDarkMode ? 'text-white' : 'text-black'}`}
                  style={{ fontSize, lineHeight: fontSize * 1.6 }}
               >
                  {renderColoredPlainText(hymn.lyrics, transposeSteps, showChords, isDarkMode)}
               </Text>
            ) : (
              parsedLines.map((line, lineIndex) => (
                <View key={lineIndex} className="flex-row flex-wrap mb-4" style={{ minHeight: showChords ? fontSize * 2.5 : fontSize * 1.5 }}>
                  {line.length === 0 ? (
                    <Text style={{ fontSize, lineHeight: fontSize * 1.5 }}> </Text>
                  ) : (
                    line.map((segment, segIndex) => (
                      <View key={segIndex} className="flex-col">
                        {showChords && (
                          <Text 
                            className={`font-mono font-bold ${isDarkMode ? 'text-accent-dark' : 'text-accent'}`}
                            style={{ fontSize: fontSize * 0.75, height: fontSize, marginBottom: 2 }}
                          >
                            {segment.chord ? transposeChord(segment.chord, transposeSteps) : ' '}
                          </Text>
                        )}
                        <Text 
                          className={`font-serif ${isDarkMode ? 'text-text-dark/90' : 'text-text/90'}`}
                          style={{ fontSize, lineHeight: fontSize * 1.5 }}
                        >
                          {segment.text}
                        </Text>
                      </View>
                    ))
                  )}
                </View>
              ))
            )}
          </MotiView>
        </View>
      </ScrollView>

      {showChords && (
        <MotiView 
          from={{ opacity: 0, translateY: 50, scale: 0.9 }}
          animate={{ opacity: 1, translateY: 0, scale: 1 }}
          className={`absolute bottom-8 self-center flex-row items-center justify-between px-6 py-4 rounded-3xl shadow-2xl border ${
            isDarkMode ? 'bg-surface-dark border-slate-700/50 shadow-primary-dark/20' : 'bg-white border-slate-100 shadow-primary/20'
          }`}
          style={{ width: '85%', maxWidth: 320 }}
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
    </SafeAreaView>
  );
}
