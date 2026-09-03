import { useEffect, useMemo, useState } from 'react';
import CardCafea from './CardCafea';
import { procentReducere } from '../data/altele';
import type { Aroma, Cafea, Corp, Prajire, Proces, Profil } from '../data/cafele';
import type { ImaginePunga } from '../lib/pungi';
import { cale } from '../lib/cale';

type Sortare = 'implicit' | 'pret-crescator' | 'pret-descrescator' | 'scor' | 'reducere' | 'cota';

type Filtre = {
  arome: Aroma[];
  corpuri: Corp[];
  intensitati: number[];
  procese: Proces[];
  profile: Profil[];
  pentru: ('filtru' | 'espresso')[];
  preturi: string[];
  doarReduse: boolean;
};

const GOL: Filtre = {
  arome: [],
  corpuri: [],
  intensitati: [],
  procese: [],
  profile: [],
  pentru: [],
  preturi: [],
  doarReduse: false,
};

const AROME: Aroma[] = ['Citrice', 'Fructe roșii', 'Floral', 'Ciocolată', 'Caramel', 'Nucă'];
const CORPURI: Corp[] = ['Ușor', 'Mediu', 'Gros'];
const INTENSITATI = [1, 2, 3, 4, 5];
const PROCESE: Proces[] = ['Spălat', 'Natural', 'Honey galben', 'Anaerob', 'Sugarcane EA'];
const PROFILE: { val: Profil; text: string }[] = [
  { val: 'fructat', text: 'Fructat și viu' },
  { val: 'echilibrat', text: 'Echilibrat și dulce' },
  { val: 'intens', text: 'Intens și cacao' },
];
const PENTRU: { val: 'filtru' | 'espresso'; text: string }[] = [
  { val: 'filtru', text: 'Filtru' },
  { val: 'espresso', text: 'Espresso' },
];
const PRETURI: { val: string; text: string; test: (c: Cafea) => boolean }[] = [
  { val: 'sub-50', text: 'Sub 50 lei', test: (c) => c.pret250 < 50 },
  { val: '50-65', text: '50 – 65 lei', test: (c) => c.pret250 >= 50 && c.pret250 <= 65 },
  { val: '65-80', text: '65 – 80 lei', test: (c) => c.pret250 > 65 && c.pret250 <= 80 },
  { val: 'peste-80', text: 'Peste 80 lei', test: (c) => c.pret250 > 80 },
];

const SORTARI: { val: Sortare; text: string }[] = [
  { val: 'implicit', text: 'Implicit' },
  { val: 'pret-crescator', text: 'Preț: de la mic la mare' },
  { val: 'pret-descrescator', text: 'Preț: de la mare la mic' },
  { val: 'scor', text: 'Scor de cupping' },
  { val: 'reducere', text: 'Reducerea cea mai mare' },
  { val: 'cota', text: 'Cota fermei' },
];

const potrivestePentru = (p: Prajire, cerut: 'filtru' | 'espresso') => p === 'omni' || p === cerut;

function comuta<T>(lista: T[], val: T): T[] {
  return lista.includes(val) ? lista.filter((x) => x !== val) : [...lista, val];
}

/** Aplică filtrele, opțional sărind peste o axă — de aici ies numărătorile. */
function filtreaza(cafele: Cafea[], f: Filtre, sari?: keyof Filtre) {
  return cafele.filter((c) => {
    if (sari !== 'arome' && f.arome.length && !f.arome.some((a) => c.arome.includes(a)))
      return false;
    if (sari !== 'corpuri' && f.corpuri.length && !f.corpuri.includes(c.corp)) return false;
    if (sari !== 'intensitati' && f.intensitati.length && !f.intensitati.includes(c.intensitate))
      return false;
    if (sari !== 'procese' && f.procese.length && !f.procese.includes(c.proces)) return false;
    if (sari !== 'profile' && f.profile.length && !f.profile.includes(c.profil)) return false;
    if (sari !== 'pentru' && f.pentru.length && !f.pentru.some((p) => potrivestePentru(c.prajire, p)))
      return false;
    if (
      sari !== 'preturi' &&
      f.preturi.length &&
      !PRETURI.filter((o) => f.preturi.includes(o.val)).some((o) => o.test(c))
    )
      return false;
    if (sari !== 'doarReduse' && f.doarReduse && !c.pretVechi) return false;
    return true;
  });
}

type Props = { cafele: Cafea[]; imagini: Record<string, ImaginePunga> };

