import type { NativeStackScreenProps, NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { Hymn } from '../data/hymns';

export type RootStackParamList = {
  Main: undefined;
  HymnDetail: {
    hymnId: string;
    isCustom?: boolean;
    hymn?: Hymn;
  };
  SetlistDetail: {
    setlistId: string;
    setlistName: string;
  };
};

export type MainTabParamList = {
  Inicio: undefined;
  Importar: undefined;
  Repertorios: undefined;
  Ajustes: undefined;
};

export type HymnDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'HymnDetail'>;
export type SetlistDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'SetlistDetail'>;

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;
