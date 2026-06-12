import { View, Text, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { mockHymns } from '../data/hymns';
import { ArrowLeft, Heart, Minus, Plus, ZoomIn, ZoomOut } from 'lucide-react-native';
import { parseLyricsToWords } from '../utils/lyricsParser';
import { transposeChord } from '../utils/chordTransposer';
import { MotiView } from 'moti';

export default function HymnDetailScreen({ route, navigation }: any) {
  const { hymnId, isCustom, hymn: customHymn } = route.params;
  const isDarkMode = useAppStore((state) => state.theme === 'dark');
  const fontSize = useAppStore((state) => state.fontSize);
  const setFontSize = useAppStore((state) => state.setFontSize);
  const favorites = useAppStore((state) => state.favorites);
  const toggleFavorite = useAppStore((state) => state.toggleFavorite);
  
  const hymn = isCustom ? customHymn : mockHymns.find(h => h.id === hymnId);
  const [showChords, setShowChords] = useState(true);
  const [transposeSteps, setTransposeSteps] = useState(0);
  
  const isFavorite = favorites.includes(hymnId || (hymn?.title));

  const parsedLines = useMemo(() => {
    if (!hymn) return [];
    return parseLyricsToWords(hymn.lyrics);
  }, [hymn]);

  if (!hymn) {
    return (
      <View className={`flex-1 justify-center items-center ${isDarkMode ? 'bg-background-dark' : 'bg-background'}`}>
        <Text className={isDarkMode ? 'text-white' : 'text-black'}>Himno no encontrado</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-background-dark' : 'bg-background'}`}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className={`p-3 rounded-full ${isDarkMode ? 'bg-white/10' : 'bg-black/5'}`}
        >
          <ArrowLeft color={isDarkMode ? '#F9FAFB' : '#111827'} size={24} />
        </TouchableOpacity>
        
        <View className="flex-row items-center gap-x-2">
          <TouchableOpacity 
            onPress={() => setFontSize(Math.min(fontSize + 2, 32))}
            className="p-3"
          >
            <ZoomIn color={isDarkMode ? '#9CA3AF' : '#6B7280'} size={20} />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setFontSize(Math.max(fontSize - 2, 12))}
            className="p-3"
          >
            <ZoomOut color={isDarkMode ? '#9CA3AF' : '#6B7280'} size={20} />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => toggleFavorite(hymnId)}
            className={`p-3 rounded-full ${isDarkMode ? 'bg-white/10' : 'bg-black/5'}`}
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
        {/* Title Section */}
        <MotiView 
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          className="mt-4 mb-8"
        >
          <View className="flex-row items-center mb-2">
            <Text className={`font-sans font-bold tracking-widest text-sm uppercase ${isDarkMode ? 'text-primary-dark' : 'text-primary'}`}>
              Himno {hymn.number.toString().padStart(2, '0')}
            </Text>
            <View className={`h-[1px] flex-1 mx-4 ${isDarkMode ? 'bg-white/10' : 'bg-black/10'}`} />
            <Text className={`font-sans text-xs italic ${isDarkMode ? 'text-muted-dark' : 'text-muted'}`}>
              Categoría: {hymn.category}
            </Text>
          </View>
          <Text className={`font-serif text-4xl font-bold leading-tight ${isDarkMode ? 'text-text-dark' : 'text-text'}`}>
            {hymn.title}
          </Text>
        </MotiView>

        {/* Toggle Chords */}
        <View className={`flex-row p-1 mb-8 rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-black/5'}`}>
          <Pressable 
            onPress={() => setShowChords(false)}
            className={`flex-1 py-3 rounded-lg items-center ${!showChords ? (isDarkMode ? 'bg-white/10' : 'bg-white shadow-sm') : ''}`}
          >
            <Text className={`font-sans font-medium ${!showChords ? (isDarkMode ? 'text-white' : 'text-black') : (isDarkMode ? 'text-muted-dark' : 'text-muted')}`}>
              Letra
            </Text>
          </Pressable>
          <Pressable 
            onPress={() => setShowChords(true)}
            className={`flex-1 py-3 rounded-lg items-center ${showChords ? (isDarkMode ? 'bg-white/10' : 'bg-white shadow-sm') : ''}`}
          >
            <Text className={`font-sans font-medium ${showChords ? (isDarkMode ? 'text-white' : 'text-black') : (isDarkMode ? 'text-muted-dark' : 'text-muted')}`}>
              Con Notas
            </Text>
          </Pressable>
        </View>

        {/* Lyrics Content */}
        <MotiView 
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 200 }}
          className="pb-32"
        >
          {parsedLines.map((line, lineIndex) => (
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
          ))}
        </MotiView>
      </ScrollView>

      {/* Floating Transposer Bar (Mini-Player style) */}
      {showChords && (
        <MotiView 
          from={{ opacity: 0, translateY: 50 }}
          animate={{ opacity: 1, translateY: 0 }}
          className={`absolute bottom-8 self-center flex-row items-center justify-between px-6 py-3 rounded-full shadow-lg border ${
            isDarkMode ? 'bg-slate-800 border-slate-700 shadow-black/50' : 'bg-white border-slate-200 shadow-slate-300'
          }`}
          style={{ width: '80%', maxWidth: 300 }}
        >
          <TouchableOpacity 
            onPress={() => setTransposeSteps(prev => prev - 1)}
            className={`p-3 rounded-full ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}
          >
            <Minus size={20} color={isDarkMode ? '#F8FAFC' : '#0F172A'} />
          </TouchableOpacity>
          
          <View className="items-center px-4">
            <Text className={`font-sans text-xs uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Tono</Text>
            <Text className={`font-mono font-bold text-lg ${isDarkMode ? 'text-white' : 'text-black'}`}>
              {transposeSteps > 0 ? `+${transposeSteps}` : transposeSteps}
            </Text>
          </View>

          <TouchableOpacity 
            onPress={() => setTransposeSteps(prev => prev + 1)}
            className={`p-3 rounded-full ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}
          >
            <Plus size={20} color={isDarkMode ? '#F8FAFC' : '#0F172A'} />
          </TouchableOpacity>
        </MotiView>
      )}
    </SafeAreaView>
  );
}
