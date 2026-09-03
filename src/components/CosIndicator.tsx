import { useEffect, useState } from 'react';
import { asculta, citesteCos, numaraBucati } from '../lib/cos';
import { cale } from '../lib/cale';

export default function CosIndicator() {
  const [bucati, setBucati] = useState(0);

  useEffect(() => {
    setBucati(numaraBucati(citesteCos()));
    return asculta((articole) => setBucati(numaraBucati(articole)));
  }, []);

  return (
    <a href={cale('/cos')} className="cos-link" aria-label={`Coș, ${bucati} produse`}>
      <svg viewBox="0 0 20 20" aria-hidden="true" width="18" height="18">
        <path
          d="M3 5h2.2l1.6 8.4a1.6 1.6 0 0 0 1.57 1.3h6.1a1.6 1.6 0 0 0 1.57-1.28L17.4 7.4H6.2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="9" cy="17.2" r="1.15" fill="currentColor" />
        <circle cx="15" cy="17.2" r="1.15" fill="currentColor" />
      </svg>
      <span className="eticheta">Coș</span>
      <span className="numar" data-plin={bucati > 0}>
        {bucati}
      </span>
    </a>
  );
}
