import { useEffect, useState, type FormEvent } from 'react';
import {
  asculta,
  citesteCos,
  goleste,
  livrare,
  subtotal,
  total,
  type ArticolCos,
} from '../lib/cos';
import { lei } from '../lib/format';
import { cale } from '../lib/cale';

type Campuri = {
  nume: string;
  email: string;
  telefon: string;
  adresa: string;
  oras: string;
  judet: string;
  livrareTip: 'curier' | 'ridicare';
  plata: 'card' | 'ramburs';
  observatii: string;
};

const GOL: Campuri = {
  nume: '',
  email: '',
  telefon: '',
  adresa: '',
  oras: '',
  judet: '',
  livrareTip: 'curier',
  plata: 'card',
  observatii: '',
};

const eEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
const eTelefon = (v: string) => /^(\+4)?0?7\d{8}$/.test(v.replace(/[\s.-]/g, ''));

export default function Finalizare() {
  const [articole, setArticole] = useState<ArticolCos[]>([]);
  const [incarcat, setIncarcat] = useState(false);
  const [c, setC] = useState<Campuri>(GOL);
  const [erori, setErori] = useState<Partial<Record<keyof Campuri, string>>>({});
  const [comanda, setComanda] = useState<string | null>(null);

  useEffect(() => {
    setArticole(citesteCos());
    setIncarcat(true);
    return asculta(setArticole);
  }, []);

  const set = (camp: keyof Campuri) => (v: string) => {
    setC((s) => ({ ...s, [camp]: v }));
    setErori((s) => ({ ...s, [camp]: undefined }));
  };

  function valideaza(): boolean {
    const e: Partial<Record<keyof Campuri, string>> = {};
    if (c.nume.trim().length < 3) e.nume = 'Scrie numele complet.';
    if (!eEmail(c.email)) e.email = 'Verifică adresa de e-mail.';
    if (!eTelefon(c.telefon)) e.telefon = 'Un număr de telefon românesc, de forma 07xx xxx xxx.';
    if (c.livrareTip === 'curier') {
      if (c.adresa.trim().length < 6) e.adresa = 'Strada, numărul și, dacă e cazul, blocul.';
      if (c.oras.trim().length < 2) e.oras = 'Scrie localitatea.';
      if (c.judet.trim().length < 2) e.judet = 'Scrie județul.';
    }
    setErori(e);
    return Object.keys(e).length === 0;
  }

  function trimite(ev: FormEvent) {
    ev.preventDefault();
    if (!valideaza()) {
      const primul = document.querySelector<HTMLElement>('[aria-invalid="true"]');
      primul?.focus();
      return;
    }
    // TODO(real): comandă în Medusa/Supabase + plată Stripe Checkout sau Netopia,
    // e-mail de confirmare prin Resend, AWB la curier.
    const numar = `C-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setComanda(numar);
    goleste();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (comanda) {
    return (
      <div className="final-confirmare">
        <span className="stamp">Comandă înregistrată</span>
        <h2>Mulțumim. Comanda e la noi.</h2>
        <dl className="final-numar">
          <div className="spec-row">
            <dt>Număr comandă</dt>
            <span className="spec-dots" aria-hidden="true" />
            <dd>{comanda}</dd>
          </div>
        </dl>
        <p>
          Ți-am trimis confirmarea pe {c.email || 'adresa ta de e-mail'}. Dacă ai prins ziua de
          prăjire, punga pleacă din prăjitorie mâine dimineață.
        </p>
        <p className="final-avertisment">
          Acesta este un magazin demonstrativ: nu s-a plasat nicio comandă reală și nu a fost
          încasat niciun leu.
        </p>
        <a href={cale('/cafea')} className="btn btn-primary">
          Înapoi la raft
        </a>
      </div>
    );
  }

  if (!incarcat) return <p className="cos-asteptare">Se încarcă…</p>;

  if (articole.length === 0) {
    return (
      <div className="cos-gol">
        <p className="field-label">Coșul e gol</p>
        <h2>Nu poți finaliza un coș gol.</h2>
        <a href={cale('/cafea')} className="btn btn-primary">
          Vezi cafelele
        </a>
      </div>
    );
  }

  const t = c.livrareTip === 'ridicare' ? 0 : livrare(articole);
  const deplata = subtotal(articole) + t;

  return (
    <form className="final-grila" onSubmit={trimite} noValidate>
      <div className="final-campuri">
        <fieldset className="final-bloc">
          <legend className="field-label">Cine primește comanda</legend>
          <Camp
            id="nume"
            eticheta="Nume și prenume"
            valoare={c.nume}
            seteaza={set('nume')}
            eroare={erori.nume}
            autoComplete="name"
          />
          <div className="final-doua">
            <Camp
              id="email"
              tip="email"
              eticheta="E-mail"
              valoare={c.email}
              seteaza={set('email')}
              eroare={erori.email}
              autoComplete="email"
            />
            <Camp
              id="telefon"
              tip="tel"
              eticheta="Telefon"
              valoare={c.telefon}
              seteaza={set('telefon')}
              eroare={erori.telefon}
              autoComplete="tel"
            />
          </div>
        </fieldset>

        <fieldset className="final-bloc">
          <legend className="field-label">Livrare</legend>
          <div className="filtre-optiuni">
            <button
              type="button"
              className="chip"
              aria-pressed={c.livrareTip === 'curier'}
              onClick={() => setC((s) => ({ ...s, livrareTip: 'curier' }))}
            >
              Curier, 1–2 zile
            </button>
            <button
              type="button"
              className="chip"
              aria-pressed={c.livrareTip === 'ridicare'}
              onClick={() => setC((s) => ({ ...s, livrareTip: 'ridicare' }))}
            >
              Ridic din prăjitorie
            </button>
          </div>

          {c.livrareTip === 'curier' ? (
            <>
              <Camp
                id="adresa"
                eticheta="Adresă"
                valoare={c.adresa}
                seteaza={set('adresa')}
                eroare={erori.adresa}
                autoComplete="street-address"
              />
              <div className="final-doua">
                <Camp
                  id="oras"
                  eticheta="Localitate"
                  valoare={c.oras}
                  seteaza={set('oras')}
                  eroare={erori.oras}
                  autoComplete="address-level2"
                />
                <Camp
                  id="judet"
                  eticheta="Județ"
                  valoare={c.judet}
                  seteaza={set('judet')}
                  eroare={erori.judet}
                  autoComplete="address-level1"
                />
              </div>
            </>
          ) : (
            <p className="final-ridicare">
              Strada Postăvarului 14, Brașov. Luni–vineri 08:30–18:00, sâmbătă 09:00–15:00. Te
              anunțăm pe telefon când e gata.
            </p>
          )}
        </fieldset>

        <fieldset className="final-bloc">
          <legend className="field-label">Plată</legend>
          <div className="filtre-optiuni">
            <button
              type="button"
              className="chip"
              aria-pressed={c.plata === 'card'}
              onClick={() => setC((s) => ({ ...s, plata: 'card' }))}
            >
              Card online
            </button>
            <button
              type="button"
              className="chip"
              aria-pressed={c.plata === 'ramburs'}
              onClick={() => setC((s) => ({ ...s, plata: 'ramburs' }))}
            >
              Ramburs la curier
            </button>
          </div>
          <p className="final-nota">
            {c.plata === 'card'
              ? 'În magazinul real, plata cu cardul se face pe pagina securizată a procesatorului.'
              : 'Plătești curierului la primire. Rambursul se poate taxa suplimentar de firma de curierat.'}
          </p>
        </fieldset>

        <fieldset className="final-bloc">
          <legend className="field-label">Altceva</legend>
          <label className="camp">
            <span>Observații pentru prăjitorie</span>
            <textarea
              rows={3}
              value={c.observatii}
              onChange={(e) => set('observatii')(e.target.value)}
              placeholder="De exemplu: măcinați pentru o Moka de trei cești."
            />
          </label>
        </fieldset>
      </div>

      <aside className="final-sumar" aria-label="Comanda ta">
        <h2 className="field-label">Comanda ta</h2>
        <ul className="final-lista">
          {articole.map((a) => (
            <li key={a.id}>
              <span className="final-cant">{a.cant}×</span>
              <span>
                <strong>{a.titlu}</strong>
                <br />
                <span className="final-varianta">{a.varianta}</span>
              </span>
              <span className="final-pret">{lei(a.pret * a.cant)} lei</span>
            </li>
          ))}
        </ul>

        <dl className="cos-sumar-lista">
          <div className="spec-row">
            <dt>Produse</dt>
            <span className="spec-dots" aria-hidden="true" />
            <dd>{lei(subtotal(articole))} lei</dd>
          </div>
          <div className="spec-row">
            <dt>Livrare</dt>
            <span className="spec-dots" aria-hidden="true" />
            <dd>{t === 0 ? 'gratuită' : `${lei(t)} lei`}</dd>
          </div>
        </dl>

        <p className="cos-total">
          <span>De plată</span>
          <span>{lei(deplata)} lei</span>
        </p>

        <button type="submit" className="btn btn-primary cos-buton">
          Trimite comanda
        </button>
        <p className="final-avertisment">
          Magazin demonstrativ. Nu se procesează plăți și nu se trimit date nicăieri.
        </p>
      </aside>
    </form>
  );
}

function Camp({
  id,
  eticheta,
  valoare,
  seteaza,
  eroare,
  tip = 'text',
  autoComplete,
}: {
  id: string;
  eticheta: string;
  valoare: string;
  seteaza: (v: string) => void;
  eroare?: string;
  tip?: string;
  autoComplete?: string;
}) {
  return (
    <label className="camp" htmlFor={id}>
      <span>{eticheta}</span>
      <input
        id={id}
        type={tip}
        value={valoare}
        autoComplete={autoComplete}
        aria-invalid={eroare ? 'true' : undefined}
        aria-describedby={eroare ? `${id}-eroare` : undefined}
        onChange={(e) => seteaza(e.target.value)}
      />
      {eroare && (
        <span className="camp-eroare" id={`${id}-eroare`}>
          {eroare}
        </span>
      )}
    </label>
  );
}
