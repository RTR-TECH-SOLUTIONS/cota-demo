import { useEffect, useRef, useState } from 'react';
import { adauga } from '../lib/cos';
import { lei } from '../lib/format';

type Props = {
  slug: string;
  nume: string;
  subtitlu: string;
  pret: number;
  categorie: 'pachet' | 'accesoriu';
  stoc: number;
};

export default function AdaugaProdus({ slug, nume, subtitlu, pret, categorie, stoc }: Props) {
  const [cant, setCant] = useState(1);
  const [adaugat, setAdaugat] = useState(false);
  const cronometru = useRef<number>();

  useEffect(() => () => window.clearTimeout(cronometru.current), []);

  const epuizat = stoc === 0;

  const inCos = () => {
    adauga(
      {
        id: slug,
        slug,
        titlu: nume,
        varianta: subtitlu,
        pret,
        culoare: '#2a2724',
        origine: nume,
        regiune: subtitlu,
        gramaj: categorie === 'pachet' ? 'pachet' : 'bucată',
      },
      cant,
    );
    setAdaugat(true);
    window.clearTimeout(cronometru.current);
    cronometru.current = window.setTimeout(() => setAdaugat(false), 3200);
  };

  return (
    <div className="adauga">
      <div className="adauga-rand">
        <div className="cantitate">
          <button
            type="button"
            onClick={() => setCant((c) => Math.max(1, c - 1))}
            aria-label="Scade cantitatea"
            disabled={cant <= 1}
          >
            −
          </button>
          <span aria-live="polite">{cant}</span>
          <button
            type="button"
            onClick={() => setCant((c) => Math.min(stoc || 1, c + 1))}
            aria-label="Crește cantitatea"
            disabled={cant >= stoc}
          >
            +
          </button>
        </div>

        <button type="button" className="btn btn-primary adauga-buton" onClick={inCos} disabled={epuizat}>
          {epuizat ? 'Temporar indisponibil' : `Adaugă în coș · ${lei(pret * cant)} lei`}
        </button>
      </div>

      <p className="adauga-nota" role="status">
        {adaugat
          ? `Am pus ${cant} × ${nume} în coș.`
          : epuizat
            ? 'Scrie-ne și te anunțăm când revine pe stoc.'
            : 'Livrare gratuită peste 150 lei. Expediem în 24 de ore.'}
      </p>
    </div>
  );
}
