/**
 * Stelele de pe card. Nu sunt recenzii inventate: scorul de cupping (80–90 pe
 * scara SCA) e adus pe cinci stele, iar valoarea reală se citește la hover.
 */
export default function Stele({ scor }: { scor: number }) {
  const din5 = Math.max(0, Math.min(5, (scor - 79) / 2));
  const titlu = `Scor de cupping ${scor.toString().replace('.', ',')} din 100`;

  return (
    <p className="stele" title={titlu}>
      <span className="stele-pista" aria-hidden="true">
        <span className="stele-goale">★★★★★</span>
        <span className="stele-pline" style={{ width: `${(din5 / 5) * 100}%` }}>
          ★★★★★
        </span>
      </span>
      <span className="stele-numar">{scor.toString().replace('.', ',')}</span>
      <span className="sr-live">{titlu}</span>
    </p>
  );
}
