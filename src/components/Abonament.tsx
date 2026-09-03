import { useState } from 'react';
import { adauga } from '../lib/cos';
import { lei } from '../lib/format';
import { cale } from '../lib/cale';

const PROFILE = [
  { val: 'fructat', text: 'Fructat și viu', culoare: '#c9a227' },
  { val: 'echilibrat', text: 'Echilibrat și dulce', culoare: '#2f6b4f' },
  { val: 'intens', text: 'Intens și cacao', culoare: '#7a4a2a' },
  { val: 'surprinde', text: 'Surprinde-mă', culoare: '#2a2724' },
] as const;

const FRECVENTE = [
  { val: '2 săptămâni', text: 'La 2 săptămâni' },
  { val: '4 săptămâni', text: 'La 4 săptămâni' },
] as const;

const GRAMAJE = [
  { val: '250 g' as const, pret: 52 },
  { val: '1 kg' as const, pret: 176 },
];

const MACINARI = ['Boabe întregi', 'Espresso', 'Filtru, V60', 'Cafetieră'];

export default function Abonament() {
  const [profil, setProfil] = useState<(typeof PROFILE)[number]['val']>('echilibrat');
  const [frecventa, setFrecventa] = useState<(typeof FRECVENTE)[number]['val']>('4 săptămâni');
  const [gramaj, setGramaj] = useState<'250 g' | '1 kg'>('250 g');
  const [macinare, setMacinare] = useState(MACINARI[0]);
  const [adaugat, setAdaugat] = useState(false);

  const alesProfil = PROFILE.find((p) => p.val === profil)!;
  const pret = GRAMAJE.find((g) => g.val === gramaj)!.pret;

  function trimite() {
    // TODO(real): abonament recurent (Stripe Billing / Medusa subscriptions), nu simplu articol în coș.
    adauga({
      id: `abonament|${profil}|${frecventa}|${gramaj}|${macinare}`,
      slug: 'abonament',
      titlu: 'Abonament de cafea',
      varianta: `${alesProfil.text} · ${frecventa} · ${gramaj} · ${macinare}`,
      pret,
      culoare: alesProfil.culoare,
      origine: 'Abonament',
      regiune: frecventa,
      gramaj,
    });
    setAdaugat(true);
    window.setTimeout(() => setAdaugat(false), 6000);
  }

  return (
    <div className="config">
      <div className="config-campuri">
        <fieldset className="optiune">
          <legend className="filtre-titlu">Ce cafea vrei să primești</legend>
          <div className="filtre-optiuni">
            {PROFILE.map((p) => (
              <button
                key={p.val}
                type="button"
                className="chip"
                aria-pressed={profil === p.val}
                onClick={() => setProfil(p.val)}
              >
                {p.text}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="optiune">
          <legend className="filtre-titlu">Cât de des</legend>
          <div className="filtre-optiuni">
            {FRECVENTE.map((f) => (
              <button
                key={f.val}
                type="button"
                className="chip"
                aria-pressed={frecventa === f.val}
                onClick={() => setFrecventa(f.val)}
              >
                {f.text}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="optiune">
          <legend className="filtre-titlu">Cât</legend>
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
                <span className="chip-pret">{lei(g.pret)} lei</span>
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="optiune">
          <legend className="filtre-titlu">Cum o măcinăm</legend>
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
        </fieldset>
      </div>

      <aside className="config-sumar">
        <h2 className="field-label">Abonamentul tău</h2>
        <dl className="config-fisa">
          <div className="spec-row">
            <dt>Profil</dt>
            <span className="spec-dots" aria-hidden="true" />
            <dd>{alesProfil.text}</dd>
          </div>
          <div className="spec-row">
            <dt>Frecvență</dt>
            <span className="spec-dots" aria-hidden="true" />
            <dd>{frecventa}</dd>
          </div>
          <div className="spec-row">
            <dt>Cantitate</dt>
            <span className="spec-dots" aria-hidden="true" />
            <dd>{gramaj}</dd>
          </div>
          <div className="spec-row">
            <dt>Măcinare</dt>
            <span className="spec-dots" aria-hidden="true" />
            <dd>{macinare}</dd>
          </div>
          <div className="spec-row">
            <dt>Transport</dt>
            <span className="spec-dots" aria-hidden="true" />
            <dd>inclus</dd>
          </div>
        </dl>

        <p className="cos-total">
          <span>Per livrare</span>
          <span>{lei(pret)} lei</span>
        </p>

        <button type="button" className="btn btn-primary cos-buton" onClick={trimite}>
          Pornește abonamentul
        </button>

        <p className="confirmare" role="status" aria-live="polite">
          {adaugat ? (
            <>
              Adăugat în coș. <a href={cale('/cos')} className="link-rule">Vezi coșul</a>
            </>
          ) : (
            'Îl poți opri sau amâna oricând, dintr-un e-mail.'
          )}
        </p>
      </aside>
    </div>
  );
}
