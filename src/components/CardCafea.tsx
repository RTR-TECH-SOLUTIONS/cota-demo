import { useEffect, useRef, useState } from 'react';
import { adauga } from '../lib/cos';
import { lei } from '../lib/format';
import { procentReducere } from '../data/altele';
import type { Cafea } from '../data/cafele';
import type { ImaginePunga } from '../lib/pungi';
import Stele from './Stele';
import { cale } from '../lib/cale';

const ETICHETA_PRAJIRE: Record<Cafea['prajire'], string> = {
  filtru: 'Filtru',
  espresso: 'Espresso',
  omni: 'Filtru / espresso',
};

type Props = { cafea: Cafea; imagine?: ImaginePunga; prioritara?: boolean };

export default function CardCafea({ cafea, imagine, prioritara }: Props) {
  const putin = cafea.stoc > 0 && cafea.stoc <= 12;
  const epuizat = cafea.stoc === 0;
  const reducere = procentReducere(cafea.pret250, cafea.pretVechi);
  const [adaugat, setAdaugat] = useState(false);
  const cronometru = useRef<number>();

  useEffect(() => () => window.clearTimeout(cronometru.current), []);

  const inCos = () => {
    adauga({
      id: `${cafea.slug}-250-boabe`,
      slug: cafea.slug,
      titlu: `${cafea.origine}, ${cafea.regiune}`,
      varianta: '250 g · Boabe întregi',
      pret: cafea.pret250,
      culoare: cafea.culoareEticheta,
      origine: cafea.origine,
      regiune: cafea.regiune,
      gramaj: '250 g',
    });
    setAdaugat(true);
    window.clearTimeout(cronometru.current);
    cronometru.current = window.setTimeout(() => setAdaugat(false), 2600);
  };

  return (
    <article className="card">
      <a className="card-foto" href={cale(`/cafea/${cafea.slug}`)} tabIndex={-1} aria-hidden="true">
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
        {cafea.limitata && <span className="badge badge-lot">Ediție limitată</span>}
      </a>

      <div className="card-corp">
        <Stele scor={cafea.scor} />

        <h3 className="card-nume">
          <a href={cale(`/cafea/${cafea.slug}`)}>
            {cafea.origine} {cafea.regiune}
          </a>
        </h3>
        <p className="card-sub">
          {ETICHETA_PRAJIRE[cafea.prajire]} · {cafea.corp} · {cafea.note.join(', ')}
        </p>

        <div className="card-jos">
          <p className="card-pret">
            {cafea.pretVechi && <s>{lei(cafea.pretVechi)} lei</s>}
            <strong className={reducere !== null ? 'redus' : undefined}>
              {lei(cafea.pret250)} lei – {lei(cafea.pret1000)} lei
            </strong>
          </p>

          <p className={`card-stoc${putin ? ' putin' : ''}${epuizat ? ' epuizat' : ''}`}>
            <span className="card-punct" aria-hidden="true" />
            {epuizat ? 'Epuizat' : putin ? `Ultimele ${cafea.stoc}` : 'În stoc'}
          </p>
        </div>

        <button
          type="button"
          className="card-buton"
          onClick={inCos}
          disabled={epuizat}
          aria-label={`Adaugă în coș ${cafea.origine}, pungă de 250 g`}
        >
          {epuizat ? 'Anunță-mă când revine' : adaugat ? 'Adăugat în coș' : 'Adaugă în coș'}
        </button>
        <a className="card-optiuni" href={cale(`/cafea/${cafea.slug}`)}>
          Alege gramajul și măcinarea
        </a>
        <span className="sr-live" role="status">
          {adaugat ? `${cafea.origine}, 250 g, adăugată în coș.` : ''}
        </span>
      </div>
    </article>
  );
}
