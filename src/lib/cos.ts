// Coșul demo. Trăiește în localStorage și anunță insulele prin un event pe window.
// TODO(real): înlocuit cu coș pe server (Medusa cart / Supabase) + stoc rezervat la checkout.

export type ArticolCos = {
  id: string;
  slug: string;
  titlu: string;
  varianta: string;
  pret: number;
  cant: number;
  culoare: string;
  origine: string;
  regiune: string;
  gramaj: string;
};

const CHEIE = 'cota-cos-v1';
export const EVENIMENT = 'cota:cos-schimbat';
export const PRAG_LIVRARE_GRATUITA = 150;
export const COST_LIVRARE = 19.9;

const eBrowser = () => typeof window !== 'undefined';

export function citesteCos(): ArticolCos[] {
  if (!eBrowser()) return [];
  try {
    const brut = window.localStorage.getItem(CHEIE);
    if (!brut) return [];
    const date = JSON.parse(brut);
    return Array.isArray(date) ? (date as ArticolCos[]) : [];
  } catch {
    return [];
  }
}

function scrieCos(articole: ArticolCos[]) {
  if (!eBrowser()) return;
  try {
    window.localStorage.setItem(CHEIE, JSON.stringify(articole));
  } catch {
    /* mod privat / cotă plină — coșul rămâne doar în memoria paginii */
  }
  window.dispatchEvent(new CustomEvent(EVENIMENT, { detail: articole }));
}

export function adauga(articol: Omit<ArticolCos, 'cant'>, cant = 1) {
  const articole = citesteCos();
  const existent = articole.find((a) => a.id === articol.id);
  if (existent) {
    existent.cant = Math.min(existent.cant + cant, 99);
  } else {
    articole.push({ ...articol, cant });
  }
  scrieCos(articole);
}

export function schimbaCantitatea(id: string, cant: number) {
  const articole = citesteCos()
    .map((a) => (a.id === id ? { ...a, cant: Math.max(0, Math.min(cant, 99)) } : a))
    .filter((a) => a.cant > 0);
  scrieCos(articole);
}

export function sterge(id: string) {
  scrieCos(citesteCos().filter((a) => a.id !== id));
}

export function goleste() {
  scrieCos([]);
}

export const numaraBucati = (articole: ArticolCos[]) =>
  articole.reduce((s, a) => s + a.cant, 0);

export const subtotal = (articole: ArticolCos[]) =>
  articole.reduce((s, a) => s + a.pret * a.cant, 0);

export function livrare(articole: ArticolCos[]) {
  const s = subtotal(articole);
  if (s === 0 || s >= PRAG_LIVRARE_GRATUITA) return 0;
  return COST_LIVRARE;
}

export const total = (articole: ArticolCos[]) => subtotal(articole) + livrare(articole);

/** Abonează o insulă la schimbările coșului. Întoarce funcția de dezabonare. */
export function asculta(cb: (articole: ArticolCos[]) => void) {
  if (!eBrowser()) return () => {};
  const local = () => cb(citesteCos());
  window.addEventListener(EVENIMENT, local);
  // alt tab a modificat coșul
  window.addEventListener('storage', (e) => {
    if (e.key === CHEIE) local();
  });
  return () => window.removeEventListener(EVENIMENT, local);
}
