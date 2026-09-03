import { useEffect, useRef, useState } from 'react';
import { adauga } from '../lib/cos';
import { lei } from '../lib/format';
import { procentReducere } from '../data/altele';
import type { Produs } from '../data/altele';
import type { ImagineProdus } from '../lib/produse';
import { cale } from '../lib/cale';

type Props = { produs: Produs; imagine?: ImagineProdus; prioritara?: boolean };

/** Cardul pentru pachete și accesorii. Aceeași anatomie ca la cafea, ca grila
    să rămână uniformă când se amestecă în pagina de promoții. */
export default function CardProdus({ produs, imagine, prioritara }: Props) {
  const putin = produs.stoc > 0 && produs.stoc <= 12;
  const epuizat = produs.stoc === 0;
  const reducere = procentReducere(produs.pret, produs.pretVechi);
  const pagina = cale(produs.categorie === 'pachet' ? '/pachete' : '/accesorii');
  const [adaugat, setAdaugat] = useState(false);
  const cronometru = useRef<number>();

  useEffect(() => () => window.clearTimeout(cronometru.current), []);

  const inCos = () => {
    adauga({
      id: produs.slug,
      slug: produs.slug,
      titlu: produs.nume,
      varianta: produs.subtitlu,
      pret: produs.pret,
      culoare: '#2a2724',
      origine: produs.nume,
      regiune: produs.subtitlu,
      gramaj: produs.categorie === 'pachet' ? 'pachet' : 'bucată',
    });
    setAdaugat(true);
    window.clearTimeout(cronometru.current);
    cronometru.current = window.setTimeout(() => setAdaugat(false), 2600);
  };

  return (
    <article className="card">
      <a className="card-foto" href={`${pagina}#${produs.slug}`} tabIndex={-1} aria-hidden="true">
        {imagine && (
          <img
            src={imagine.src}
            srcSet={imagine.srcset}
            sizes="(min-width: 1100px) 22vw, (min-width: 640px) 30vw, 46vw"
            width={imagine.latime}
            height={imagine.inaltime}
            alt=""
            loading={prioritara ? 'eager' : 'lazy'}
            decoding="async"
          />
        )}
        {reducere !== null && <span className="badge badge-reducere">−{reducere}%</span>}
      </a>

      <div className="card-corp">
        <h3 className="card-nume">
          <a href={`${pagina}#${produs.slug}`}>{produs.nume}</a>
        </h3>
        <p className="card-sub">
          {produs.categorie === 'pachet' ? 'Pachet' : 'Accesoriu'} · {produs.cuprinde[0][1]}
        </p>
        <p className="card-note">{produs.subtitlu}</p>

        <div className="card-jos">
          <p className="card-pret">
            {produs.pretVechi && <s>{lei(produs.pretVechi)}</s>}
            <strong className={reducere !== null ? 'redus' : undefined}>
              {lei(produs.pret)} lei
            </strong>
          </p>

          <p className={`card-stoc${putin ? ' putin' : ''}${epuizat ? ' epuizat' : ''}`}>
            <span className="card-punct" aria-hidden="true" />
            {epuizat ? 'Epuizat' : putin ? `Ultimele ${produs.stoc}` : 'În stoc'}
          </p>
        </div>

        <p className="card-economie">
          {produs.pretVechi ? `Economisești ${lei(produs.pretVechi - produs.pret)} lei` : ''}
        </p>

        <button
          type="button"
          className="card-buton"
          onClick={inCos}
          disabled={epuizat}
          aria-label={`Adaugă în coș ${produs.nume}`}
        >
          {epuizat ? 'Anunță-mă când revine' : adaugat ? 'Adăugat în coș' : 'Adaugă în coș'}
        </button>
        <span className="sr-live" role="status">
          {adaugat ? `${produs.nume} adăugat în coș.` : ''}
        </span>
      </div>
    </article>
  );
}
