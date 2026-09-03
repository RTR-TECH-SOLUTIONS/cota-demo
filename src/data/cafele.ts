// Catalogul prăjitoriei. La proiectul real datele astea vin din CMS/DB.
// TODO(real): mutat în content collection (Keystatic) sau în Medusa/Supabase.

export { lei, dataLunga, dataScurta, ultimaPrajire } from '../lib/format';

export type Profil = 'fructat' | 'echilibrat' | 'intens';
export type Prajire = 'filtru' | 'espresso' | 'omni';
export type Proces = 'Spălat' | 'Natural' | 'Honey galben' | 'Sugarcane EA' | 'Anaerob';
export type Corp = 'Ușor' | 'Mediu' | 'Gros';
export type Aroma = 'Citrice' | 'Fructe roșii' | 'Floral' | 'Ciocolată' | 'Caramel' | 'Nucă';

export type Cafea = {
  slug: string;
  origine: string;
  regiune: string;
  producator: string;
  altitudine: number; // metri — „cota"
  varietate: string;
  proces: Proces;
  prajire: Prajire;
  profil: Profil;
  note: [string, string, string];
  /** Axele după care filtrează oamenii într-un magazin de cafea. */
  arome: Aroma[];
  corp: Corp;
  intensitate: 1 | 2 | 3 | 4 | 5;
  scor: number;
  pret250: number;
  pret1000: number;
  /** Prețul de listă, când lotul e la reducere. Reducerile au motiv: lot pe
      terminate sau ediție care iese din catalog. Vezi `motivReducere`. */
  pretVechi?: number;
  motivReducere?: string;
  culoareEticheta: string;
  descriere: string;
  metode: string[];
  stoc: number;
  limitata?: boolean;
  ecologic?: boolean;
};

export const PROFILE: Record<Profil, { titlu: string; explicatie: string }> = {
  fructat: {
    titlu: 'Fructat și viu',
    explicatie:
      'Aciditate mare, corp ușor. Cafele spălate din Africa de Est, prăjite scurt. Se beau ca un ceai, nu ca un espresso.',
  },
  echilibrat: {
    titlu: 'Echilibrat și dulce',
    explicatie:
      'Zonă de mijloc: dulceață de caramel, fructe coapte, aciditate rotundă. Merg și la filtru, și la espresso.',
  },
  intens: {
    titlu: 'Intens și cacao',
    explicatie:
      'Corp gros, aciditate joasă, note de ciocolată și nuci. Prăjire mai lungă, gândită pentru espresso și lapte.',
  },
};

export const PRAJIRI: Record<Prajire, string> = {
  filtru: 'Filtru',
  espresso: 'Espresso',
  omni: 'Filtru și espresso',
};

