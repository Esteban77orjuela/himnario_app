import { transposeChord } from './src/utils/chordTransposer';

console.log('\n=======================================');
console.log('🎸 PRUEBA DEL MOTOR DE TRANSPOSICIÓN 🎸');
console.log('=======================================');
console.log('Caso 1: Do + 2 semitonos (Debe ser Re):', transposeChord('Do', 2));
console.log('Caso 2: Sim7 - 1 semitono (Debe ser La#m7):', transposeChord('Sim7', -1));
console.log('Caso 3: Rebmaj7 + 0 semitonos (Debe normalizar a Do#maj7):', transposeChord('Rebmaj7', 0));
console.log('Caso 4: Fa# + 5 semitonos (Debe ser Si):', transposeChord('Fa#', 5));
console.log('=======================================\n');
