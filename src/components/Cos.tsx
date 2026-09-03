import { useEffect, useState } from 'react';
import {
  asculta,
  citesteCos,
  livrare,
  schimbaCantitatea,
  sterge,
  subtotal,
  total,
  PRAG_LIVRARE_GRATUITA,
  type ArticolCos,
} from '../lib/cos';
import { lei } from '../lib/format';
import type { ImaginePunga } from '../lib/pungi';
import { cale } from '../lib/cale';

export default function Cos({ imagini }: { imagini: Record<string, ImaginePunga> }) {
  const [articole, setArticole] = useState<ArticolCos[]>([]);
  const [incarcat, setIncarcat] = useState(false);

  useEffect(() => {
    setArticole(citesteCos());
    setIncarcat(true);
    return asculta(setArticole);
  }, []);

  if (!incarcat) {
    return <p className="cos-asteptare">Se încarcă coșul…</p>;
  }

  if (articole.length === 0) {
    return (
      <div className="cos-gol">
        <p className="field-label">Coșul e gol</p>
        <h2>Nu ai nimic în coș.</h2>
        <p>Zece loturi te așteaptă pe raft, toate prăjite săptămâna asta.</p>
        <a href={cale('/cafea')} className="btn btn-primary">
          Vezi cafelele
        </a>
      </div>
    );
  }

  const s = subtotal(articole);
  const t = livrare(articole);
  const lipsa = Math.max(0, PRAG_LIVRARE_GRATUITA - s);

  return (
    <div className="cos-grila">
      <div>
        <ul className="cos-lista">
          {articole.map((a) => (
            <li key={a.id} className="cos-articol">
              <a className="cos-vizual" href={cale(`/cafea/${a.slug}`)} aria-hidden="true" tabIndex={-1}>
                {imagini[a.slug] ? (
                  <img
                    src={imagini[a.slug].src}
                    srcSet={imagini[a.slug].srcset}
                    sizes="72px"
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <span className="cos-vizual-gol" style={{ background: a.culoare }} />
                )}
              </a>

              <div className="cos-detalii">
                <h3>
                  <a href={cale(`/cafea/${a.slug}`)}>{a.titlu}</a>
                </h3>
                <p className="cos-varianta">{a.varianta}</p>
                <p className="cos-bucata">{lei(a.pret)} lei bucata</p>
              </div>

              <div className="cos-cantitate">
                <div className="cantitate">
                  <button
                    type="button"
                    onClick={() => schimbaCantitatea(a.id, a.cant - 1)}
                    aria-label={`Scade cantitatea pentru ${a.titlu}`}
                  >
                    −
                  </button>
                  <span>{a.cant}</span>
                  <button
                    type="button"
                    onClick={() => schimbaCantitatea(a.id, a.cant + 1)}
                    aria-label={`Crește cantitatea pentru ${a.titlu}`}
                  >
                    +
                  </button>
                </div>
                <button type="button" className="filtre-reset" onClick={() => sterge(a.id)}>
                  Scoate
                </button>
              </div>

              <p className="cos-linie-total">{lei(a.pret * a.cant)} lei</p>
            </li>
          ))}
        </ul>
      </div>

      <aside className="cos-sumar" aria-label="Sumarul comenzii">
        <h2 className="field-label">Sumar</h2>
        <dl className="cos-sumar-lista">
          <div className="spec-row">
            <dt>Produse</dt>
            <span className="spec-dots" aria-hidden="true" />
            <dd>{lei(s)} lei</dd>
          </div>
          <div className="spec-row">
            <dt>Livrare</dt>
            <span className="spec-dots" aria-hidden="true" />
            <dd>{t === 0 ? 'gratuită' : `${lei(t)} lei`}</dd>
          </div>
        </dl>

        <p className="cos-total">
          <span>Total</span>
          <span>{lei(total(articole))} lei</span>
        </p>

        {lipsa > 0 ? (
          <p className="cos-prag">
            Mai adaugă {lei(lipsa)} lei și livrarea e din partea noastră.
          </p>
        ) : (
          <p className="cos-prag cos-prag-atins">Livrare gratuită, ai trecut de 150 lei.</p>
        )}

        <a href={cale('/finalizare')} className="btn btn-primary cos-buton">
          Finalizează comanda
        </a>
        <a href={cale('/cafea')} className="link-rule cos-inapoi">
          Continuă cumpărăturile
        </a>
      </aside>
    </div>
  );
}
