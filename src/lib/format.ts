// Formatare separată de catalog, ca insulele React să nu tragă tot catalogul în bundle.

const LUNI = [
  'ianuarie',
  'februarie',
  'martie',
  'aprilie',
  'mai',
  'iunie',
  'iulie',
  'august',
  'septembrie',
  'octombrie',
  'noiembrie',
  'decembrie',
];

export const dataLunga = (d: Date) => `${d.getDate()} ${LUNI[d.getMonth()]} ${d.getFullYear()}`;

export const dataScurta = (d: Date) => `${d.getDate()} ${LUNI[d.getMonth()].slice(0, 3)}`;

export const lei = (n: number) =>
  new Intl.NumberFormat('ro-RO', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(n);

/** Prăjim marți și vineri. Ultima zi de prăjire față de o dată dată. */
export function ultimaPrajire(azi = new Date()): Date {
  const d = new Date(azi.getFullYear(), azi.getMonth(), azi.getDate());
  while (d.getDay() !== 2 && d.getDay() !== 5) {
    d.setDate(d.getDate() - 1);
  }
  return d;
}