export default function CatalogCafele({ cafele, imagini }: Props) {
  const [f, setF] = useState<Filtre>(GOL);
  const [sortare, setSortare] = useState<Sortare>('implicit');
  const [gata, setGata] = useState(false);
  const [panouDeschis, setPanouDeschis] = useState(false);
  const [deschise, setDeschise] = useState<string[]>(['Aromă', 'Corp', 'Intensitate']);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const nou = { ...GOL };
    const profil = p.get('profil');
    if (profil === 'fructat' || profil === 'echilibrat' || profil === 'intens')
      nou.profile = [profil];
    const pen = p.get('pentru');
    if (pen === 'filtru' || pen === 'espresso') nou.pentru = [pen];
    const proc = p.get('proces');
    if (proc && (PROCESE as string[]).includes(proc)) nou.procese = [proc as Proces];
    if (p.get('reduse') === '1') nou.doarReduse = true;
    setF(nou);
    if (nou.profile.length) setDeschise((d) => [...d, 'Profil de gust']);
    if (nou.pentru.length) setDeschise((d) => [...d, 'Prăjită pentru']);
    if (nou.procese.length) setDeschise((d) => [...d, 'Proces la fermă']);
    setGata(true);
  }, []);

  useEffect(() => {
    if (!gata) return;
    const params = new URLSearchParams();
    if (f.profile.length === 1) params.set('profil', f.profile[0]);
    if (f.pentru.length === 1) params.set('pentru', f.pentru[0]);
    if (f.procese.length === 1) params.set('proces', f.procese[0]);
    if (f.doarReduse) params.set('reduse', '1');
    const q = params.toString();
    window.history.replaceState({}, '', q ? `?${q}` : window.location.pathname);
  }, [f, gata]);

  const rezultate = useMemo(() => {
    const lista = filtreaza(cafele, f);
    switch (sortare) {
      case 'pret-crescator':
        lista.sort((a, b) => a.pret250 - b.pret250);
        break;
      case 'pret-descrescator':
        lista.sort((a, b) => b.pret250 - a.pret250);
        break;
      case 'scor':
        lista.sort((a, b) => b.scor - a.scor);
        break;
      case 'cota':
        lista.sort((a, b) => b.altitudine - a.altitudine);
        break;
      case 'reducere':
        lista.sort(
          (a, b) =>
            (procentReducere(b.pret250, b.pretVechi) ?? 0) -
            (procentReducere(a.pret250, a.pretVechi) ?? 0),
        );
        break;
    }
    return lista;
  }, [cafele, f, sortare]);

  const numara = (axa: keyof Filtre, test: (c: Cafea) => boolean) =>
    filtreaza(cafele, f, axa).filter(test).length;

  const nrActive =
    f.arome.length +
    f.corpuri.length +
    f.intensitati.length +
    f.procese.length +
    f.profile.length +
    f.pentru.length +
    f.preturi.length +
    (f.doarReduse ? 1 : 0);

  /** Filtrele bifate, ca să le poți scoate una câte una de deasupra grilei. */
  const active: { text: string; scoate: () => void }[] = [
    ...f.arome.map((v) => ({ text: v, scoate: () => setF((s) => ({ ...s, arome: comuta(s.arome, v) })) })),
    ...f.corpuri.map((v) => ({
      text: `Corp ${v.toLowerCase()}`,
      scoate: () => setF((s) => ({ ...s, corpuri: comuta(s.corpuri, v) })),
    })),
    ...f.intensitati.map((v) => ({
      text: `Intensitate ${v}`,
      scoate: () => setF((s) => ({ ...s, intensitati: comuta(s.intensitati, v) })),
    })),
    ...f.profile.map((v) => ({
      text: PROFILE.find((o) => o.val === v)!.text,
      scoate: () => setF((s) => ({ ...s, profile: comuta(s.profile, v) })),
    })),
    ...f.pentru.map((v) => ({
      text: `Pentru ${PENTRU.find((o) => o.val === v)!.text.toLowerCase()}`,
      scoate: () => setF((s) => ({ ...s, pentru: comuta(s.pentru, v) })),
    })),
    ...f.procese.map((v) => ({
      text: v,
      scoate: () => setF((s) => ({ ...s, procese: comuta(s.procese, v) })),
    })),
    ...f.preturi.map((v) => ({
      text: PRETURI.find((o) => o.val === v)!.text,
      scoate: () => setF((s) => ({ ...s, preturi: comuta(s.preturi, v) })),
    })),
    ...(f.doarReduse
      ? [{ text: 'La reducere', scoate: () => setF((s) => ({ ...s, doarReduse: false })) }]
      : []),
  ];

  const comutaGrup = (titlu: string) =>
    setDeschise((d) => (d.includes(titlu) ? d.filter((x) => x !== titlu) : [...d, titlu]));

  type Optiune = {
    cheie: string;
    eticheta: string;
    bifat: boolean;
    numar: number;
    schimba: () => void;
    puncte?: number;
  };

  const grupuri: { titlu: string; optiuni: Optiune[] }[] = [
    {
      titlu: 'Aromă',
      optiuni: AROME.map((a) => ({
        cheie: a,
        eticheta: a,
        bifat: f.arome.includes(a),
        numar: numara('arome', (c) => c.arome.includes(a)),
        schimba: () => setF((s) => ({ ...s, arome: comuta(s.arome, a) })),
      })),
    },
    {
      titlu: 'Corp',
      optiuni: CORPURI.map((v) => ({
        cheie: v,
        eticheta: v,
        bifat: f.corpuri.includes(v),
        numar: numara('corpuri', (c) => c.corp === v),
        schimba: () => setF((s) => ({ ...s, corpuri: comuta(s.corpuri, v) })),
      })),
    },
    {
      titlu: 'Intensitate',
      optiuni: INTENSITATI.map((n) => ({
        cheie: String(n),
        eticheta: `Intensitate ${n}`,
        puncte: n,
        bifat: f.intensitati.includes(n),
        numar: numara('intensitati', (c) => c.intensitate === n),
        schimba: () => setF((s) => ({ ...s, intensitati: comuta(s.intensitati, n) })),
      })),
    },
    {
      titlu: 'Profil de gust',
      optiuni: PROFILE.map((o) => ({
        cheie: o.val,
        eticheta: o.text,
        bifat: f.profile.includes(o.val),
        numar: numara('profile', (c) => c.profil === o.val),
        schimba: () => setF((s) => ({ ...s, profile: comuta(s.profile, o.val) })),
      })),
    },
    {
      titlu: 'Prăjită pentru',
      optiuni: PENTRU.map((o) => ({
        cheie: o.val,
        eticheta: o.text,
        bifat: f.pentru.includes(o.val),
        numar: numara('pentru', (c) => potrivestePentru(c.prajire, o.val)),
        schimba: () => setF((s) => ({ ...s, pentru: comuta(s.pentru, o.val) })),
      })),
    },
    {
      titlu: 'Proces la fermă',
      optiuni: PROCESE.map((o) => ({
        cheie: o,
        eticheta: o,
        bifat: f.procese.includes(o),
        numar: numara('procese', (c) => c.proces === o),
        schimba: () => setF((s) => ({ ...s, procese: comuta(s.procese, o) })),
      })),
    },
    {
      titlu: 'Preț',
      optiuni: PRETURI.map((o) => ({
        cheie: o.val,
        eticheta: o.text,
        bifat: f.preturi.includes(o.val),
        numar: numara('preturi', o.test),
        schimba: () => setF((s) => ({ ...s, preturi: comuta(s.preturi, o.val) })),
      })),
    },
    {
      titlu: 'Ofertă',
      optiuni: [
        {
          cheie: 'reduse',
          eticheta: 'Doar produsele la reducere',
          bifat: f.doarReduse,
          numar: numara('doarReduse', (c) => !!c.pretVechi),
          schimba: () => setF((s) => ({ ...s, doarReduse: !s.doarReduse })),
        },
      ],
    },
  ];

  return (
    <div className="magazin">
      <button
        type="button"
        className="filtre-comuta"
        aria-expanded={panouDeschis}
        onClick={() => setPanouDeschis((v) => !v)}
      >
        <svg viewBox="0 0 20 20" aria-hidden="true" width="16" height="16">
          <path
            d="M3 5h14M6 10h8M8.5 15h3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
        Filtre
        {nrActive > 0 && <span className="filtre-numar-activ">{nrActive}</span>}
      </button>

      <aside className={`filtre-panou${panouDeschis ? ' deschis' : ''}`} aria-label="Filtre">
        <h2 className="filtre-titlu">Filtre</h2>

        {grupuri.map((g) => {
          const desfacut = deschise.includes(g.titlu);
          const bifateAici = g.optiuni.filter((o) => o.bifat).length;
          return (
            <div className="acordeon" key={g.titlu}>
              <button
                type="button"
                className={`acordeon-cap${bifateAici ? ' are-filtre' : ''}`}
                aria-expanded={desfacut}
                onClick={() => comutaGrup(g.titlu)}
              >
                <span className="acordeon-titlu">
                  {g.titlu}
                  {bifateAici > 0 && <span className="acordeon-numar">{bifateAici}</span>}
                </span>
                <span aria-hidden="true">{desfacut ? '−' : '+'}</span>
              </button>
              {desfacut && (
                <div className="acordeon-corp">
                  {g.optiuni.map((o) => (
                    <label
                      key={o.cheie}
                      className={`bifa${o.numar === 0 && !o.bifat ? ' goala' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={o.bifat}
                        onChange={o.schimba}
                        disabled={o.numar === 0 && !o.bifat}
                      />
                      <span className="bifa-text">
                        {o.puncte ? (
                          <span className="puncte" aria-label={o.eticheta}>
                            {[1, 2, 3, 4, 5].map((i) => (
                              <span key={i} className={i <= o.puncte! ? 'punct plin' : 'punct'} />
                            ))}
                          </span>
                        ) : (
                          o.eticheta
                        )}
                      </span>
                      <span className="bifa-numar">{o.numar}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {nrActive > 0 && (
          <button type="button" className="filtre-sterge" onClick={() => setF(GOL)}>
            Șterge toate filtrele
          </button>
        )}

        <h2 className="filtre-titlu categorii-titlu">Categorii produse</h2>
        <ul className="categorii-lista">
          <li>
            <a href={cale('/cafea')}>Cafea boabe</a>
            <ul>
              <li>
                <a href={cale('/cafea?pentru=filtru')}>Cafea pentru filtru</a>
              </li>
              <li>
                <a href={cale('/cafea?pentru=espresso')}>Cafea pentru espresso</a>
              </li>
              <li>
                <a href={cale('/cafea?profil=fructat')}>Cafea fructată</a>
              </li>
              <li>
                <a href={cale('/cafea?profil=echilibrat')}>Cafea echilibrată</a>
              </li>
              <li>
                <a href={cale('/cafea?profil=intens')}>Cafea intensă</a>
              </li>
              <li>
                <a href={cale('/cafea?proces=Anaerob')}>Loturi experimentale</a>
              </li>
              <li>
                <a href={cale('/cafea?proces=Sugarcane+EA')}>Cafea decofeinizată</a>
              </li>
            </ul>
          </li>
          <li>
            <a href={cale('/pachete')}>Pachete și cadouri</a>
          </li>
          <li>
            <a href={cale('/accesorii')}>Accesorii</a>
          </li>
          <li>
            <a href={cale('/abonament')}>Abonament lunar</a>
          </li>
          <li>
            <a href={cale('/promotii')}>Produse la reducere</a>
          </li>
        </ul>
      </aside>

      <div className="magazin-rezultate">
        <div className="magazin-bara">
          <p className="magazin-numar">
            {rezultate.length === cafele.length
              ? `${cafele.length} produse`
              : `${rezultate.length} din ${cafele.length} produse`}
          </p>

          <label className="sortare-camp">
            <span>Ordonează după</span>
            <select
              className="select-sortare"
              value={sortare}
              onChange={(e) => setSortare(e.target.value as Sortare)}
            >
              {SORTARI.map((s) => (
                <option key={s.val} value={s.val}>
                  {s.text}
                </option>
              ))}
            </select>
          </label>
        </div>

        {active.length > 0 && (
          <ul className="filtre-active">
            {active.map((a) => (
              <li key={a.text}>
                <button type="button" onClick={a.scoate} aria-label={`Scoate filtrul ${a.text}`}>
                  {a.text}
                  <span aria-hidden="true">×</span>
                </button>
              </li>
            ))}
            <li>
              <button type="button" className="filtre-golire" onClick={() => setF(GOL)}>
                Șterge tot
              </button>
            </li>
          </ul>
        )}

        {rezultate.length === 0 ? (
          <p className="gol">
            Nicio cafea nu are toate însușirile astea deodată.{' '}
            <button type="button" className="filtre-sterge inline" onClick={() => setF(GOL)}>
              Șterge filtrele
            </button>
          </p>
        ) : (
          <div className="grila-magazin">
            {rezultate.map((c, i) => (
              <CardCafea key={c.slug} cafea={c} imagine={imagini[c.slug]} prioritara={i < 3} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
