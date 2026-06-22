import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Svg, { Line, Circle, Text as SvgText, Rect } from 'react-native-svg';
import { getChordDiagram } from '../data/chordDiagrams';
import { useIsDarkMode } from '../utils/useIsDarkMode';

interface ChordDiagramProps {
  chordName: string;
  width?: number;
  height?: number;
}

export default function ChordDiagram({ chordName, width = 160, height = 150 }: ChordDiagramProps) {
  const isDarkMode = useIsDarkMode();
  const chordData = getChordDiagram(chordName);
  const [instrument, setInstrument] = useState<'piano' | 'guitar'>('piano');
  const hasGuitarDiagram = !!chordData?.frets;

  if (!chordData) {
    return (
      <View className="items-center justify-center p-4">
        <Text className={`${isDarkMode ? 'text-muted-dark' : 'text-muted'}`}>
          Diagrama no disponible para {chordName}
        </Text>
      </View>
    );
  }

  const strokeColor = isDarkMode ? '#FFFFFF' : '#000000';
  const nutColor = isDarkMode ? '#FFFFFF' : '#000000';
  const fingerColor = isDarkMode ? '#60A5FA' : '#3B82F6';
  const textColor = isDarkMode ? '#9CA3AF' : '#4B5563';

  const strings = 6;
  const frets = 5;
  const gTopPad = 30, gBotPad = 10, gLeftPad = 25, gRightPad = 15;
  const gGridW = width - gLeftPad - gRightPad;
  const gGridH = height - gTopPad - gBotPad;
  const stringSpace = gGridW / (strings - 1);
  const fretSpace = gGridH / frets;

  const whiteKeysCount = 14;
  const pTopPad = 30, pBotPad = 10, pLeftPad = 10, pRightPad = 10;
  const keyW = (width - pLeftPad - pRightPad) / whiteKeysCount;
  const keyH = height - pTopPad - pBotPad;
  const blackKeyW = keyW * 0.6;
  const blackKeyH = keyH * 0.6;

  const whiteKeyIndexes = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19, 21, 23];
  const blackKeyIndexes = [1, 3, 6, 8, 10, 13, 15, 18, 20, 22];

  const getWhiteKeyPos = (note: number) => whiteKeyIndexes.indexOf(note);
  const getBlackKeyOffset = (note: number) => {
    const prevWhite = whiteKeyIndexes.slice().reverse().find(w => w < note) || 0;
    const pos = getWhiteKeyPos(prevWhite);
    return pLeftPad + (pos * keyW) + (keyW - blackKeyW / 2);
  };

  return (
    <View className="items-center">
      <View className="flex-row items-center justify-between w-full px-2 mb-2">
        <Text className={`text-xl font-bold ${isDarkMode ? 'text-text-dark' : 'text-text'}`}>
          {chordName}
        </Text>
        <TouchableOpacity
          onPress={() => setInstrument(prev => prev === 'piano' ? 'guitar' : 'piano')}
          className={`px-3 py-1 rounded-full ${!hasGuitarDiagram ? 'opacity-30' : ''} ${isDarkMode ? 'bg-surface-dark border border-slate-700' : 'bg-slate-100'}`}
          disabled={!hasGuitarDiagram}
        >
          <Text className={`text-xs font-bold ${isDarkMode ? 'text-primary-dark' : 'text-primary'}`}>
            {instrument === 'piano' ? 'PIANO' : 'GUITARRA'}
          </Text>
        </TouchableOpacity>
      </View>

      {!hasGuitarDiagram && instrument === 'guitar' && (
        <Text className={`text-xs mb-1 ${isDarkMode ? 'text-muted-dark' : 'text-muted'}`}>
          Solo diagrama de piano disponible
        </Text>
      )}

      <Svg width={width} height={height}>
        {(instrument === 'guitar' && hasGuitarDiagram) ? (
          <>
            {chordData.baseFret! > 1 && (
              <SvgText x={gLeftPad - 10} y={gTopPad + fretSpace / 2 + 5} fill={textColor} fontSize="14" fontWeight="bold" textAnchor="end">
                {chordData.baseFret}fr
              </SvgText>
            )}
            {chordData.baseFret === 1 && (
              <Line x1={gLeftPad} y1={gTopPad} x2={gLeftPad + gGridW} y2={gTopPad} stroke={nutColor} strokeWidth="4" />
            )}
            {[...Array(frets + 1)].map((_, i) => (
              <Line key={`f-${i}`} x1={gLeftPad} y1={gTopPad + i * fretSpace} x2={gLeftPad + gGridW} y2={gTopPad + i * fretSpace} stroke={strokeColor} strokeWidth="1" />
            ))}
            {[...Array(strings)].map((_, i) => (
              <Line key={`s-${i}`} x1={gLeftPad + i * stringSpace} y1={gTopPad} x2={gLeftPad + i * stringSpace} y2={gTopPad + gGridH} stroke={strokeColor} strokeWidth={i < 3 ? "2" : "1"} />
            ))}
            {chordData.frets!.map((fret, i) => {
              if (fret === -1) return <SvgText key={`m-${i}`} x={gLeftPad + i * stringSpace} y={gTopPad - 10} fill={strokeColor} fontSize="12" fontWeight="bold" textAnchor="middle">X</SvgText>;
              if (fret === 0) return <Circle key={`o-${i}`} cx={gLeftPad + i * stringSpace} cy={gTopPad - 12} r="4" stroke={strokeColor} strokeWidth="1" fill="none" />;
              return null;
            })}
            {chordData.barres?.map((barre, i) => {
              const relFret = barre.fret - chordData.baseFret! + 1;
              const y = gTopPad + (relFret - 0.5) * fretSpace;
              const x1 = gLeftPad + barre.stringFrom * stringSpace;
              const x2 = gLeftPad + barre.stringTo * stringSpace;
              return <Rect key={`b-${i}`} x={x1 - 8} y={y - 8} width={x2 - x1 + 16} height="16" rx="8" fill={fingerColor} />;
            })}
            {chordData.frets!.map((fret, i) => {
              if (fret > 0) {
                const relFret = fret - chordData.baseFret! + 1;
                const isBarre = chordData.barres?.some(b => b.fret === fret && i >= b.stringFrom && i <= b.stringTo);
                return (
                  <React.Fragment key={`fng-${i}`}>
                    {!isBarre && <Circle cx={gLeftPad + i * stringSpace} cy={gTopPad + (relFret - 0.5) * fretSpace} r="8" fill={fingerColor} />}
                    {chordData.fingers![i] > 0 && (
                      <SvgText x={gLeftPad + i * stringSpace} y={gTopPad + (relFret - 0.5) * fretSpace + 4} fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">
                        {chordData.fingers![i]}
                      </SvgText>
                    )}
                  </React.Fragment>
                );
              }
              return null;
            })}
          </>
        ) : (
          <>
            {whiteKeyIndexes.map((note, i) => {
              const isPressed = chordData.pianoNotes.includes(note);
              return (
                <Rect
                  key={`wk-${i}`}
                  x={pLeftPad + i * keyW}
                  y={pTopPad}
                  width={keyW}
                  height={keyH}
                  fill={isPressed ? fingerColor : (isDarkMode ? '#334155' : '#FFFFFF')}
                  stroke={isDarkMode ? '#1E293B' : '#000000'}
                  strokeWidth="1"
                />
              );
            })}
            {blackKeyIndexes.map((note, i) => {
              const isPressed = chordData.pianoNotes.includes(note);
              return (
                <Rect
                  key={`bk-${i}`}
                  x={getBlackKeyOffset(note)}
                  y={pTopPad}
                  width={blackKeyW}
                  height={blackKeyH}
                  fill={isPressed ? fingerColor : (isDarkMode ? '#0F172A' : '#000000')}
                />
              );
            })}
          </>
        )}
      </Svg>
    </View>
  );
}
