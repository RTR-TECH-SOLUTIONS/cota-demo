// Pachetele și accesoriile. Cafeaua e în `cafele.ts`; aici e restul raftului.
// TODO(real): și astea intră în CMS/Medusa, cu stoc propriu.

export type Categorie = 'pachet' | 'accesoriu';

export type Produs = {
  slug: string;
  categorie: Categorie;
  nume: string;
  subtitlu: string;
  /** Ce cuprinde, ca rânduri de fișă. */
  cuprinde: [string, string][];
  descriere: string;
  pret: number;
  /** Prețul dacă ai cumpăra bucată cu bucată — de aici vine reducerea la pachete. */
  pretVechi?: number;
  motivReducere?: string;
  imagine: string;
  stoc: number;
};

export const pachete: Produs[] = [
  {
    slug: 'pachet-degustare',
    categorie: 'pachet',
    nume: 'Pachet degustare',
    subtitlu: 'Trei pungi de 250 g, câte una din fiecare profil',
    cuprinde: [
      ['Conține', '3 × 250 g'],
      ['Profiluri', 'Fructat, echilibrat, intens'],
      ['Alegerea', 'O facem noi, din lotul proaspăt'],
      ['Transport', 'Inclus'],
    ],
    descriere:
      'Cel mai simplu mod de a afla ce bei. Îți trimitem trei loturi diferite din prăjirea săptămânii, câte unul din fiecare profil de gust, cu fișa fiecăruia pe etichetă. După ce le termini, știi exact ce să comanzi mai departe.',
    pret: 168,
    pretVechi: 192,
    motivReducere: 'Cu 24 lei mai ieftin decât cele trei pungi separat, transport inclus',
    imagine: 'pachet-degustare',
    stoc: 30,
  },
  {
    slug: 'pachet-espresso',
    categorie: 'pachet',
    nume: 'Pachet espresso, 2 kg',
    subtitlu: 'Două pungi de 1 kg din blendul de casă',
    cuprinde: [
      ['Conține', '2 × 1 kg'],
      ['Cafea', 'Cotă Zero, blendul de casă'],
      ['Măcinare', 'Boabe sau espresso, la alegere'],
      ['Transport', 'Inclus'],
    ],
    descriere:
      'Pentru cine trage espresso zilnic și nu vrea să schimbe rețeta la fiecare pungă. Aceeași compoziție, prăjită în același profil, din același lot de bază. Ajunge o lună și jumătate la un espresso pe zi.',
    pret: 298,
    pretVechi: 334,
    motivReducere: 'Prețul pe kilogram scade cu 11% la doi saci',
    imagine: 'pachet-espresso',
    stoc: 18,
  },
  {
    slug: 'pachet-cadou',
    categorie: 'pachet',
    nume: 'Cutie cadou',
    subtitlu: 'Două pungi în cutie rigidă, cu bilet scris de mână',
    cuprinde: [
      ['Conține', '2 × 250 g'],
      ['Ambalaj', 'Cutie rigidă neagră, sfoară'],
      ['Bilet', 'Scris de mână, mesajul tău'],
      ['Transport', 'Inclus'],
    ],
    descriere:
      'Alegi două loturi sau ne lași pe noi. Punem pungile într-o cutie rigidă, legăm cu sfoară și scriem mesajul tău pe biletul din interior. Pleacă direct la adresa persoanei, fără preț pe factura din cutie.',
    pret: 149,
    imagine: 'pachet-cadou',
    stoc: 24,
  },
];

export const accesorii: Produs[] = [
  {
    slug: 'rasnita-manuala',
    categorie: 'accesoriu',
    nume: 'Râșniță manuală',
    subtitlu: 'Pietre de oțel, 40 de trepte',
    cuprinde: [
      ['Pietre', 'Oțel conic, 38 mm'],
      ['Trepte', '40, de la espresso la cafetieră'],
      ['Capacitate', '30 g'],
      ['Garanție', '2 ani'],
    ],
    descriere:
      'Dacă iei un singur accesoriu, ia-l pe ăsta. Cafeaua măcinată își pierde partea de sus în zece zile, oricât de bine ai închide punga. Râșnița asta ține treapta constant și macină 30 g în circa 40 de secunde.',
    pret: 349,
    imagine: 'rasnita-produs',
    stoc: 12,
  },
  {
    slug: 'set-filtru-v60',
    categorie: 'accesoriu',
    nume: 'Set filtru V60',
    subtitlu: 'Dripper ceramic, carafă și 100 de filtre',
    cuprinde: [
      ['Dripper', 'Ceramică mată, mărimea 02'],
      ['Carafă', 'Sticlă, 600 ml'],
      ['Filtre', '100 bucăți, hârtie naturală'],
      ['Pentru', 'Cafelele fructate și spălate'],
    ],
    descriere:
      'Setul de pornire pentru filtru. Ceramica ține temperatura mai bine decât plasticul, iar filtrele naturale nu lasă gust de hârtie dacă le clătești. Rețeta noastră de pornire e în ghidul de preparare.',
    pret: 229,
    pretVechi: 268,
    motivReducere: 'Mai ieftin cu 39 lei decât cele trei piese luate separat',
    imagine: 'set-v60',
    stoc: 20,
  },
  {
    slug: 'cafetiera-moka',
    categorie: 'accesoriu',
    nume: 'Cafetieră moka, 3 cești',
    subtitlu: 'Aluminiu, pentru aragaz',
    cuprinde: [
      ['Capacitate', '3 cești, 150 ml'],
      ['Material', 'Aluminiu turnat'],
      ['Pentru', 'Aragaz și plită electrică'],
      ['Garanție', '2 ani'],
    ],
    descriere:
      'Cafea concentrată, fără mașină și fără cântar. Merge cel mai bine cu blendul de casă și cu naturalele braziliene, măcinate medie-fină. Ține focul mic și oprește-o când curgerea devine gălăgioasă.',
    pret: 139,
    imagine: 'moka-produs',
    stoc: 26,
  },
  {
    slug: 'cantar-cafea',
    categorie: 'accesoriu',
    nume: 'Cântar de cafea',
    subtitlu: 'Precizie 0,1 g, cu cronometru',
    cuprinde: [
      ['Precizie', '0,1 g'],
      ['Capacitate', '3 kg'],
      ['Cronometru', 'Da, integrat'],
      ['Alimentare', 'USB-C, reîncărcabil'],
    ],
    descriere:
      'Singurul lucru nenegociabil din ghidul nostru. Fără cântar, aceeași pungă îți iese diferit de la o zi la alta, și n-ai cum să știi de ce. Cu el, reproduci rețeta care ți-a plăcut.',
    pret: 189,
    imagine: 'cantar',
    stoc: 22,
  },
];

export const toateAltele: Produs[] = [...pachete, ...accesorii];

/** Reducerea, în procente întregi, sau null dacă produsul e la preț de listă. */
export function procentReducere(pret: number, pretVechi?: number): number | null {
  if (!pretVechi || pretVechi <= pret) return null;
  return Math.round((1 - pret / pretVechi) * 100);
}
