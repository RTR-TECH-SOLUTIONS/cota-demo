import { useState } from 'react';
import { adauga } from '../lib/cos';
import { lei } from '../lib/format';
import { cale } from '../lib/cale';

type Props = {
  slug: string;
  origine: string;
  regiune: string;
  culoare: string;
  pret250: number;
  pret1000: number;
  stoc: number;
};

const GRAMAJE = [
  { val: '250 g' as const, camp: 'pret250' as const },
  { val: '1 kg' as const, camp: 'pret1000' as const },
];

const MACINARI = [
  'Boabe întregi',
  'Espresso',
  'Filtru, V60',
  'Moka',
  'Cafetieră',
];

export default function AdaugaInCos({
  slug,
  origine,
  regiune,
  culoare,
  pret250,
  pret1000,
  stoc,
}: Props) {
  const [gramaj, setGramaj] = useState<'250 g' | '1 kg'>('250 g');
  const [macinare, setMacinare] = useState(MACINARI[0]);
  const [cant, setCant] = useState(1);
  const [adaugat, setAdaugat] = useState(false);

  const pret = gramaj === '250 g' ? pret250 : pret1000;
  const epuizat = stoc === 0;

  function trimite() {
    adauga(
      {
        id: `${slug}|${gramaj}|${macinare}`,
        slug,
        titlu: origine,
        varianta: `${gramaj} · ${macinare}`,
        pret,
        culoare,
        origine,
        regiune,
        gramaj,
      },
      cant,
    );
    setAdaugat(true);
    window.setTimeout(() => setAdaugat(false), 6000);
  }

  return (
    <div className="cumpara">
      <fieldset className="optiune">
        <legend className="filtre-titlu">Gramaj</legend>
        <div className="filtre-optiuni">
          {GRAMAJE.map((g) => (
            <button
              key={g.val}
              type="button"
              className="chip"
              aria-pressed={gramaj === g.val}
              onClick={() => setGramaj(g.val)}
            >
              {g.val}
              <span className="chip-pret">{lei(g.camp === 'pret250' ? pret250 : pret1000)} lei</span>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="optiune">
        <legend className="filtre-titlu">Măcinare</legend>
        <div className="filtre-optiuni">
          {MACINARI.map((m) => (
            <button
              key={m}
              type="button"
              className="chip"
              aria-pressed={macinare === m}
              onClick={() => setMacinare(m)}
            >
              {m}
            </button>
          ))}
        </div>
        <p className="nota-macinare">
          {macinare === 'Boabe întregi'
            ? 'Recomandat. Cafeaua își ține aroma două–trei săptămâni după prăjire.'
            : 'O măcinăm în ziua expedierii. Bea-o în zece zile, după aceea își pierde partea de sus.'}
        </p>
      </fieldset>

      <div className="rand-cumpara">
        <div className="cantitate">
          <button
            type="button"
            onClick={() => setCant((c) => Math.max(1, c - 1))}
            aria-label="Scade cantitatea"
            disabled={cant <= 1}
          >
            −
          </button>
          <span aria-live="polite" aria-label={`Cantitate ${cant}`}>{cant}</span>
          <button
            type="button"
            onClick={() => setCant((c) => Math.min(20, c + 1))}
            aria-label="Crește cantitatea"
            disabled={cant >= 20}
          >
            +
          </button>
        </div>

        <button type="button" className="btn btn-primary buton-adauga" onClick={trimite} disabled={epuizat}>
          {epuizat ? 'Lot epuizat' : `Adaugă în coș · ${lei(pret * cant)} lei`}
        </button>
      </div>

      <p className="confirmare" role="status" aria-live="polite">
        {adaugat ? (
          <>
            Adăugat în coș. <a href={cale('/cos')} className="link-rule">Vezi coșul</a>
          </>
        ) : (
          ''
        )}
      </p>
    </div>
  );
}
