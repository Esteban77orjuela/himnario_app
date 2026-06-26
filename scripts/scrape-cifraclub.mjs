import * as cheerio from 'cheerio';
import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT = resolve(__dirname, '..', 'src', 'data', 'christianSongs.ts');

const SONGS = [

  // MARCOS WITT (10)
  { url: 'https://www.cifraclub.com/marcos-witt/renuevame/', title: 'Renuévame', artist: 'Marcos Witt', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/marcos-witt/enamorame/', title: 'Enamórame', artist: 'Marcos Witt', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/marcos-witt/temprano-yo-te-buscare/', title: 'Temprano Yo Te Buscaré', artist: 'Marcos Witt', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/marcos-witt/cuan-bello-es-el-senor/', title: 'Cuán Bello es el Señor', artist: 'Marcos Witt', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/marcos-witt/gracias/', title: 'Gracias', artist: 'Marcos Witt', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/marcos-witt/tu-fidelidad/', title: 'Tu Fidelidad', artist: 'Marcos Witt', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/marcos-witt/al-que-es-digno/', title: 'Al Que Es Digno', artist: 'Marcos Witt', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/marcos-witt/dios-ha-sido-bueno/', title: 'Dios Ha Sido Bueno', artist: 'Marcos Witt', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/marcos-witt/enciende-una-luz/', title: 'Enciende Una Luz', artist: 'Marcos Witt', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/marcos-witt/yo-te-busco/', title: 'Yo Te Busco', artist: 'Marcos Witt', category: 'Adoración' },

  // JESÚS ADRIÁN ROMERO (10)
  { url: 'https://www.cifraclub.com/jesus-adrian-romero/mi-universo/', title: 'Mi Universo', artist: 'Jesús Adrián Romero', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/jesus-adrian-romero/sumergeme/', title: 'Sumérgeme', artist: 'Jesús Adrián Romero', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/jesus-adrian-romero/a-sus-pies/', title: 'A Sus Pies', artist: 'Jesús Adrián Romero', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/jesus-adrian-romero/cerca-de-ti/', title: 'Cerca de Ti', artist: 'Jesús Adrián Romero', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/jesus-adrian-romero/el-aire-de-tu-casa/', title: 'El Aire de Tu Casa', artist: 'Jesús Adrián Romero', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/jesus-adrian-romero/que-seria-de-mi/', title: 'Qué Sería de Mí', artist: 'Jesús Adrián Romero', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/jesus-adrian-romero/tu-estas-aqui/', title: 'Tú Estás Aquí', artist: 'Jesús Adrián Romero', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/jesus-adrian-romero/aqui-estoy/', title: 'Aquí Estoy', artist: 'Jesús Adrián Romero', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/jesus-adrian-romero/sentado-en-su-trono/', title: 'Sentado en su Trono', artist: 'Jesús Adrián Romero', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/jesus-adrian-romero/nada-sin-ti/', title: 'Nada Sin Ti', artist: 'Jesús Adrián Romero', category: 'Adoración' },

  // ALEX CAMPOS (10)
  { url: 'https://www.cifraclub.com/alex-campos/al-taller-del-maestro/', title: 'Al Taller del Maestro', artist: 'Alex Campos', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/alex-campos/tu-poeta/', title: 'Tu Poeta', artist: 'Alex Campos', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/alex-campos/el-sonido-del-silencio/', title: 'El Sonido del Silencio', artist: 'Alex Campos', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/alex-campos/sueno-de-morir/', title: 'Sueño de Morir', artist: 'Alex Campos', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/alex-campos/me-robaste-el-corazon/', title: 'Me Robaste El Corazón', artist: 'Alex Campos', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/alex-campos/derroche-de-amor/', title: 'Derroche de Amor', artist: 'Alex Campos', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/alex-campos/hazme-instrumento/', title: 'Hazme Instrumento', artist: 'Alex Campos', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/alex-campos/el-sonido-de-tu-amor/', title: 'El Sonido de Tu Amor', artist: 'Alex Campos', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/alex-campos/te-veo-venir/', title: 'Te Veo Venir', artist: 'Alex Campos', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/alex-campos/la-pasion-de-cristo/', title: 'La Pasión de Cristo', artist: 'Alex Campos', category: 'Adoración' },

  // DANILO MONTERO (10)
  { url: 'https://www.cifraclub.com/danilo-montero/eres-todopoderoso/', title: 'Eres Todopoderoso', artist: 'Danilo Montero', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/danilo-montero/sentado-en-su-trono/', title: 'Sentado En Su Trono', artist: 'Danilo Montero', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/danilo-montero/la-casa-de-dios/', title: 'La Casa de Dios', artist: 'Danilo Montero', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/danilo-montero/cantare-de-tu-amor/', title: 'Cantaré de Tu Amor', artist: 'Danilo Montero', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/danilo-montero/has-aumentado/', title: 'Has Aumentado', artist: 'Danilo Montero', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/danilo-montero/bueno-es-alabar/', title: 'Bueno es Alabar', artist: 'Danilo Montero', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/danilo-montero/en-ti-confio/', title: 'En Ti Confío', artist: 'Danilo Montero', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/danilo-montero/dios-de-pactos/', title: 'Dios de Pactos', artist: 'Danilo Montero', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/danilo-montero/el-nombre-del-senor/', title: 'El Nombre Del Señor', artist: 'Danilo Montero', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/danilo-montero/tu-nombre-es-poderoso/', title: 'Tu Nombre Es Poderoso', artist: 'Danilo Montero', category: 'Alabanza' },

  // MARCO BARRIENTOS (10)
  { url: 'https://www.cifraclub.com/marcos-barrientos/hosanna/', title: 'Hosanna', artist: 'Marco Barrientos', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/marcos-barrientos/ven-espiritu-ven/', title: 'Ven Espíritu Ven', artist: 'Marco Barrientos', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/marcos-barrientos/de-gloria-en-gloria/', title: 'De Gloria en Gloria', artist: 'Marco Barrientos', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/marcos-barrientos/nada-es-imposible/', title: 'Nada es Imposible', artist: 'Marco Barrientos', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/marcos-barrientos/sin-reservas/', title: 'Sin Reservas', artist: 'Marco Barrientos', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/marcos-barrientos/derrama-tu-poder/', title: 'Derrama Tu Poder', artist: 'Marco Barrientos', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/marcos-barrientos/manantial/', title: 'Manantial', artist: 'Marco Barrientos', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/marcos-barrientos/espiritu/', title: 'Espíritu', artist: 'Marco Barrientos', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/marcos-barrientos/abre-mis-ojos/', title: 'Abre Mis Ojos', artist: 'Marco Barrientos', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/marcos-barrientos/soberano/', title: 'Soberano', artist: 'Marco Barrientos', category: 'Adoración' },

  // JULIO MELGAR (10)
  { url: 'https://www.cifraclub.com/julio-melgar/creo-en-ti/', title: 'Creo en Ti', artist: 'Julio Melgar', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/julio-melgar/ya-no-soy-esclavo/', title: 'Ya No Soy Esclavo', artist: 'Julio Melgar', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/julio-melgar/aleluya/', title: 'Aleluya', artist: 'Julio Melgar', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/julio-melgar/cuerdas-de-amor/', title: 'Cuerdas de Amor', artist: 'Julio Melgar', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/julio-melgar/estas-aqui/', title: 'Estás Aquí', artist: 'Julio Melgar', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/julio-melgar/tu-amor-no-falla/', title: 'Tu Amor No Falla', artist: 'Julio Melgar', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/julio-melgar/bendito-seas-senor/', title: 'Bendito Seas Señor', artist: 'Julio Melgar', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/julio-melgar/espiritu-santo/', title: 'Espíritu Santo', artist: 'Julio Melgar', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/julio-melgar/quiero-mas-de-ti/', title: 'Quiero Más de Ti', artist: 'Julio Melgar', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/julio-melgar/anhelo-adorarte/', title: 'Anhelo Adorarte', artist: 'Julio Melgar', category: 'Adoración' },

  // MIEL SAN MARCOS (10)
  { url: 'https://www.cifraclub.com/miel-san-marcos/no-hay-lugar-mas-alto/', title: 'No Hay Lugar Más Alto', artist: 'Miel San Marcos', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/miel-san-marcos/increible/', title: 'Increíble', artist: 'Miel San Marcos', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/miel-san-marcos/levantate-senor/', title: 'Levántate Señor', artist: 'Miel San Marcos', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/miel-san-marcos/grande-y-fuerte/', title: 'Grande y Fuerte', artist: 'Miel San Marcos', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/miel-san-marcos/danza-en-el-rio/', title: 'Danza En El Río', artist: 'Miel San Marcos', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/miel-san-marcos/proezas/', title: 'Proezas', artist: 'Miel San Marcos', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/miel-san-marcos/magnificate/', title: 'Magnificate', artist: 'Miel San Marcos', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/miel-san-marcos/rey-de-reyes/', title: 'Rey de Reyes', artist: 'Miel San Marcos', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/miel-san-marcos/en-el-nombre-del-senor/', title: 'En El Nombre Del Señor', artist: 'Miel San Marcos', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/miel-san-marcos/todo-el-cielo/', title: 'Todo el Cielo', artist: 'Miel San Marcos', category: 'Adoración' },

  // HILLSONG UNITED (10)
  { url: 'https://www.cifraclub.com/hillsong-united/oceans/', title: 'Oceans (Where Feet May Fail)', artist: 'Hillsong United', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/hillsong-united/lead-me-to-the-cross/', title: 'Lead Me To The Cross', artist: 'Hillsong United', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/hillsong-united/touch-the-sky/', title: 'Touch The Sky', artist: 'Hillsong United', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/hillsong-united/so-will-i/', title: 'So Will I', artist: 'Hillsong United', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/hillsong-united/king-of-kings/', title: 'King of Kings', artist: 'Hillsong United', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/hillsong-united/tenerife-sea/', title: 'Tenerife Sea', artist: 'Hillsong United', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/hillsong-united/break-free/', title: 'Break Free', artist: 'Hillsong United', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/hillsong-united/sinking-deep/', title: 'Sinking Deep', artist: 'Hillsong United', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/hillsong-united/empires/', title: 'Empires', artist: 'Hillsong United', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/hillsong-united/prince-of-peace/', title: 'Prince of Peace', artist: 'Hillsong United', category: 'Adoración' },

  // HILLSONG WORSHIP (10)
  { url: 'https://www.cifraclub.com/hillsong-worship/what-a-beautiful-name/', title: 'What a Beautiful Name', artist: 'Hillsong Worship', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/hillsong-worship/still/', title: 'Still', artist: 'Hillsong Worship', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/hillsong-worship/forever-reign/', title: 'Forever Reign', artist: 'Hillsong Worship', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/hillsong-worship/here-i-am-send-me/', title: 'Here I Am Send Me', artist: 'Hillsong Worship', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/hillsong-worship/none-but-jesus/', title: 'None But Jesus', artist: 'Hillsong Worship', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/hillsong-worship/mighty-to-save/', title: 'Mighty to Save', artist: 'Hillsong Worship', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/hillsong-worship/hosanna/', title: 'Hosanna', artist: 'Hillsong Worship', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/hillsong-worship/from-the-inside-out/', title: 'From The Inside Out', artist: 'Hillsong Worship', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/hillsong-worship/shout-to-the-lord/', title: 'Shout To The Lord', artist: 'Hillsong Worship', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/hillsong-worship/this-i-believe-the-creed/', title: 'This I Believe (The Creed)', artist: 'Hillsong Worship', category: 'Adoración' },

  // HILLSONG EN ESPAÑOL (10)
  { url: 'https://www.cifraclub.com/hillsong-en-espanol/oceanos-donde-mis-pies-pueden-fallar/', title: 'Océanos', artist: 'Hillsong en Español', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/hillsong-en-espanol/vasijas-rotas/', title: 'Vasijas Rotas', artist: 'Hillsong en Español', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/hillsong-en-espanol/conmigo-estas/', title: 'Conmigo Estás', artist: 'Hillsong en Español', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/hillsong-en-espanol/hermoso-nombre/', title: 'Hermoso Nombre', artist: 'Hillsong en Español', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/hillsong-en-espanol/hosanna-espanol/', title: 'Hosanna', artist: 'Hillsong en Español', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/hillsong-en-espanol/todo-lo-que-tengo/', title: 'Todo Lo Que Tengo', artist: 'Hillsong en Español', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/hillsong-en-espanol/desde-lo-profundo/', title: 'Desde Lo Profundo', artist: 'Hillsong en Español', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/hillsong-en-espanol/mi-esperanza/', title: 'Mi Esperanza', artist: 'Hillsong en Español', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/hillsong-en-espanol/te-alabo/', title: 'Te Alabo', artist: 'Hillsong en Español', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/hillsong-en-espanol/mighty-to-save-espanol/', title: 'Poderoso Para Salvar', artist: 'Hillsong en Español', category: 'Alabanza' },

  // ELEVATION WORSHIP (10)
  { url: 'https://www.cifraclub.com/elevation-worship/o-come-to-the-altar/', title: 'O Come To The Altar', artist: 'Elevation Worship', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/elevation-worship/do-it-again/', title: 'Do It Again', artist: 'Elevation Worship', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/elevation-worship/aqui-estoy/', title: 'Aquí Estoy', artist: 'Elevation Worship', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/elevation-worship/la-bendicion/', title: 'La Bendición', artist: 'Elevation Worship', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/elevation-worship/tumbas-jardines/', title: 'Tumbas a Jardines', artist: 'Elevation Worship', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/elevation-worship/lo-haras-otra-vez/', title: 'Lo Harás Otra Vez', artist: 'Elevation Worship', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/elevation-worship/graves-into-gardens/', title: 'Graves Into Gardens', artist: 'Elevation Worship', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/elevation-worship/see-a-victory/', title: 'See A Victory', artist: 'Elevation Worship', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/elevation-worship/rattle/', title: 'Rattle!', artist: 'Elevation Worship', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/elevation-worship/worthy/', title: 'Worthy', artist: 'Elevation Worship', category: 'Adoración' },

  // BARAK (10)
  { url: 'https://www.cifraclub.com/barak/ven-espiritu-santo/', title: 'Ven Espíritu Santo', artist: 'Barak', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/barak/hasta-ver-tu-gloria/', title: 'Hasta Ver Tu Gloria', artist: 'Barak', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/barak/la-tierra-canta/', title: 'La Tierra Canta', artist: 'Barak', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/barak/a-danzar/', title: 'A Danzar', artist: 'Barak', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/barak/tu-eres-rey/', title: 'Tú Eres Rey', artist: 'Barak', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/barak/yahweh/', title: 'Yahweh', artist: 'Barak', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/barak/escudo-y-defensor/', title: 'Escudo y Defensor', artist: 'Barak', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/barak/a-ti-clamo/', title: 'A Ti Clamo', artist: 'Barak', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/barak/dios-poderoso/', title: 'Dios Poderoso', artist: 'Barak', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/barak/eres-todo/', title: 'Eres Todo', artist: 'Barak', category: 'Adoración' },

  // CHRISTINE D'CLARIO (10)
  { url: 'https://www.cifraclub.com/christine-dclario/como-dijiste/', title: 'Como Dijiste', artist: "Christine D'Clario", category: 'Adoración' },
  { url: 'https://www.cifraclub.com/christine-dclario/magnifico/', title: 'Magnífico', artist: "Christine D'Clario", category: 'Adoración' },
  { url: 'https://www.cifraclub.com/christine-dclario/tu-presencia-es-el-cielo/', title: 'Tu Presencia Es El Cielo', artist: "Christine D'Clario", category: 'Adoración' },
  { url: 'https://www.cifraclub.com/christine-dclario/que-se-abra-el-cielo/', title: 'Que Se Abra El Cielo', artist: "Christine D'Clario", category: 'Adoración' },
  { url: 'https://www.cifraclub.com/christine-dclario/gloria-en-lo-alto/', title: 'Gloria En Lo Alto', artist: "Christine D'Clario", category: 'Adoración' },
  { url: 'https://www.cifraclub.com/christine-dclario/hoy-te-quiero-ver/', title: 'Hoy Te Quiero Ver', artist: "Christine D'Clario", category: 'Adoración' },
  { url: 'https://www.cifraclub.com/christine-dclario/danzo-sobre-las-aguas/', title: 'Danzo Sobre Las Aguas', artist: "Christine D'Clario", category: 'Adoración' },
  { url: 'https://www.cifraclub.com/christine-dclario/en-ti-confio/', title: 'En Ti Confío', artist: "Christine D'Clario", category: 'Adoración' },
  { url: 'https://www.cifraclub.com/christine-dclario/nada-me-separa/', title: 'Nada Me Separa', artist: "Christine D'Clario", category: 'Adoración' },
  { url: 'https://www.cifraclub.com/christine-dclario/salmo-23/', title: 'Salmo 23', artist: "Christine D'Clario", category: 'Adoración' },

  // MARCOS BRUNET (10)
  { url: 'https://www.cifraclub.com/marcos-brunet/al-que-esta-sentado-en-el-trono/', title: 'Al Que Está Sentado En El Trono', artist: 'Marcos Brunet', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/marcos-brunet/toma-tu-lugar/', title: 'Toma Tu Lugar', artist: 'Marcos Brunet', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/marcos-brunet/digno/', title: 'Digno', artist: 'Marcos Brunet', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/marcos-brunet/deseable/', title: 'Deseable', artist: 'Marcos Brunet', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/marcos-brunet/bella-eres/', title: 'Bella Eres', artist: 'Marcos Brunet', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/marcos-brunet/glorificado/', title: 'Glorificado', artist: 'Marcos Brunet', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/marcos-brunet/cuanto-te-amo/', title: 'Cuánto Te Amo', artist: 'Marcos Brunet', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/marcos-brunet/libre-y-vencedor/', title: 'Libre y Vencedor', artist: 'Marcos Brunet', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/marcos-brunet/que-hermoso-senor/', title: 'Qué Hermoso Señor', artist: 'Marcos Brunet', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/marcos-brunet/lluvias-de-fuego/', title: 'Lluvias de Fuego', artist: 'Marcos Brunet', category: 'Adoración' },

  // MARCELA GANDARA (10)
  { url: 'https://www.cifraclub.com/marcela-gandara/supe-que-me-amabas/', title: 'Supe Que Me Amabas', artist: 'Marcela Gandara', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/marcela-gandara/dame-tus-ojos/', title: 'Dame Tus Ojos', artist: 'Marcela Gandara', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/marcela-gandara/un-viaje-largo/', title: 'Un Viaje Largo', artist: 'Marcela Gandara', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/marcela-gandara/mas-que-un-anhelo/', title: 'Más Que Un Anhelo', artist: 'Marcela Gandara', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/marcela-gandara/mi-fortaleza/', title: 'Mi Fortaleza', artist: 'Marcela Gandara', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/marcela-gandara/gracias-por-la-cruz/', title: 'Gracias Por La Cruz', artist: 'Marcela Gandara', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/marcela-gandara/enamorada-de-ti/', title: 'Enamorada de Ti', artist: 'Marcela Gandara', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/marcela-gandara/nuestro-dios/', title: 'Nuestro Dios', artist: 'Marcela Gandara', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/marcela-gandara/gloria-a-ti/', title: 'Gloria a Ti', artist: 'Marcela Gandara', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/marcela-gandara/creador-de-amor/', title: 'Creador de Amor', artist: 'Marcela Gandara', category: 'Adoración' },

  // GENERACIÓN 12 (10)
  { url: 'https://www.cifraclub.com/generacion-12/dios-incomparable/', title: 'Dios Incomparable', artist: 'Generación 12', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/generacion-12/tu-amor-no-tiene-fin/', title: 'Tu Amor No Tiene Fin', artist: 'Generación 12', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/generacion-12/poder-hay-en-la-sangre/', title: 'Poder Hay En La Sangre', artist: 'Generación 12', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/generacion-12/rey-eterno/', title: 'Rey Eterno', artist: 'Generación 12', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/generacion-12/que-este-templo-sea/', title: 'Que Este Templo Sea', artist: 'Generación 12', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/generacion-12/llenalo/', title: 'Llénalos', artist: 'Generación 12', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/generacion-12/voz-de-dios/', title: 'Voz de Dios', artist: 'Generación 12', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/generacion-12/maranatha/', title: 'Maranatha', artist: 'Generación 12', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/generacion-12/necesito-mas-de-ti/', title: 'Necesito Más de Ti', artist: 'Generación 12', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/generacion-12/ven-espiritu-de-dios/', title: 'Ven Espíritu de Dios', artist: 'Generación 12', category: 'Adoración' },

  // ROJO (10)
  { url: 'https://www.cifraclub.com/rojo/solo-tu/', title: 'Solo Tú', artist: 'Rojo', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/rojo/ok/', title: 'Ok', artist: 'Rojo', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/rojo/hasta-que-ya-no-respire-mas/', title: 'Hasta Que Ya No Respire Más', artist: 'Rojo', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/rojo/supe-que-me-amabas/', title: 'Supe Que Me Amabas', artist: 'Rojo', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/rojo/mas-que-todo/', title: 'Más Que Todo', artist: 'Rojo', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/rojo/todo-lo-que-soy/', title: 'Todo Lo Que Soy', artist: 'Rojo', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/rojo/soy-salvo/', title: 'Soy Salvo', artist: 'Rojo', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/rojo/vivo-estoy/', title: 'Vivo Estoy', artist: 'Rojo', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/rojo/tu-amor-es-incondicional/', title: 'Tu Amor Es Incondicional', artist: 'Rojo', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/rojo/que-el-senor-te-guarde/', title: 'Que El Señor Te Guarde', artist: 'Rojo', category: 'Adoración' },

  // MAJO Y DAN (10)
  { url: 'https://www.cifraclub.com/majo-y-dan/te-deseo/', title: 'Te Deseo', artist: 'Majo y Dan', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/majo-y-dan/llueve/', title: 'Llueve', artist: 'Majo y Dan', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/majo-y-dan/fuego/', title: 'Fuego', artist: 'Majo y Dan', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/majo-y-dan/uno/', title: 'Uno', artist: 'Majo y Dan', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/majo-y-dan/eres-fiel/', title: 'Eres Fiel', artist: 'Majo y Dan', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/majo-y-dan/quiero-que-sepas/', title: 'Quiero Que Sepas', artist: 'Majo y Dan', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/majo-y-dan/mi-lugar/', title: 'Mi Lugar', artist: 'Majo y Dan', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/majo-y-dan/sin-palabras/', title: 'Sin Palabras', artist: 'Majo y Dan', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/majo-y-dan/nadie-como-tu/', title: 'Nadie Como Tú', artist: 'Majo y Dan', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/majo-y-dan/mas-de-ti/', title: 'Más de Ti', artist: 'Majo y Dan', category: 'Adoración' },

  // ABEL ZAVALA (10)
  { url: 'https://www.cifraclub.com/abel-zavala/enamorame/', title: 'Enamórame', artist: 'Abel Zavala', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/abel-zavala/jesus-mi-fiel-amigo/', title: 'Jesús Mi Fiel Amigo', artist: 'Abel Zavala', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/abel-zavala/de-tal-manera/', title: 'De Tal Manera', artist: 'Abel Zavala', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/abel-zavala/soy-libre/', title: 'Soy Libre', artist: 'Abel Zavala', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/abel-zavala/desde-mi-interior/', title: 'Desde Mi Interior', artist: 'Abel Zavala', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/abel-zavala/dios-eterno/', title: 'Dios Eterno', artist: 'Abel Zavala', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/abel-zavala/a-ti/', title: 'A Ti', artist: 'Abel Zavala', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/abel-zavala/en-este-lugar/', title: 'En Este Lugar', artist: 'Abel Zavala', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/abel-zavala/dios-de-la-creacion/', title: 'Dios de la Creación', artist: 'Abel Zavala', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/abel-zavala/eres-todo-para-mi/', title: 'Eres Todo Para Mí', artist: 'Abel Zavala', category: 'Adoración' },

  // EVAN CRAFT (10)
  { url: 'https://www.cifraclub.com/evan-craft/jovenes-somos/', title: 'Jóvenes Somos', artist: 'Evan Craft', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/evan-craft/oceans-where-feet-may-fail-espanol/', title: 'Océanos', artist: 'Evan Craft', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/evan-craft/ruge-el-leon/', title: 'Ruge El León', artist: 'Evan Craft', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/evan-craft/nuestro-dios/', title: 'Nuestro Dios', artist: 'Evan Craft', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/evan-craft/victoria-en-cristo/', title: 'Victoria en Cristo', artist: 'Evan Craft', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/evan-craft/te-alabare/', title: 'Te Alabaré', artist: 'Evan Craft', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/evan-craft/gracias-por-la-vida/', title: 'Gracias Por La Vida', artist: 'Evan Craft', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/evan-craft/eres-mi-rey/', title: 'Eres Mi Rey', artist: 'Evan Craft', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/evan-craft/gloria/', title: 'Gloria', artist: 'Evan Craft', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/evan-craft/soy-tu-adorador/', title: 'Soy Tu Adorador', artist: 'Evan Craft', category: 'Adoración' },

  // EN ESPÍRITU Y EN VERDAD (10)
  { url: 'https://www.cifraclub.com/en-espiritu-y-en-verdad/te-doy-gloria/', title: 'Te Doy Gloria', artist: 'En Espíritu y En Verdad', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/en-espiritu-y-en-verdad/en-tu-luz/', title: 'En Tu Luz', artist: 'En Espíritu y En Verdad', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/en-espiritu-y-en-verdad/no-hay-nombre-como-tu/', title: 'No Hay Nombre Como Tú', artist: 'En Espíritu y En Verdad', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/en-espiritu-y-en-verdad/dios-de-milagros/', title: 'Dios de Milagros', artist: 'En Espíritu y En Verdad', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/en-espiritu-y-en-verdad/ven-espiritu/', title: 'Ven Espíritu', artist: 'En Espíritu y En Verdad', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/en-espiritu-y-en-verdad/todo-poderoso/', title: 'Todo Poderoso', artist: 'En Espíritu y En Verdad', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/en-espiritu-y-en-verdad/mas-de-tu-amor/', title: 'Más de Tu Amor', artist: 'En Espíritu y En Verdad', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/en-espiritu-y-en-verdad/amor-de-dios/', title: 'Amor de Dios', artist: 'En Espíritu y En Verdad', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/en-espiritu-y-en-verdad/fuego-de-dios/', title: 'Fuego de Dios', artist: 'En Espíritu y En Verdad', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/en-espiritu-y-en-verdad/eres-digno/', title: 'Eres Digno', artist: 'En Espíritu y En Verdad', category: 'Adoración' },

  // REDIMI2 (10)
  { url: 'https://www.cifraclub.com/redimi2/camina/', title: 'Camina', artist: 'Redimi2', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/redimi2/libre-soy/', title: 'Libre Soy', artist: 'Redimi2', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/redimi2/nuestro-dios/', title: 'Nuestro Dios', artist: 'Redimi2', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/redimi2/a-sus-pies/', title: 'A Sus Pies', artist: 'Redimi2', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/redimi2/victoria/', title: 'Victoria', artist: 'Redimi2', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/redimi2/quiero-adorarte/', title: 'Quiero Adorarte', artist: 'Redimi2', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/redimi2/sin-miedo/', title: 'Sin Miedo', artist: 'Redimi2', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/redimi2/mi-dios/', title: 'Mi Dios', artist: 'Redimi2', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/redimi2/reina-en-mi/', title: 'Reina en Mí', artist: 'Redimi2', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/redimi2/eres-todo/', title: 'Eres Todo', artist: 'Redimi2', category: 'Adoración' },

  // INGRID ROSARIO (10)
  { url: 'https://www.cifraclub.com/ingrid-rosario/con-todo/', title: 'Con Todo', artist: 'Ingrid Rosario', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/ingrid-rosario/transformame/', title: 'Transfórmame', artist: 'Ingrid Rosario', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/ingrid-rosario/mi-vida/', title: 'Mi Vida', artist: 'Ingrid Rosario', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/ingrid-rosario/que-grande-eres/', title: 'Qué Grande Eres', artist: 'Ingrid Rosario', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/ingrid-rosario/eres-mi-senor/', title: 'Eres Mi Señor', artist: 'Ingrid Rosario', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/ingrid-rosario/quien-es-como-tu/', title: 'Quién Es Como Tú', artist: 'Ingrid Rosario', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/ingrid-rosario/te-busco-a-ti/', title: 'Te Busco a Ti', artist: 'Ingrid Rosario', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/ingrid-rosario/solo-en-ti/', title: 'Solo en Ti', artist: 'Ingrid Rosario', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/ingrid-rosario/mi-adoracion/', title: 'Mi Adoración', artist: 'Ingrid Rosario', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/ingrid-rosario/dios-tu-amor/', title: 'Dios Tu Amor', artist: 'Ingrid Rosario', category: 'Adoración' },

  // PAUL WILBUR (10)
  { url: 'https://www.cifraclub.com/paul-wilbur/shalom-jerusalem/', title: 'Shalom Jerusalem', artist: 'Paul Wilbur', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/paul-wilbur/dias-de-elias/', title: 'Días de Elías', artist: 'Paul Wilbur', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/paul-wilbur/el-dios-que-yo-sirvo/', title: 'El Dios Que Yo Sirvo', artist: 'Paul Wilbur', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/paul-wilbur/days-of-elijah/', title: 'Days of Elijah', artist: 'Paul Wilbur', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/paul-wilbur/alpha-and-omega/', title: 'Alpha and Omega', artist: 'Paul Wilbur', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/paul-wilbur/arise-and-be-healed/', title: 'Arise and Be Healed', artist: 'Paul Wilbur', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/paul-wilbur/hosanna/', title: 'Hosanna', artist: 'Paul Wilbur', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/paul-wilbur/throne-room/', title: 'Throne Room', artist: 'Paul Wilbur', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/paul-wilbur/you-are-my-king/', title: 'You Are My King', artist: 'Paul Wilbur', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/paul-wilbur/your-are-good/', title: 'You Are Good', artist: 'Paul Wilbur', category: 'Adoración' },

  // CASTING CROWNS (10)
  { url: 'https://www.cifraclub.com/casting-crowns/praise-you-in-this-storm/', title: 'Praise You In This Storm', artist: 'Casting Crowns', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/casting-crowns/who-am-i/', title: 'Who Am I', artist: 'Casting Crowns', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/casting-crowns/voice-of-truth/', title: 'Voice of Truth', artist: 'Casting Crowns', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/casting-crowns/glorious-day/', title: 'Glorious Day', artist: 'Casting Crowns', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/casting-crowns/only-jesus/', title: 'Only Jesus', artist: 'Casting Crowns', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/casting-crowns/oh-my-soul/', title: 'Oh My Soul', artist: 'Casting Crowns', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/casting-crowns/just-be-held/', title: 'Just Be Held', artist: 'Casting Crowns', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/casting-crowns/thrive/', title: 'Thrive', artist: 'Casting Crowns', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/casting-crowns/if-we-are-the-body/', title: 'If We Are The Body', artist: 'Casting Crowns', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/casting-crowns/until-the-whole-world-hears/', title: 'Until The Whole World Hears', artist: 'Casting Crowns', category: 'Alabanza' },

  // HILLSONG YOUNG & FREE (10)
  { url: 'https://www.cifraclub.com/hillsong-young-free/this-i-believe/', title: 'This I Believe', artist: 'Hillsong Young & Free', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/hillsong-young-free/wake/', title: 'Wake', artist: 'Hillsong Young & Free', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/hillsong-young-free/real-love/', title: 'Real Love', artist: 'Hillsong Young & Free', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/hillsong-young-free/back-to-life/', title: 'Back To Life', artist: 'Hillsong Young & Free', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/hillsong-young-free/energy/', title: 'Energy', artist: 'Hillsong Young & Free', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/hillsong-young-free/set-me-free/', title: 'Set Me Free', artist: 'Hillsong Young & Free', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/hillsong-young-free/by-your-side/', title: 'By Your Side', artist: 'Hillsong Young & Free', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/hillsong-young-free/alive/', title: 'Alive', artist: 'Hillsong Young & Free', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/hillsong-young-free/when-you-walk-into-the-room/', title: 'When You Walk Into The Room', artist: 'Hillsong Young & Free', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/hillsong-young-free/peace/', title: 'Peace', artist: 'Hillsong Young & Free', category: 'Adoración' },

  // HIMNOS CLÁSICOS (10)
  { url: 'https://www.cifraclub.com/himnario-evangelico/cuan-grande-es-el/', title: 'Cuán Grande Es Él', artist: 'Himnos', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/himnario-evangelico/sublime-gracia/', title: 'Sublime Gracia', artist: 'Himnos', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/himnario-evangelico/cerca-de-ti-senor/', title: 'Cerca De Ti, Señor', artist: 'Himnos', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/himnario-evangelico/santo-santo-santo/', title: 'Santo, Santo, Santo', artist: 'Himnos', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/himnario-evangelico/oh-cuan-dulce-es-fiar-en-cristo/', title: 'Oh Cuán Dulce Es Fiar en Cristo', artist: 'Himnos', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/himnario-evangelico/firmes-y-adelante/', title: 'Firmes y Adelante', artist: 'Himnos', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/himnario-evangelico/cuanto-me-ama-jesus/', title: 'Cuánto Me Ama Jesús', artist: 'Himnos', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/himnario-evangelico/alabad-al-senor-que-en-su-trono/', title: 'Alabad Al Señor', artist: 'Himnos', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/himnario-evangelico/a-dios-el-padre-celestial/', title: 'A Dios El Padre Celestial', artist: 'Himnos', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/himnario-evangelico/cuando-alli-el-dios-me-llame/', title: 'Cuando Allí el Dios Me Llame', artist: 'Himnos', category: 'Adoración' },

  // BLEST (10)
  { url: 'https://www.cifraclub.com/blest/cerca-de-mi/', title: 'Cerca de Mí', artist: 'Blest', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/blest/soy-testigo/', title: 'Soy Testigo', artist: 'Blest', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/blest/eres-mi-todo/', title: 'Eres Mi Todo', artist: 'Blest', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/blest/adorare/', title: 'Adoraré', artist: 'Blest', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/blest/gloria/', title: 'Gloria', artist: 'Blest', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/blest/no-me-canso-de-alabarte/', title: 'No Me Canso de Alabarte', artist: 'Blest', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/blest/te-amo-senor/', title: 'Te Amo Señor', artist: 'Blest', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/blest/solo-en-tu-nombre/', title: 'Solo En Tu Nombre', artist: 'Blest', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/blest/mi-pastor/', title: 'Mi Pastor', artist: 'Blest', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/blest/el-senor-es-mi-fuerza/', title: 'El Señor Es Mi Fuerza', artist: 'Blest', category: 'Alabanza' },

  // RICARDO RODRIGUEZ (10)
  { url: 'https://www.cifraclub.com/ricardo-rodriguez/toma-mi-vida/', title: 'Toma Mi Vida', artist: 'Ricardo Rodriguez', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/ricardo-rodriguez/lluvias-de-gracia/', title: 'Lluvias de Gracia', artist: 'Ricardo Rodriguez', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/ricardo-rodriguez/mi-gozo-eres-tu/', title: 'Mi Gozo Eres Tú', artist: 'Ricardo Rodriguez', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/ricardo-rodriguez/bienvenido-espiritu/', title: 'Bienvenido Espíritu', artist: 'Ricardo Rodriguez', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/ricardo-rodriguez/dios-de-toda-gracia/', title: 'Dios de Toda Gracia', artist: 'Ricardo Rodriguez', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/ricardo-rodriguez/te-amo-senor/', title: 'Te Amo Señor', artist: 'Ricardo Rodriguez', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/ricardo-rodriguez/soy-tuyo/', title: 'Soy Tuyo', artist: 'Ricardo Rodriguez', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/ricardo-rodriguez/aqui-estoy/', title: 'Aquí Estoy', artist: 'Ricardo Rodriguez', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/ricardo-rodriguez/digno-de-toda-gloria/', title: 'Digno de Toda Gloria', artist: 'Ricardo Rodriguez', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/ricardo-rodriguez/para-siempre-fiel/', title: 'Para Siempre Fiel', artist: 'Ricardo Rodriguez', category: 'Adoración' },

  // FUNKY (10)
  { url: 'https://www.cifraclub.com/funky/danzare/', title: 'Danzaré', artist: 'Funky', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/funky/tu-eres-todo/', title: 'Tú Eres Todo', artist: 'Funky', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/funky/me-has-cambiado/', title: 'Me Has Cambiado', artist: 'Funky', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/funky/no-me-avergonzare/', title: 'No Me Avergonzaré', artist: 'Funky', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/funky/sin-fondo/', title: 'Sin Fondo', artist: 'Funky', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/funky/solo-jesus/', title: 'Solo Jesús', artist: 'Funky', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/funky/en-la-gloria/', title: 'En La Gloria', artist: 'Funky', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/funky/vivir-es-cristo/', title: 'Vivir Es Cristo', artist: 'Funky', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/funky/mi-todo/', title: 'Mi Todo', artist: 'Funky', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/funky/gracia/', title: 'Gracia', artist: 'Funky', category: 'Adoración' },

  // TERCER CIELO (10)
  { url: 'https://www.cifraclub.com/tercer-cielo/demente/', title: 'Demente', artist: 'Tercer Cielo', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/tercer-cielo/dios-esta-en-este-lugar/', title: 'Dios Está En Este Lugar', artist: 'Tercer Cielo', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/tercer-cielo/en-el-justo-momento/', title: 'En El Justo Momento', artist: 'Tercer Cielo', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/tercer-cielo/creere/', title: 'Creeré', artist: 'Tercer Cielo', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/tercer-cielo/mas-de-lo-que-pedi/', title: 'Más De Lo Que Pedí', artist: 'Tercer Cielo', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/tercer-cielo/yo-te-extraare/', title: 'Yo Te Extrañaré', artist: 'Tercer Cielo', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/tercer-cielo/no-crezcas-mas/', title: 'No Crezcas Más', artist: 'Tercer Cielo', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/tercer-cielo/enamorados/', title: 'Enamorados', artist: 'Tercer Cielo', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/tercer-cielo/llueve/', title: 'Llueve', artist: 'Tercer Cielo', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/tercer-cielo/amor-real/', title: 'Amor Real', artist: 'Tercer Cielo', category: 'Adoración' },

  // SAMUEL HERNÁNDEZ (10)
  { url: 'https://www.cifraclub.com/samuel-hernandez/levanto-mis-manos/', title: 'Levanto Mis Manos', artist: 'Samuel Hernández', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/samuel-hernandez/mas-alla-del-sol/', title: 'Más Allá Del Sol', artist: 'Samuel Hernández', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/samuel-hernandez/estamos-aqui-para-adorar/', title: 'Estamos Aquí Para Adorar', artist: 'Samuel Hernández', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/samuel-hernandez/dios-siempre-tiene-el-control/', title: 'Dios Siempre Tiene El Control', artist: 'Samuel Hernández', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/samuel-hernandez/jesus-confio-en-ti/', title: 'Jesús Confió En Ti', artist: 'Samuel Hernández', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/samuel-hernandez/cuando-llega-la-uncion/', title: 'Cuando Llega La Unción', artist: 'Samuel Hernández', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/samuel-hernandez/levantate-y-sana/', title: 'Levántate Y Sana', artist: 'Samuel Hernández', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/samuel-hernandez/no-me-digas-adios/', title: 'No Me Digas Adiós', artist: 'Samuel Hernández', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/samuel-hernandez/dios-bendice-a-mi-familia/', title: 'Dios Bendice A Mi Familia', artist: 'Samuel Hernández', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/samuel-hernandez/dios-me-dijo-que-no/', title: 'Dios Me Dijo Que No', artist: 'Samuel Hernández', category: 'Adoración' },

  // LILLY GOODMAN (10)
  { url: 'https://www.cifraclub.com/lilly-goodman/sin-miedo-a-nada/', title: 'Sin Miedo A Nada', artist: 'Lilly Goodman', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/lilly-goodman/el-mismo-dios/', title: 'El Mismo Dios', artist: 'Lilly Goodman', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/lilly-goodman/te-necesito-mas/', title: 'Te Necesito Más', artist: 'Lilly Goodman', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/lilly-goodman/el-equipaje/', title: 'El Equipaje', artist: 'Lilly Goodman', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/lilly-goodman/ni-por-un-momento/', title: 'Ni Por Un Momento', artist: 'Lilly Goodman', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/lilly-goodman/a-tu-lado-el-esta/', title: 'A Tu Lado Él Está', artist: 'Lilly Goodman', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/lilly-goodman/cuanto-mas-te-busco/', title: 'Cuanto Más Te Busco', artist: 'Lilly Goodman', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/lilly-goodman/vuelve-casa/', title: 'Vuelve a Casa', artist: 'Lilly Goodman', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/lilly-goodman/sobrevivire/', title: 'Sobreviviré', artist: 'Lilly Goodman', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/lilly-goodman/contigo-dios/', title: 'Contigo Dios', artist: 'Lilly Goodman', category: 'Adoración' },

  // JAIME MURRELL (10)
  { url: 'https://www.cifraclub.com/jaime-murrel/yo-quiero-mas-de-ti/', title: 'Yo Quiero Más De Ti', artist: 'Jaime Murrell', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/jaime-murrel/aqui-estoy/', title: 'Aquí Estoy', artist: 'Jaime Murrell', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/jaime-murrel/en-tu-presencia/', title: 'En Tu Presencia', artist: 'Jaime Murrell', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/jaime-murrel/venga-tu-reino/', title: 'Venga Tu Reino', artist: 'Jaime Murrell', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/jaime-murrel/te-pido-la-paz/', title: 'Te Pido La Paz', artist: 'Jaime Murrell', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/jaime-murrel/pon-aceite-en-mi-vida/', title: 'Pon Aceite En Mi Vida', artist: 'Jaime Murrell', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/jaime-murrel/grandes-son-tus-maravillas/', title: 'Grandes Son Tus Maravillas', artist: 'Jaime Murrell', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/jaime-murrel/porque-bueno-es-dios/', title: 'Porque Bueno Es Dios', artist: 'Jaime Murrell', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/jaime-murrel/oh-moradora-de-sion/', title: 'Oh Moradora De Sión', artist: 'Jaime Murrell', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/jaime-murrel/delicias-a-tu-diestra/', title: 'Delicias A Tu Diestra', artist: 'Jaime Murrell', category: 'Adoración' },

  // JUAN CARLOS ALVARADO (10)
  { url: 'https://www.cifraclub.com/juan-carlos-alvarado/el-poderoso-de-israel/', title: 'El Poderoso De Israel', artist: 'Juan Carlos Alvarado', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/juan-carlos-alvarado/cantare-al-seor-por-siempre/', title: 'Cantaré Al Señor Por Siempre', artist: 'Juan Carlos Alvarado', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/juan-carlos-alvarado/jehova-es-mi-guerrero/', title: 'Jehová Es Mi Guerrero', artist: 'Juan Carlos Alvarado', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/juan-carlos-alvarado/libre-yo-soy-libre/', title: 'Libre Yo Soy Libre', artist: 'Juan Carlos Alvarado', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/juan-carlos-alvarado/dios-el-mas-grande/', title: 'Dios El Más Grande', artist: 'Juan Carlos Alvarado', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/juan-carlos-alvarado/cristo-no-esta-muerto/', title: 'Cristo No Está Muerto', artist: 'Juan Carlos Alvarado', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/juan-carlos-alvarado/hay-una-fuente-en-mi/', title: 'Hay Una Fuente En Mí', artist: 'Juan Carlos Alvarado', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/juan-carlos-alvarado/ya-ha-llegado-el-momento/', title: 'Ya Ha Llegado El Momento', artist: 'Juan Carlos Alvarado', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/juan-carlos-alvarado/eres-seor-vencedor/', title: 'Eres Señor Vencedor', artist: 'Juan Carlos Alvarado', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/juan-carlos-alvarado/jehova-es-vencedor/', title: 'Jehová Es Vencedor', artist: 'Juan Carlos Alvarado', category: 'Alabanza' },

  // JULISSA (10)
  { url: 'https://www.cifraclub.com/julissa/el-gran-yo-soy/', title: 'El Gran Yo Soy', artist: 'Julissa', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/julissa/inexplicable/', title: 'Inexplicable', artist: 'Julissa', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/julissa/a-dios-sea-la-gloria/', title: 'A Dios Sea La Gloria', artist: 'Julissa', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/julissa/tu-mirada/', title: 'Tu Mirada', artist: 'Julissa', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/julissa/jehova/', title: 'Jehová', artist: 'Julissa', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/julissa/enamorada/', title: 'Enamorada', artist: 'Julissa', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/julissa/tu-vives/', title: 'Tu Vives', artist: 'Julissa', category: 'Alabanza' },
  { url: 'https://www.cifraclub.com/julissa/la-nina-de-tus-ojos/', title: 'La Niña De Tus Ojos', artist: 'Julissa', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/julissa/el-misterio-del-calvario/', title: 'El Misterio Del Calvario', artist: 'Julissa', category: 'Adoración' },
  { url: 'https://www.cifraclub.com/julissa/me-vistio-de-promesas/', title: 'Me Vistió De Promesas', artist: 'Julissa', category: 'Adoración' },
];

function isChordLine(line) {
  const trimmed = line.trim();
  if (!trimmed) return false;
  const words = trimmed.split(/[\s/|-]+/).filter(w => w.length > 0 && !w.includes('//'));
  if (words.length === 0) return false;
  
  // Soporta acordes con parentesis (e.g. A7(9), Em7(b5))
  const chordRegex = /^[A-G][b#]?(?:m|maj|dim|aug|sus|add|[0-9])*(?:\([^)]+\))?(?:\/[A-G][b#]?)?$/;
  let chordCount = 0;
  for (const w of words) {
    if (chordRegex.test(w)) chordCount++;
  }
  return chordCount / words.length >= 0.5;
}

// Helper to snap an index to the start of the current word
function snapToWordStart(text, index) {
  if (index >= text.length) return text.length;
  // If we're already on a space, no need to snap
  if (text[index] === ' ') return index;
  // If we're on a non-space, go backwards until we hit a space or start of string
  let newIdx = index;
  while (newIdx > 0 && text[newIdx - 1] !== ' ') {
    newIdx--;
  }
  return newIdx;
}

function convertPlainTextToInline(lyrics) {
  const lines = lyrics.split('\n');
  const result = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (isChordLine(line)) {
      const chords = [];
      const regex = /([A-G][b#]?(?:m|maj|dim|aug|sus|add|[0-9])*(?:\([^)]+\))?(?:\/[A-G][b#]?)?)/g;
      let match;
      while ((match = regex.exec(line)) !== null) {
        chords.push({ chord: match[1], index: match.index });
      }
      
      const nextLine = (i + 1 < lines.length && !isChordLine(lines[i + 1])) ? lines[i + 1] : "";
      
      if (nextLine.trim() !== "") {
        let mergedLine = nextLine;
        const maxChordIdx = chords.length > 0 ? chords[chords.length - 1].index : 0;
        if (mergedLine.length < maxChordIdx) {
          mergedLine = mergedLine.padEnd(maxChordIdx, ' ');
        }
        
        // Snap all chord indices first based on the ORIGINAL mergedLine text.
        const snappedChords = chords.map(c => {
           return { chord: c.chord, index: snapToWordStart(mergedLine, c.index) };
        });
        
        // Group chords that snapped to the same index
        const groupedChords = {};
        for (const c of snappedChords) {
           if (!groupedChords[c.index]) groupedChords[c.index] = [];
           groupedChords[c.index].push(c.chord);
        }
        
        // Insert right-to-left based on grouped indices
        const indices = Object.keys(groupedChords).map(Number).sort((a,b) => b - a);
        for (const idx of indices) {
           const chordString = groupedChords[idx].map(c => `[${c}]`).join('');
           mergedLine = mergedLine.slice(0, idx) + chordString + mergedLine.slice(idx);
        }
        
        result.push(mergedLine);
        i++; 
      } else {
        let mergedLine = "";
        let lastIdx = 0;
        for (const { chord, index } of chords) {
          mergedLine += " ".repeat(Math.max(0, index - lastIdx)) + `[${chord}]`;
          lastIdx = index + chord.length;
        }
        result.push(mergedLine);
      }
    } else {
      result.push(line);
    }
  }
  return result.join('\n');
}

async function scrapeSong(song) {
  try {
    console.log(`Descargando: ${song.title}...`);
    const res = await fetch(song.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    const $ = cheerio.load(html);
    
    // Extraer el tono desde el HTML (CifraClub renderiza con React, no hay un selector fijo)
    let musicalKey = "C";
    const keyMatch = html.match(/Tono<\/p>.*?<\/div>.*?<\/div>.*?<[^>]*>([A-G][b#]?(?:m|dim|aug|sus|add)?)\s*</);
    if (keyMatch) musicalKey = keyMatch[1];

    let preHtml = $('pre').html() || '';
    if (!preHtml) return null;

    // Convertir <br> a saltos de línea y usar cheerio.text() para resolver entidades (como &nbsp;)
    preHtml = preHtml.replace(/<br\s*\/?>/gi, '\n');
    const plainText = cheerio.load(`<pre>${preHtml}</pre>`)('pre').text();
    
    // Parsear
    const inlineLyrics = convertPlainTextToInline(plainText);
    
    return {
      id: song.title.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      title: song.title,
      artist: song.artist,
      category: song.category,
      lyrics: inlineLyrics.trim(),
      musicalKey
    };
  } catch (err) {
    console.error(`Error en ${song.title}:`, err.message);
    return null;
  }
}

async function run() {
  const finalSongs = [];
  let number = 1;
  for (const s of SONGS) {
    const data = await scrapeSong(s);
    if (data) {
      data.number = number++;
      finalSongs.push(data);
    }
    // Retraso para no ser bloqueados
    await new Promise(r => setTimeout(r, 1000));
  }
  
  const content = `// Generado automáticamente desde CifraClub
export interface ChristianSong {
  id: string;
  number: number;
  title: string;
  artist: string;
  category: string;
  lyrics: string;
  musicalKey: string;
}

export const christianSongs: ChristianSong[] = ${JSON.stringify(finalSongs, null, 2)};
`;

  writeFileSync(OUTPUT, content, 'utf8');
  console.log(`¡Generado christianSongs.ts con ${finalSongs.length} canciones!`);
}

run();