export const cafele: Cafea[] = [
  {
    slug: 'etiopia-worka-sakaro',
    origine: 'Etiopia',
    regiune: 'Yirgacheffe, Gedeb',
    producator: 'Stația de spălare Worka Sakaro',
    altitudine: 1950,
    varietate: 'Heirloom local',
    proces: 'Spălat',
    prajire: 'filtru',
    profil: 'fructat',
    note: ['bergamotă', 'piersică albă', 'ceai negru'],
    arome: ['Citrice', 'Floral'],
    corp: 'Ușor',
    intensitate: 2,
    scor: 87.5,
    pret250: 72,
    pret1000: 244,
    culoareEticheta: '#c9a227',
    descriere:
      'Loturile din Gedeb ajung la stație în aceeași zi în care sunt culese, iar fermentarea ține 36 de ore în bazine de ciment. De aici vine limpezimea: se simte florală în ceașcă, fără să fie parfumată artificial. O prăjim scurt, la 9 minute și 40 de secunde, ca să nu pierdem aciditatea de citrice.',
    metode: ['V60', 'Chemex', 'Aeropress'],
    stoc: 24,
  },
  {
    slug: 'kenya-gichathaini-aa',
    origine: 'Kenya',
    regiune: 'Nyeri, Gichathaini',
    producator: 'Cooperativa Tekangu, 640 de mici producători',
    altitudine: 1800,
    varietate: 'SL28, SL34',
    proces: 'Spălat',
    prajire: 'filtru',
    profil: 'fructat',
    note: ['coacăze negre', 'grepfrut roșu', 'trestie de zahăr'],
    arome: ['Fructe roșii', 'Citrice'],
    corp: 'Mediu',
    intensitate: 3,
    scor: 88,
    pret250: 78,
    pret1000: 265,
    culoareEticheta: '#8e2f3a',
    descriere:
      'SL28 plantat pe sol vulcanic roșu, la umbra bananierilor. Cel mai acid lot din raftul nostru și, de departe, cel care împarte oamenii în două. Dacă îți place limonada de coacăze, e cafeaua ta. Dacă bei cafea cu lapte, sari peste ea.',
    metode: ['V60', 'Chemex'],
    stoc: 11,
  },
  {
    slug: 'columbia-el-mirador',
    origine: 'Columbia',
    regiune: 'Huila, Pitalito',
    producator: 'Nelson Ramírez, Finca El Mirador',
    altitudine: 1750,
    varietate: 'Caturra',
    proces: 'Spălat',
    prajire: 'omni',
    profil: 'echilibrat',
    note: ['caramel', 'măr roșu', 'migdală prăjită'],
    arome: ['Caramel', 'Fructe roșii', 'Nucă'],
    corp: 'Mediu',
    intensitate: 3,
    scor: 85.5,
    pret250: 58,
    pret1000: 197,
    culoareEticheta: '#2f6b4f',
    descriere:
      'Cumpărăm de la Nelson al patrulea an la rând, același lot de pe versantul de est al fermei. E cafeaua pe care o recomandăm când cineva trece prima dată de la cafeaua de supermarket la specialitate: nu sperie pe nimeni și rămâne bună și a doua zi, rece.',
    metode: ['V60', 'Espresso', 'Cafetieră', 'Moka'],
    stoc: 40,
  },
  {
    slug: 'guatemala-la-bolsa',
    origine: 'Guatemala',
    regiune: 'Huehuetenango, La Libertad',
    producator: 'Familia Vides, Finca La Bolsa',
    altitudine: 1600,
    varietate: 'Bourbon, Caturra',
    proces: 'Spălat',
    prajire: 'omni',
    profil: 'echilibrat',
    note: ['ciocolată cu lapte', 'coajă de portocală', 'nucă'],
    arome: ['Ciocolată', 'Citrice', 'Nucă'],
    corp: 'Mediu',
    intensitate: 3,
    scor: 86,
    pret250: 54,
    pret1000: 184,
    pretVechi: 62,
    motivReducere: 'Vine recolta nouă, facem loc pe raft',
    culoareEticheta: '#2c5470',
    descriere:
      'Huehuetenango e ferit de îngheț de aerul cald care coboară din Sierra de los Cuchumatanes, așa că se poate cultiva mai sus decât în restul țării. Lotul ăsta ține foarte bine la lapte: în cappuccino iese a portocală cu ciocolată.',
    metode: ['Espresso', 'V60', 'Moka'],
    stoc: 32,
  },
  {
    slug: 'costa-rica-don-eli',
    origine: 'Costa Rica',
    regiune: 'Tarrazú, León Cortés',
    producator: 'Micromoara Don Eli, familia Calderón',
    altitudine: 1700,
    varietate: 'Villa Sarchí',
    proces: 'Honey galben',
    prajire: 'filtru',
    profil: 'echilibrat',
    note: ['zahăr brun', 'cireșe', 'vanilie'],
    arome: ['Caramel', 'Fructe roșii'],
    corp: 'Mediu',
    intensitate: 3,
    scor: 86.5,
    pret250: 68,
    pret1000: 231,
    culoareEticheta: '#c4652a',
    descriere:
      'Honey galben înseamnă că boabele s-au uscat pe paturi africane cu o parte din pulpa fructului încă pe ele, 14 zile, întoarse manual. Rezultatul e o cafea mai dulce și mai densă decât una spălată, dar fără sălbăticia unei naturale.',
    metode: ['V60', 'Aeropress', 'Cafetieră'],
    stoc: 18,
  },
  {
    slug: 'peru-sol-y-cafe',
    origine: 'Peru',
    regiune: 'Cajamarca, Jaén',
    producator: 'Cooperativa Sol y Café',
    altitudine: 1850,
    varietate: 'Typica, Bourbon',
    proces: 'Spălat',
    prajire: 'omni',
    profil: 'echilibrat',
    note: ['nugat', 'mandarină', 'ceai verde'],
    arome: ['Nucă', 'Citrice'],
    corp: 'Ușor',
    intensitate: 2,
    scor: 85,
    pret250: 45,
    pret1000: 153,
    pretVechi: 56,
    motivReducere: 'Iese din catalog, nu mai cumpărăm din lotul ăsta',
    culoareEticheta: '#55603f',
    descriere:
      'Cooperativa strânge recolta a peste 1.000 de familii din Jaén și e certificată ecologic din 2011. Am ales lotul ăsta pentru că are ceva ce rar găsim la prețul lui: o dulceață curată de nugat, fără nimic lemnos în final.',
    metode: ['V60', 'Cafetieră', 'Espresso'],
    stoc: 27,
    ecologic: true,
  },
  {
    slug: 'brazilia-fazenda-rainha',
    origine: 'Brazilia',
    regiune: 'Minas Gerais, Carmo de Minas',
    producator: 'Fazenda Rainha',
    altitudine: 1150,
    varietate: 'Mundo Novo',
    proces: 'Natural',
    prajire: 'espresso',
    profil: 'intens',
    note: ['ciocolată neagră', 'alună', 'melasă'],
    arome: ['Ciocolată', 'Nucă'],
    corp: 'Gros',
    intensitate: 4,
    scor: 84,
    pret250: 39,
    pret1000: 133,
    pretVechi: 52,
    motivReducere: 'Lot pe terminate, prăjit acum trei săptămâni. Mai avem 9 pungi.',
    culoareEticheta: '#7a4a2a',
    descriere:
      'Uscată integral în fruct, la soare, pe terase de beton. E baza espresso-ului nostru de zi cu zi: corp gros, crema stabilă, zero aciditate agresivă. O prăjim cu 40 de secunde mai mult decât restul raftului.',
    metode: ['Espresso', 'Moka', 'Cafetieră'],
    stoc: 55,
  },
  {
    slug: 'cota-zero-espresso',
    origine: 'Blend de casă',
    regiune: 'Brazilia și Columbia',
    producator: 'Compus în prăjitorie, 70% / 30%',
    altitudine: 1150,
    varietate: 'Mundo Novo, Caturra',
    proces: 'Natural',
    prajire: 'espresso',
    profil: 'intens',
    note: ['ciocolată', 'caramel sărat', 'coajă de portocală'],
    arome: ['Ciocolată', 'Caramel'],
    corp: 'Gros',
    intensitate: 5,
    scor: 84.5,
    pret250: 49,
    pret1000: 166,
    culoareEticheta: '#2a2724',
    descriere:
      'Singurul lucru pe care îl ținem constant tot anul. Când unul dintre cele două loturi se termină, îl înlocuim cu ceva care duce blendul în același loc — nu invers. E cafeaua din spatele barului nostru și cea pe care o trimitem în cafenele.',
    metode: ['Espresso', 'Moka'],
    stoc: 80,
  },
  {
    slug: 'columbia-decofeinizata',
    origine: 'Columbia',
    regiune: 'Huila',
    producator: 'Decofeinizare la Descafecol, Manizales',
    altitudine: 1600,
    varietate: 'Castillo',
    proces: 'Sugarcane EA',
    prajire: 'omni',
    profil: 'intens',
    note: ['cacao', 'caramel', 'prună uscată'],
    arome: ['Ciocolată', 'Caramel'],
    corp: 'Mediu',
    intensitate: 3,
    scor: 83,
    pret250: 58,
    pret1000: 197,
    culoareEticheta: '#6b5e7a',
    descriere:
      'Decofeinizare cu acetat de etil obținut din trestie de zahăr fermentată, nu cu solvenți de sinteză. Pierde ceva aciditate, dar păstrează dulceața — e singura decofeinizată pe care am fost dispuși să o punem pe raft.',
    metode: ['Espresso', 'V60', 'Cafetieră'],
    stoc: 21,
  },
  {
    slug: 'etiopia-uraga-natural',
    origine: 'Etiopia',
    regiune: 'Guji, Uraga',
    producator: 'Lot experimental, 6 saci',
    altitudine: 2100,
    varietate: 'Heirloom local',
    proces: 'Anaerob',
    prajire: 'filtru',
    profil: 'fructat',
    note: ['afine', 'liliac', 'sirop de zmeură'],
    arome: ['Fructe roșii', 'Floral'],
    corp: 'Ușor',
    intensitate: 2,
    scor: 89,
    pret250: 96,
    pret1000: 326,
    culoareEticheta: '#a03e63',
    descriere:
      'Fermentat 72 de ore în butoaie închise, înainte de uscare. Am luat șase saci și atât va fi — când se termină, se termină. Prăjită foarte scurt, ca să rămână intactă partea de fruct roșu. Nu o folosi la espresso.',
    metode: ['V60', 'Chemex'],
    stoc: 6,
    limitata: true,
  },
];

export const getCafea = (slug: string) => cafele.find((c) => c.slug === slug);
