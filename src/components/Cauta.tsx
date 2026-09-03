import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { lei } from '../lib/format';
import type { Cafea } from '../data/cafele';
import type { ImaginePunga } from '../lib/pungi';
import { cale } from '../lib/cale';

type Props = {
  cafele: Cafea[];
  imagini: Record<string, ImaginePunga>;
};

/** Text în care căutăm: tot ce ar putea scrie un om în bară. */
function indexeaza(c: Cafea) {
  return [c.origine, c.regiune, c.producator, c.varietate, c.proces, ...c.note]
    .join(' ')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

const normalizeaza = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

export default function Cauta({ cafele, imagini }: Props) {
  const [q, setQ] = useState('');
  const [deschis, setDeschis] = useState(false);
  const [selectat, setSelectat] = useState(-1);
  const container = useRef<HTMLDivElement>(null);
  const id = useId();

  const catalog = useMemo(() => cafele.map((c) => ({ c, text: indexeaza(c) })), [cafele]);

  const rezultate = useMemo(() => {
    const t = normalizeaza(q);
    if (t.length < 2) return [];
    return catalog
      .filter(({ text }) => t.split(/\s+/).every((cuv) => text.includes(cuv)))
      .slice(0, 5)
      .map(({ c }) => c);
  }, [catalog, q]);

  // Click în afară închide sugestiile.
  useEffect(() => {
    const peDocument = (e: MouseEvent) => {
      if (!container.current?.contains(e.target as Node)) setDeschis(false);
    };
    document.addEventListener('mousedown', peDocument);
    return () => document.removeEventListener('mousedown', peDocument);
  }, []);

  useEffect(() => setSelectat(-1), [q]);

  const mergiLa = (c: Cafea) => {
    window.location.href = cale(`/cafea/${c.slug}`);
  };

  const laTasta = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setDeschis(false);
      return;
    }
    if (!rezultate.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectat((s) => (s + 1) % rezultate.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectat((s) => (s <= 0 ? rezultate.length - 1 : s - 1));
    } else if (e.key === 'Enter' && selectat >= 0) {
      e.preventDefault();
      mergiLa(rezultate[selectat]);
    }
  };

  const arata = deschis && q.trim().length >= 2;

  return (
    <div className="cautare" ref={container}>
      <form
        className="cautare-camp"
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          if (rezultate.length) mergiLa(rezultate[Math.max(0, selectat)]);
        }}
      >
        <svg className="cautare-lupa" viewBox="0 0 20 20" aria-hidden="true">
          <circle cx="9" cy="9" r="6" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M13.5 13.5 17 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setDeschis(true);
          }}
          onFocus={() => setDeschis(true)}
          onKeyDown={laTasta}
          placeholder="Caută o origine, o notă de gust, un proces…"
          aria-label="Caută în catalog"
          aria-expanded={arata}
          aria-controls={`${id}-sugestii`}
          aria-autocomplete="list"
          role="combobox"
        />
        <button type="submit" className="cautare-buton">
          Caută
        </button>
      </form>

      {arata && (
        <div className="cautare-panou" id={`${id}-sugestii`} role="listbox">
          {rezultate.length === 0 ? (
            <p className="cautare-gol">
              Nimic pentru „{q.trim()}". Încearcă „etiopia", „caramel" sau „spălat".
            </p>
          ) : (
            <>
              <ul className="cautare-lista">
                {rezultate.map((c, i) => (
                  <li key={c.slug}>
                    <a
                      href={cale(`/cafea/${c.slug}`)}
                      className={`cautare-rand${i === selectat ? ' activ' : ''}`}
                      role="option"
                      aria-selected={i === selectat}
                      onMouseEnter={() => setSelectat(i)}
                    >
                      {imagini[c.slug] && (
                        <img src={imagini[c.slug].src} alt="" width={44} height={55} loading="lazy" />
                      )}
                      <span className="cautare-text">
                        <span className="cautare-nume">{c.origine}</span>
                        <span className="cautare-detaliu">{c.note.join(' · ')}</span>
                      </span>
                      <span className="cautare-pret">{lei(c.pret250)} lei</span>
                    </a>
                  </li>
                ))}
              </ul>
              <a className="cautare-toate" href={cale('/cafea')}>
                Vezi tot catalogul
              </a>
            </>
          )}
        </div>
      )}
    </div>
  );
}
